import { kafkaWrapper } from "./kafka-wrapper"
import { AudienceActivatedConsumer } from "./events/consumers/audience-activated-consumer"

const start = async () => {
  // verify envs
  if (!process.env.SECRET_JWT) {
    throw new Error('SECRET_JWT must be defined')
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('KAFKA_BROKERS must be defined')
  }

  try {
    await kafkaWrapper.connect('customers-kafka', process.env.KAFKA_BROKERS.split(','))
    new AudienceActivatedConsumer(kafkaWrapper.client).listen()
  } catch (error) {
    console.log('Starting app failed.', error)
  }
}

start()