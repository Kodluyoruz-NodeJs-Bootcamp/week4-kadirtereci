import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as session from "express-session";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    const MongoDbSession = require("connect-mongodb-session")(session);
    const store = new MongoDbSession({
      uri: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      collection: "sessions",
    });
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    this.app.set("trust proxy", 1);
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true, maxAge: 200000 },
        store: store,
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
