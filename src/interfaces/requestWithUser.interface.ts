import { Request } from "express";
import User from "users/user.interface";

interface RequestWithUser extends Request {
  user: User;
  cookies: any;
  browserInfo: any;
}

export default RequestWithUser;
