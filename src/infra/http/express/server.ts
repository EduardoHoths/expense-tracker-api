import express, { Application } from "express";
import { json } from "body-parser";
import userRoutes from "./routes/user-routes";

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares() {
    this.app.use(json());
  }

  private setupRoutes() {
    this.app.use("/api/users", userRoutes);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
