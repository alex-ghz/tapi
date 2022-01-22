import Agenda from 'agenda'
import config from '@/config'

export default ({ mongoConnection }: any) => {
  return new Agenda({
    mongo: mongoConnection,
    db: { collection: config.agenda.dbCollection },
    processEvery: config.agenda.pooltime,
    maxConcurrency: config.agenda.concurrency,
  })
}
