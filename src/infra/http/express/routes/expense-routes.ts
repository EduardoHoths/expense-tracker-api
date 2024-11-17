import { Router } from "express";
import { createExpenseController } from "../../../../interfaces/controllers/expense/create-expense-controller";

const router = Router();

router.post("/create", createExpenseController);

export default router;
