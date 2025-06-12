import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { budgetDelete, budgetUpdate, createBudget, getUserBudget } from "../controllers/budget.controller.js";

const router = Router()

router.route('/create').post(verifyJWT, createBudget)
router.route('/get').get(verifyJWT, getUserBudget)
router.route('/update/:budgetId').put(verifyJWT, budgetUpdate)
router.route('/delete/:budgetId').delete(verifyJWT, budgetDelete)

export default router