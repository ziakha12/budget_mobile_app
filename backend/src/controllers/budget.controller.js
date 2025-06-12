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

const budgetUpdate = asyncHandler(async (req, res) => {
    const { budgetId } = req.params
    const { detail, price } = req.body

    if (!budgetId) {
        throw new ApiError(400, "id is required for update")
    }
    if (!detail && !price) {
        throw new ApiError(400, "atleast one feild is required")
    }
    const updatedBudget = await Budget.findByIdAndUpdate(
        budgetId,
        {
            $set: {
                detail,
                price
            }
        },
        {
            new: true
        }
    )

    if (!updatedBudget) {
        throw new ApiError(500, "server error while updating budget slide")
    }

    return res.status(201)
        .json(new ApiResponse(200, updatedBudget, "budget updated successfully"))
})

const budgetDelete = asyncHandler(async (req, res) => {
    const { budgetId } = req.params
    if (!budgetId) {
        throw new ApiError(400, "id is required for delete")
    }

    await Budget.findByIdAndDelete(budgetId).catch(err => { throw new ApiError(500, 'server error while deleting budget slide') })



    return res.status(201)
        .json(new ApiResponse(200, {}, "budget slide is deleted"))

})

export {
    createBudget,
    getUserBudget,
    budgetDelete,
    budgetUpdate
}