import mongoose, { Schema } from "mongoose"
import { ReportStatus } from "../events/types/report-status";

export { ReportStatus }

interface ReportAttrs {
  audienceId: string
  templateId: string
  status: ReportStatus
  userId: number
  recipients: any[]
  sender: string
}

interface ReportDoc extends mongoose.Document {
  audienceId: string
  templateId: string
  status: ReportStatus
  userId: number
  recipients: any[]
  sender: string
}

interface ReportModel extends mongoose.Model<ReportDoc> {
  build(attrs: ReportAttrs): ReportDoc;
}

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  audienceId: {
    type: String,
    required: true
  },
  templateId: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(ReportStatus),
    default: ReportStatus.Pending
  },
  recipients: {
    type: Array,
    required: true
  }
})

reportSchema.set('timestamps', true)

reportSchema.statics.build = (attrs: ReportAttrs) => {
  return new Report(attrs)
}

const Report = mongoose.model<ReportDoc, ReportModel>('Report', reportSchema)

export { Report }