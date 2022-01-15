import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthTokenMissingException from "../exceptions/AuthTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

async function authMiddleware(
  request: any,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  const session: any = request.session;
  console.log(request.session);

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const { id, browserInfo } = verificationResponse;
      if (browserInfo === session.browserInfo) {
        console.log("same browser");
      }
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthTokenMissingException());
  }
}

export default authMiddleware;
