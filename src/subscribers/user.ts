import { Container } from 'typedi'
import { EventSubscriber, On } from 'event-dispatch'
import events from './events'
import { IUser } from '@/interfaces/IUser'
import mongoose from 'mongoose'
import { Logger } from 'winston'

@EventSubscriber()
export default class UserSubscriber {
  @On(events.user.signUp)
  public onUserSignUp({ name, email, _id }: Partial<IUser>) {
    const Logger: Logger = Container.get('logger')

    try {
    } catch (error) {
      Logger.error(`🔥 Error on event ${events.user.signUp}: %o`, error)
      throw error
    }
  }
}
