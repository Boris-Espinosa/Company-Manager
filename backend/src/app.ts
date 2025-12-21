import express from "express";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

class App {
  public app: express.Application;
  public port: number;
  public dataSource: DataSource;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;
    this.initializeModels();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private async initializeModels() {
    const dataSource = new DataSource({
      type: "mysql",
      host: process.env.HOST,
      port: Number(process.env.DB_PORT ?? "3306"),
      username: process.env.USERNAME ?? "root",
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      synchronize: true,
      logging: true,
      entities: ["src/models/**/*.ts"],
      migrations: ["src/migrations/**/*.ts"],
    });

    await dataSource.initialize();
    if (!dataSource.isInitialized) {
      throw new Error("Error connecting to database");
    }
    this.dataSource = dataSource;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
