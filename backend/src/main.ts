import App from "./app.ts";
import dotenv from "dotenv";
dotenv.config();

const controllers = [];
const PORT = Number(process.env.PORT ?? "3000");
const app = new App(controllers, PORT);

app.listen();

export default app;
