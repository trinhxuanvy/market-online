import { Application, Router } from "express";
import systemUserRoute from "./SystemUserRoute";

const routes = Router();

routes.use(systemUserRoute);

export default routes;
