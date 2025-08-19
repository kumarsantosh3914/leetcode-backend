import express from 'express';
import pingRouter from './ping.router';
import categoryRouter from './category.router';
import companyRouter from './company.router';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use("/companies", companyRouter);

export default v1Router;