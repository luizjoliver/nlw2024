import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

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
    
            return reply.status(200).send({poll})
    
        } catch (error) {
            console.log(error);
            reply.status(500).send({message:"Error to find a poll"})
            
        }

    })
}