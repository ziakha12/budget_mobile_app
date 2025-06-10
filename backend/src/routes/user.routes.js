import { Router } from "express";
import { createUser, getCurrentUser, logoutUser, userLogin } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(createUser)
router.route('/login').post(userLogin)
// secure routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/get').get(verifyJWT, getCurrentUser)

export default router