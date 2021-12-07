import { Message } from "kafkajs"
import { Consumer, Topics, AudienceActivatedEvent } from "@navegg/common"
import { Report, ReportStatus } from "../../models/reports"
import { kafkaGroupName } from "./kafka-group-name"
import { SendGridService } from "../../services/sendgrid-service"

async function mockSendEmail() {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 2000);
  })
}

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

    let report = null

    try {
      report = Report.build({
        userId,
        audienceId,
        templateId,
        recipients,
        sender,
        status: ReportStatus.Pending,
        successful: undefined,
        unsuccessful: undefined,
      })
      report.save()
      console.log('CREATED @@@')

    } catch (error) {
      console.log('@@@ Error creating Report', error)
    }

    // SendGrid Service
    const sendGridSvc = new SendGridService(apiKey)
    const chunks = SendGridService.lazyLoadRecipients(recipients, 1000)

    report?.set({status: ReportStatus.Progress})

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
        } else {
          // send contact to a list of customers without email
        }
      })

      const ok = await mockSendEmail()
      // notify user about the progress

      const response = await sendGridSvc.sendEmails({
        template_id: templateId,
        from: { email: sender },
        //@ts-ignore
        personalizations: personalizations_data,
      })

      if (response.success == false) {
        report?.set({status: ReportStatus.Failed, unsuccessful: personalizations_data})
        break;
      } else {
        report?.set({status: ReportStatus.Completed, successful: personalizations_data})
      }


    }
  }
}