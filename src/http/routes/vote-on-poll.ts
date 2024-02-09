import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function voteOnPoll(app:FastifyInstance){
    app.post("/polls/:pollId/votes", async(req,reply) =>{


        const voteOnPollBody = z.object({
            pollOptionId:z.string().uuid()
        })

        const voteOnPollParams = z.object({
            pollId:z.string().uuid()
        })

        const {pollId} =  voteOnPollParams.parse(req.params)
        const {pollOptionId} =  voteOnPollBody.parse(req.body)

    try {
        return reply.status(200).send()
    } catch (error) {
        return reply.status(500).send()
    }
    
    
    })
}