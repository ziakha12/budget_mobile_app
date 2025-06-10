import mongoose  from "mongoose";


const budgetSchema = new mongoose.Schema({
    detail : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true})

export const Budget = mongoose.model("Budget", budgetSchema)