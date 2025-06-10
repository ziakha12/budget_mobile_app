import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBudget, getUserBudget } from "../controllers/budget.controller.js";

const router = Router()

router.route('/create').post(verifyJWT, createBudget)
router.route('/get').post(verifyJWT, getUserBudget)

export default router