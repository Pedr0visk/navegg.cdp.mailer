import axios, { AxiosResponse } from "axios"

interface Payload {
  from: { email: string }
  personalizations: {
    to: { email: string }[]
    custom_args: any
  }[]
  template_id: string
}

export class SendGridService {
  protected apiKey: string;
  protected apiUrl = "https://api.sendgrid.com/v3/mail/send";

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmails(data: Payload): Promise<AxiosResponse> {
    const res = await axios.post(this.apiUrl, data, this.config)
    return res
  }

  get config() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    }
  }

  static lazyLoadRecipients(arr, len): { id: string, attributes: any }[][] {
    let chunks = [], i = 0, n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }
}