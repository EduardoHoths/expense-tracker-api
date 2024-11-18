import express from "express";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/user-routes";

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
  }

  public start() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
