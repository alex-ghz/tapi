import { Router } from 'express'

import useUserRoutes from './routes/user'

export default () => {
    const app = Router()

    useUserRoutes(app)

    return app
}
