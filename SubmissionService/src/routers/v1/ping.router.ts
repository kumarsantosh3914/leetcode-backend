import express from 'express';
import { pingHandler } from '../../controllers/ping.controller';
import { pingSchema } from '../../validators/ping.validators';
import { validateRequestBody } from '../../validators';

const pingRouter = express.Router();

pingRouter.get('/', validateRequestBody(pingSchema), pingHandler);

pingRouter.get('/helth', (req, res) => {
    res.status(200).json('OK');
});

export default pingRouter;