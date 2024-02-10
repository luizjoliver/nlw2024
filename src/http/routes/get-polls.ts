import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export async function getPolls(app:FastifyInstance){
    app.get("/polls/:pollId", async(req,reply) =>{


        const getPollParams = z.object({
            pollId:z.string().uuid()
        })


        const {pollId} =  getPollParams.parse(req.params)
    
        try {
    
           const poll =  await prisma.poll.findUnique({
                where:{
                    id:pollId
                },
                include:{
                    options:{
                        select:{
                            title:true,
                            id:true
                        }
                    }
                }
            })

            if(!poll){
                return reply.status(404).send({message:"Error to find a poll"})
            }
    
            const result = await redis.zrange(pollId,0,-1,"WITHSCORES")

            
            const votes = result.reduce((obj,line,index) =>{
                if(index % 2 == 0){
                    const score = result[index + 1]

                    Object.assign(obj,{[line]:Number(score)})

                    
                }

                return obj
            },{} as Record<string,number>)

            return reply.status(200).send({
                poll:{
                    id:poll.id,
                    title:poll.title,
                    options: poll.options.map(option =>{
                        return{
                            id:option.id,
                            title:option.title,
                            score: (option.id in votes) ? votes[option.id] : 0
                        }
                    })

                }
            })
    
        } catch (error) {
            console.log(error);
            reply.status(500).send({message:"Internal Error"})
            
        }

    })
}