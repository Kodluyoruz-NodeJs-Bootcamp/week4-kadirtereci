import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { getConnection } from "typeorm";
import { TypeormStore } from "typeorm-store";
import { createConnection } from "typeorm";
import * as cors from "cors";
import * as session from "express-session";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import { Session } from "entities/session.entity";

class App {
  public app: express.Application;

  private readonly sessionRepository: any;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.sessionRepository = getConnection().getRepository(Session);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.set("trust proxy", 1);

    //* Using session with TypeORM
    this.app.use(
      session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({ repository: this.sessionRepository }),
      })
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}

export default App;
