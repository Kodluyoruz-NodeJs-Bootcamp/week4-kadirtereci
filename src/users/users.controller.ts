import UserNotFoundException from "../exceptions/UserNotFoundException";
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "./user.dto";
import User from "./user.interface";
import userModel from "./user.model";

class UsersController implements Controller {
  public path = "/auth/users";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllUsers);
  }

  private getAllUsers = async (request: any, response: express.Response) => {
    const users = await this.user.find();
    response.send(users);
  };

  private createUser = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const userData: CreateUserDto = request.body;
    const createdUser = new this.user({
      ...userData,
      authorId: request.user._id,
    });
    const savedUser = await createdUser.save();
    response.send(savedUser);
  };

  private deleteUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const successResponse = await this.user.findByIdAndDelete(id);
    if (successResponse) {
      response.send(200);
    } else {
      next(new UserNotFoundException(id));
    }
  };
}

export default UsersController;
