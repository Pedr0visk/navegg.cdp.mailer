import express from 'express';
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from "@navegg/common"

import { ReportsRouter } from './routes'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(ReportsRouter)

// app.all('*', async (req: Request, res: Response) => {
//   throw new NotFoundError();
// })

app.use(errorHandler)

export { app }