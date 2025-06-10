import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"


const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while creating tokens")
    }
}

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if ([username, email, password].some(e => e?.trim() === "")) {
        throw new ApiError(404, 'all feilds are required')
    }

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existUser) {
        throw new ApiError(401, "user with same username or email is already existed try another")
    }

    // noman task avatar handling via multer and cloudinary


    const user = await User.create({
        username,
        email,
        password
    })

    const resgisterUser = await User.findById(user._id).select('-password -refreshToken')

    return res.status(201)
        .json(new ApiResponse(200, resgisterUser, 'user created successfully'))
})

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.dody

    if (!email || !password) {
        throw new ApiError(404, "all feilds are required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(409, "passowrd is invalid")
    }

    const {accessToken, refreshToken} = await generateTokens(user?._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(201)
    .json(new ApiResponse(200, {
        accessToken,
        refreshToken,
        user : loggedInUser
    }, "user is loggedin successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user
    await User.findByIdAndUpdate(
        user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )

    return res.status(201).
    json(new ApiResponse(200, {}, "user logout successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user
    return res.status(201)
    .json(new ApiResponse(200, user, "user fetched successfully"))
})

export {
    createUser,
    userLogin,
    logoutUser,
    getCurrentUser
}