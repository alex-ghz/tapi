import express from 'express'
import cors from 'cors'
import { OpticMiddleware } from '@useoptic/express-middleware'
import routes from '@/api';
import config from '@/config';

export default ({ app }: { app: express.Application }) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.enable('trust proxy');
    app.use(cors());
    app.use(express.json());
    app.use(config.api.prefix, routes());

    app.use(OpticMiddleware({
        enabled: process.env.NODE_ENV !== 'production',
    }));
}
