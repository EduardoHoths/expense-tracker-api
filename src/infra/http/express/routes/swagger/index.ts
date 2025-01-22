import { loginSwaggerDoc } from "../auth/auth-routes-swagger";
import { userCreateSwaggerDoc } from "../user/user-routes-swagger";

export const swaggerRoutes = {
  ...userCreateSwaggerDoc,
  ...loginSwaggerDoc
}