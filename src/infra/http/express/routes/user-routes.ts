import { Router } from "express";
import { createUserController } from "../../../../interfaces/controllers/user/create-user-controller";

const router = Router();

router.post("/create", createUserController);

export default router;
