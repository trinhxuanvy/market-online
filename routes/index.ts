import { Application, Router } from 'express';
import systemUserRoute from './SystemUserRoute';
import storeRoute from './storeRoute';

const routes = Router();

routes.use(systemUserRoute);
routes.use(storeRoute);

export default routes;
