import axios, { AxiosResponse } from "axios"

interface From {
  email: string
}
interface Personalization {
  to: From[]
  custom_args: any
}

interface Payload {
  from: From
  personalizations: Personalization[]
  template_id: string
}

export class SendGridService {
  protected apiKey: string;
  protected apiUrl = "https://api.sendgrid.com/v3/mail/send";

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmails(data: Payload): Promise<{ success: boolean, data?: AxiosResponse }> {
    try {
      const res = await axios.post(this.apiUrl, data, this.config)
      return {
        success: true,
        data: res.data
      }
    } catch (error) {
      return { success: false }
    }
  }

  get config() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    }
  }

  static lazyLoadRecipients(arr: any, len: number): { id: string, attributes: any }[][] {
    let chunks = [], i = 0, n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }
}