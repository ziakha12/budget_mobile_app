import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"


const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body
    if([username, email, password].some(e => e?.trim() === "")){
        throw new ApiError(404, 'all feilds are required')
    }

    const existUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existUser){
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


 export {
    createUser
 }