import expressLoader from './express'
import mongooseLoader from './mongoose'
import dependencyInjectorLoader from './dependencyInjector'

import Logger from './logger'

export default async ({ expressApp }: any) => {
    Logger.info('Waking up loaders...')

    const mongoConnection = await mongooseLoader()
    Logger.info('✌️ DB loaded and connected!')

    const userModel = {
      name: 'userModel',
      model: require('../models/user').default,
    }

    const { agenda } = await dependencyInjectorLoader({
      mongoConnection,
      models: [
        userModel,
      ],
    })
    Logger.info('✌️ Dependency Injector loaded')

    await expressLoader({ app: expressApp })
    Logger.info('✌️ Express loaded')
}
