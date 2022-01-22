import { Service, Inject } from 'typedi'
import jwt from 'jsonwebtoken'
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { IUser, IUserInputDTO } from '@/interfaces/IUser'
import config from '@/config'
import { randomBytes } from 'crypto'
import argon2 from 'argon2'
import events from '@/subscribers/events'

@Service()
export default class UserService {
  constructor(
    @Inject('userModal') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser, token: string }> {
    try {
      const salt = randomBytes(32)

      const hashedPassword = await argon2.hash(userInputDTO.password, { salt })
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      })

      if (!userRecord) {
        throw new Error('User could not be created')
      }

      const token = this.generateToken(userRecord)
      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord })

      const user = userRecord.toObject() as IUser
      Reflect.deleteProperty(user, 'password')
      Reflect.deleteProperty(user, 'salt')

      return { user, token }
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  private generateToken(user: IUser): string {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    const { _id, role, name } = user

    return jwt.sign({
      _id,
      role,
      name,
      exp: exp.getTime() / 1000,
    }, config.jwtSecret)
  }
}
