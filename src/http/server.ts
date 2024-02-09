import fastify from "fastify"
import { createPoll } from "./routes/create-poll"
import { getPolls } from "./routes/get-polls"
import { voteOnPoll } from "./routes/vote-on-poll"


const app = fastify()



app.register(createPoll)
app.register(getPolls)
app.register(voteOnPoll)

app.listen({port:3333}).then(() =>{
    console.log("http server running");
    
})
