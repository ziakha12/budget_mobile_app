import { Router } from "express";
import { createUser } from "../controllers/user.controller.js∂";

const router = Router()

router.route('/register').post(createUser)

export default router