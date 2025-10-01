import express from "express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/middlware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)

app.use(errorHandler);

export default app