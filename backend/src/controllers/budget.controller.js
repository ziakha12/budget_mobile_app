import { Budget } from "../models/budget.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBudget = asyncHandler(async (req, res) => {
    const user = req.user
    const { detail, price } = req.body
    if (!detail || !price) throw new ApiError(400, "all feilds are required")
    if (isNaN(price)) throw new ApiError(400, "Price must be a number");
    const budget = await Budget.create({
        price,
        detail,
        user: user._id
    })

    return res.status(201)
        .json(new ApiResponse(200, budget, "budget slide is created"))
})

const getUserBudget = asyncHandler(async (req, res) => {
    const user = req.user

    const budget = await Budget.find({ user: user._id })

    return res.status(201)
    .json(new ApiResponse(200, budget, "all budget slides are fetched"))
})

export {
    createBudget,
    getUserBudget
}