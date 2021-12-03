import { Message } from "kafkajs"
import { Consumer, Topics, AudienceActivatedEvent } from "@navegg/common"
import { Report, ReportStatus } from "../../models/reports"
import { kafkaGroupName } from "./kafka-group-name"
import { SendGridService } from "../../services/sendgrid-service"

export class AudienceActivatedConsumer extends Consumer<AudienceActivatedEvent> {
  topic: Topics.AudienceActivated = Topics.AudienceActivated
  queueGroupName = kafkaGroupName

  async onMessage(data: AudienceActivatedEvent['data'], msg: Message) {
    const {
      userId,
      audienceId,
      templateId,
      recipients,
      sender,
      apiKey
    } = data

    const report = Report.build({
      userId,
      audienceId,
      templateId,
      recipients,
      sender,
      status: ReportStatus.Pending
    })

    // report.save()

    // SendGrid Service
    const sendGridSvc = new SendGridService(apiKey)

    const chunks = SendGridService.lazyLoadRecipients(recipients, 1000);

    // send emails by ckunk
    for (let index = 0; index < chunks.length; index++) {
      const element = chunks[index];
      const personalizations_data = element.map(contact => {
        // only add customers with email
        if (contact.attributes?.email) {
          return {
            to: [{ email: contact.attributes.email }],
            custom_args: {
              audience_id: audienceId
            }
          }
        }
      });

      const response = await sendGridSvc.sendEmails({
        template_id: templateId,
        from: { email: sender },
        //@ts-ignore
        personalizations: personalizations_data,
      })

      if (response.success) {
        console.log('success')
      } else {
        console.log('error')
      }
      // update progress
      // emit event to frontend
    }
  }
}