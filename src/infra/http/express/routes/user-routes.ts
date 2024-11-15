import { Router } from "express";
import { createUserHandler } from "../../../../interfaces/controllers/user/user-controller";

const router = Router();

router.post("/", createUserHandler);

export default router;
