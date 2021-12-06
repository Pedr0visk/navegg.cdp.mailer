import { connect } from 'mongoose';
import dotenv from 'dotenv'

import { kafkaWrapper } from "./kafka-wrapper"
import { notificationWrapper } from "./notification-wrapper"
import { AudienceActivatedConsumer } from "./events/consumers/audience-activated-consumer"
import { app } from './app'

dotenv.config()

const start = async () => {
  // verify envs
  if (!process.env.SECRET_JWT) {
    throw new Error('SECRET_JWT must be defined')
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('KAFKA_BROKERS must be defined')
  }

  try {
    await notificationWrapper.listen()
    await kafkaWrapper.connect('mailer-kafka', process.env.KAFKA_BROKERS.split(','))
    new AudienceActivatedConsumer(kafkaWrapper.client).listen()

    await connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

  } catch (error) {
    console.log('Starting app failed.', error)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })

}

start()