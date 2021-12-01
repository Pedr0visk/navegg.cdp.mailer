// import mongoose from 'mongoose'

import { kafkaWrapper } from "./kafka-wrapper"
import { AudienceActivatedConsumer } from "./events/consumers/audience-activated-consumer"

const dotenv = require('dotenv');
dotenv.config();

const start = async () => {
  // verify envs
  if (!process.env.SECRET_JWT) {
    throw new Error('SECRET_JWT must be defined')
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('KAFKA_BROKERS must be defined')
  }

  try {
    await kafkaWrapper.connect('mailer-kafka', process.env.KAFKA_BROKERS.split(','))
    new AudienceActivatedConsumer(kafkaWrapper.client).listen()

    // await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    // })

  } catch (error) {
    console.log('Starting app failed.', error)
  }
}

start()