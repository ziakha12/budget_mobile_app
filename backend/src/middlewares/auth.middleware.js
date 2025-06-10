import JWT from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'


const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer", "")
    try {
        if (!token) {
            throw new ApiError(401, "unAuthorized token")
        }

        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401, "token is invalid")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "inavlid Access Token")

    }
})

export {verifyJWT}