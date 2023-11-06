import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
import { authentication } from './middleware/auth'
import { errorMiddleware } from './middleware/errorMiddleware'


const app: Express = express()
const port = process.env.PORT
const version = process.env.VERSION
const LimitSize = process.env.LimitSize

app.use(cors())
app.use(authentication)

app.use(express.urlencoded({ extended: true, limit: LimitSize }))
app.use(express.json({ limit: LimitSize }))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(`TypeScript Express Server + ECharts v${version}`)
})


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
    console.log(`⚡️[parameters]: Version:${version}, AllowRunFunc:${process.env.AllowRunFunc}, LimitSize:${LimitSize}`)
})