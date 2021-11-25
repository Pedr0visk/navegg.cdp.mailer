import { Kafka } from "kafkajs"

class KafkaWrapper {
  private _client?: Kafka

  get client() {
    if (!this._client) {
      throw new Error('Cannot access KAFKA client before connecting')
    }

    return this._client
  }

  connect(clientId: string, brokers: string[]) {
    return new Promise<void>((resolve, reject) => {
      this._client = new Kafka({ clientId, brokers })
      resolve()
    })
  }
}

export const kafkaWrapper = new KafkaWrapper()