import * as bcrypt from "bcrypt";
import { IsUUID } from "class-validator";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import User from "users/user.interface";
import EmailAlreadyExistsException from "../exceptions/EmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import Controller from "../interfaces/controller.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import TokenData from "../interfaces/tokenData.interface";
import CreateUserDto from "../users/user.dto";
import userModel from "./../users/user.model";
import LogInDto from "./logIn.dto";
import { v4 as uuidv4 } from "uuid";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/login`, this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new EmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        id: uuidv4(),
        password: hashedPassword,
      });
      const sessData: any = request.session;
      sessData.browserInfo = request.headers["user-agent"];
      sessData.userId = user._id;
      user.password = undefined;
      const tokenData = this.createToken(user, request.headers["user-agent"]);
      response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      response.setHeader("Access-Control-Allow-Credentials", "true");

      response.send(user);
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatched = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatched) {
        user.password = undefined;
        const tokenData = this.createToken(user, request.headers["user-agent"]);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        // response.setHeader("Access-Control-Allow-Credentials", "true");

        const sessData: any = request.session;
        sessData.browserInfo = request.headers["user-agent"];
        sessData.userId = user._id;

        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", [
      "Authorization=;sameSite: 'none'; HttpOnly; Max-age=0",
    ]);
    response.send(200);
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User, browserInfo: string): TokenData {
    const expiresIn = 600 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user._id,
      browserInfo: browserInfo,
      name: user.name,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationController;
