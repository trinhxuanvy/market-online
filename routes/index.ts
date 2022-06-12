import { Application, Router } from 'express';
import systemUserRoute from './SystemUserRoute';
import storeRoute from './StoreRoute';
import saleOrderRoute from './SaleOrderRoute';
import productRoute from './ProductRoute';
import saleOrderDetailRoute from './SaleOrderDetailRoute';

const routes = Router();

routes.use(systemUserRoute);
routes.use(storeRoute);
routes.use(saleOrderDetailRoute);
routes.use(saleOrderRoute);
routes.use(productRoute);

export default routes;
