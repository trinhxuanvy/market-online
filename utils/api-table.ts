import Table from "cli-table";
import { Endpoint } from "express-list-endpoints";

export const getApiTable = (appRoutes: Endpoint[]) => {
  let tableApi = new Table({
    head: ["Method", "Api", "Middleware"],
    colWidths: [25, 40, 35],
  });

  appRoutes.forEach((item) => {
    tableApi.push([item.methods, item.path, item.middlewares]);
  });

  return tableApi.toString();
};
