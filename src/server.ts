import "dotenv/config";
import UsersController from "./users/users.controller";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostsController from "./posts/posts.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new AuthenticationController(), new UsersController()]);

app.listen();
