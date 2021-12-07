import { Document, Schema, model, Model } from "mongoose";
import { ReportStatus } from "@navegg/common";

export { ReportStatus }

interface ReportAttrs {
  userId: number
  audienceId: string
  templateId: string
  status: ReportStatus
  recipients: any[]
  successful?: any[]
  unsuccessful?: any[]
  sender: string
}

interface ReportDoc extends Document {
  userId: number
  audienceId: string
  templateId: string
  status: ReportStatus
  recipients: any[]
  successful?: any[]
  unsuccessful?: any[]
  sender: string
}

interface ReportModel extends Model<ReportDoc> {
  build(attrs: ReportAttrs): ReportDoc;
}

const reportSchema = new Schema(
  {
    userId: {
      type: Number,
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
    },
    successful: {
      type: Array,
      required: false
    },
    unsuccessful: {
      type: Array,
      required: false
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
)

reportSchema.set('timestamps', true)

reportSchema.statics.build = (attrs: ReportAttrs) => {
  return new Report(attrs)
}

const Report = model<ReportDoc, ReportModel>('Report', reportSchema)

export { Report }