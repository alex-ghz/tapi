import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { Logger } from 'winston'
import { IUserInputDTO } from '@/interfaces/IUser';
import UserService from '@/services/user'

const router = Router()

export default (app: Router) => {
    app.use('/user', router)

    router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger')
      logger.debug('Creating user..')

      try {
        const userServiceInstance = Container.get(UserService)
        const { user, token } = await userServiceInstance.SignUp(req.body as IUserInputDTO)

        return res.status(201).json({ user, token })
      } catch (error) {
        logger.error('🔥 error: %o', error)
        return next(error)
      }
    })
}
