import express, { Request, Response } from 'express'
import { currentUser, requireAuth, ServerError } from "@navegg/common"

import { Report } from '../models/reports'

const router = express.Router()

router.get('/api/reports/', currentUser, requireAuth, async (req: Request, res: Response) => {
  try {
    const reports = await Report.find({
      accountId: req.currentUser!.accountId
    })
    res.send({
      results: reports.length,
      data: reports
    })
  } catch (err) {
    throw ServerError
  }
})

export { router as ReportsRouter }
