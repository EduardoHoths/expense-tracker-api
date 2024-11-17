import "dotenv/config";
import express, { Application } from "express";
import { json } from "body-parser";
import userRoutes from "./routes/user-routes";
import expenseRoutes from "./routes/expense-routes";
import authRoutes from "./routes/auth-routes";

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
    this.app.use("/api/expenses", expenseRoutes);
    this.app.use("/api/auth", authRoutes);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
