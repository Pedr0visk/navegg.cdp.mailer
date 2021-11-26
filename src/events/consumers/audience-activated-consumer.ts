import { Message } from "kafkajs"
import { Consumer, Topics, AudienceActivatedEvent } from "@navegg/common"
import { Report } from "../../models/reports"
import { kafkaGroupName } from "./kafka-group-name"

export class AudienceActivatedConsumer extends Consumer<AudienceActivatedEvent> {
  topic: Topics.AudienceActivated = Topics.AudienceActivated
  queueGroupName = kafkaGroupName

  async onMessage(data: AudienceActivatedEvent['data'], msg: Message) {
    const {
      userId,
      audienceId,
      templateId,
      recipients,
      sender
    } = data

    const report = Report.build({
      userId,
      audienceId,
      templateId,
      recipients,
      sender,
    })
    await report.save()
    console.log('successfully created!')
  }
}