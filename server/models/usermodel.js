//first we have to create schma for sign up and sign in
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    //for otp verification we are using these
    verifyOtp:{type:String,default:''},
    verifyOtpExpireAt:{type:Number,default:0},
    isAccoutVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0},


})
//by using these userschma we create the user model
//by using the below line it create the usemodel in the database again and again
//if you want to create the user model only once then you have to use the below line
//mongoose.models.user these command checks that the user is already exists or not

const userModel= mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;