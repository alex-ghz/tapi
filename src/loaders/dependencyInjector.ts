import { Container } from 'typedi'
import formData from 'form-data'
import MailGun from 'mailgun.js'
import LoggerInstance from './logger'
import agendaFactory from './agenda'
import config from '@/config'

export default ({ mongoConnection, models }: { mongoConnection : any, models: { name: string, model: any } [] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model)
    })

    const agendaInstance = agendaFactory({ mongoConnection })
    const mgInstance = new MailGun(formData)

    Container.set('agendaInstace', agendaInstance)
    Container.set('logger', LoggerInstance)
    Container.set('emailClient', mgInstance.client({
      key: config.emails.apiKey,
      username: config.emails.apiUsername,
    }))

    LoggerInstance.info('✌️ Agenda injected into container')
    return { agenda: agendaInstance }
  } catch (error) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', error)
    throw error
  }
}
