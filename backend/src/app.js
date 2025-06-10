import express from 'express'
import cors from 'cors'


const app = express()

app.use(express.urlencoded({limit:'20kb', extended : true}))
app.use(express.json({limit:'20kb'}))
app.use(cors({
    origin : '*',
    credentials : true
}))


// routes

import userRouter from './routes/user.routes.js'
import budgetRouter from './routes/budget.routes.js'

app.use('/api/v1/user', userRouter)
app.use('/api/v1/budget', budgetRouter)

export {app}