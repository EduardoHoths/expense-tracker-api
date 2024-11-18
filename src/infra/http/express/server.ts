import express from "express";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/user-routes";
import { expenseRoutes } from "./routes/expense-routes";
import { authRoutes } from "./routes/auth-routes";

export default class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private configureRoutes() {
    this.app.use("/users", userRoutes);
    this.app.use("/expenses", expenseRoutes);
    this.app.use("/auth", authRoutes);
  }

  public start() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
