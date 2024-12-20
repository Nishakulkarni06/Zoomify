import { Schema } from "mongoose";
import mongoose from 'mongoose';
import { User } from "../models/user.model.js";

const meetingSchema = new Schema(
    {
        user_id : {type:Schema.Types.ObjectId,ref:'User' ,required:true},
        meetingCode : {type:String,required:true},
        date:{type:Date,default:Date.now,required:true} 
    }
);
const Meeting = mongoose.model("Meeting",meetingSchema); 
export {Meeting}; 

