import { Application, Router } from 'express';
import systemUserRoute from './SystemUserRoute';
import storeRoute from './StoreRoute';
import saleOrderRoute from './SaleOrderRoute';

const routes = Router();

routes.use(systemUserRoute);
routes.use(storeRoute);
routes.use(saleOrderRoute);

export default routes;
