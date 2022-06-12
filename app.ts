import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import listEndpoints from "express-list-endpoints";
import routes from "./routes";
import { getApiTable } from "./utils";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "2MB",
  })
);
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
  console.log("========= List api =========");
  console.log(getApiTable(listEndpoints(app)));
});
