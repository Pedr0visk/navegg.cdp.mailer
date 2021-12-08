import { Message } from "kafkajs"
import { Consumer, Topics, AudienceActivatedEvent } from "@navegg/common"
import { Report, ReportStatus } from "../../models/reports"
import { kafkaGroupName } from "./kafka-group-name"
import { SendGridService, IPersonalization, IContact } from "../../services/sendgrid-service"

export class AudienceActivatedConsumer extends Consumer<AudienceActivatedEvent> {
  topic: Topics.AudienceActivated = Topics.AudienceActivated
  queueGroupName = kafkaGroupName

  async onMessage(data: AudienceActivatedEvent['data'], msg: Message) {
    let completed = true

    const {
      userId,
      audienceId,
      templateId,
      recipients,
      sender,
      apiKey
    } = data

    try {
      const report = Report.build({
        userId,
        audienceId,
        templateId,
        recipients,
        sender,
        status: ReportStatus.Progress,
        successful: undefined,
        unsuccessful: undefined,
      })
      report.save()

      // Init SendGrid Service and split recipients in chunks of 1000
      const sendGridSvc = new SendGridService(apiKey)
      const chunks = SendGridService.lazyLoadRecipients(recipients, 1000)

      // send chunks to sendgrid
      for (let index = 0; index < chunks.length; index++) {
        const element: IContact[] = chunks[index];
        const personalizations_data = element.map<IPersonalization>(contact => {
          // only add customers with email
          return {
            to: [{ email: contact.attributes.email }],
            custom_args: {
              audience_id: audienceId
            }
          }
        })

        const response = await sendGridSvc.sendEmails({
          template_id: templateId,
          from: { email: sender },
          personalizations: personalizations_data,
        })

        if (!response.success) {
          console.log('@@@ here')
          report.set({
            status: ReportStatus.Failed,
            successful: chunks.slice(0, index).flat(),
            unsuccessful: chunks.slice(index).flat()
          })
          await report.save()
          completed = false
          break
        }
      }

      if (completed) {
        // if successfully done update report status to completed
        report.set({ status: ReportStatus.Completed, successful: recipients })
        await report.save()
      }

    } catch (error) {
      console.error('@@@ Error creating Report', error)
    }
  }
}