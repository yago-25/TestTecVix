import "express-async-errors";
import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { logs } from "./middlewares/logs";
import { routes } from "./routes/_index";
import { notImplemented } from "./middlewares/notImplemented";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./swagger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(express.static("public"));
app.use(logs);
app.use(routes);
setupSwagger(app);
app.use(notImplemented);
app.use(errorHandler as unknown as ErrorRequestHandler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };
