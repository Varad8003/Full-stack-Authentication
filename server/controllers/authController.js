import bcrypt from 'bcryptjs'
//import pkg from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';




//these is user registration controller function
export const register =async (req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false ,message:"missing Details"})
    }

    try {
        //before the storing in database first we check for the existing user for email becoz email should be unique
        const existingUser=await userModel.findOne({email});

        if(existingUser){
            return res.json({success:false,message:"user is already exists"});
        }
        // by these it can generate the hashed password which we can store in database 

        const hashedPassword=await bcrypt.hash(password,10);
        //now we can create the new user in database
        const user=new userModel({name,email,password:hashedPassword});

        //by using these we are able to save the user in database
        await user.save();

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000
        });

        //sending the welcome mail
        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome to our website',
            text:`Welcome to PAYTm.Yout account has been created with email id:${email}`
        }
        await transporter.sendMail(mailOption)
        return res.json({success:true});


        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

// user controller function for login

export const login=async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success:false,message:"Email and password are required"});
    }

    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"Invalid email or password"});
        }
        // by using this we are able to compare the password with the hashed password in database

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false ,message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000
        });

        return res.json({success:true});
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}
//after that we are creating the logout controller function

export const logout=async (req,res)=>{
    try {
        //in logout we are just removing the cookie from the browser
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite :process.env.NODE_ENV === 'production'  ?'none' : 'strict',
        })
        return res.json({success:true,message:"Logged out"});
        
    } catch (error) {
        return res.json({success:false,message:error.message});
        
    }
}
//these send the verification OTP to the user's email
export const sendVerifyOtp =async(req,res)=>{
    try {
        //The useId is not stored in body 
        //we store in body by using the middleware
        // in that middleware we are storing the userId in the body
        const {userId}=req.body;
        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:true,message:"Account is already verified"});
        }
        //for generating otp we are using the math random function
       const otp=String( Math.floor(10000+Math.random()*900000));
       user.verifyOtp=otp;
       //set the otp time 
       user.verifyOtpExpireAt=Date.now()+24*60*60*1000;
       await user.save();

       const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject: 'Verify your email',
        text:`your Otp is ${otp}`

       }
       await transporter.sendMail(mailOptions);
       res.json({success:true ,message:'verification OTP sent on Email'});
       
        
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;

    if(!userId || !otp){
        return res.json({success:false,message:"Please provide both userId and otp"});
    }
    try {
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false ,message:'user Not found'});
        }
        if(user.verifyOtp=='' ||user.verifyOtp!=otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false,message:"OTP has expired"});
        }
        //set the isAccountVerified to true
        //now after that evey thing will fine then we have to make the isAccoutVerified true
        user.isAccountVerified=true;
        //now reset the otp and expire time
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success:true , message:"email verified successfully"});
    
        
    } catch (error) {
        res.json({success:false ,message:error.message});
    }
}
export const isAuthenticated=async(req,res)=>{
    try {
        return res.json({success:true ,message:"user is authenticated"});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
//send password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"});
    }
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
            
        }
        //generate a random otp
        const otp=String( Math.floor(10000+Math.random()*900000));
       user.resetOtp=otp;
       //set the otp time 
       user.resetOtpExpireAt=Date.now()+15*60*1000;
       await user.save();

       const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject: 'Password Reset Otp',
        text:`Your OTP for resetting your password is ${otp}`

       }
       await transporter.sendMail(mailOptions);
       return res.json({success:true ,message:'verification OTP sent on Email'});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//RESET THE USER Password

export const resetPassword=async(req,res)=>{
    const {otp,newPassword,email}=req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"Email,OTP,and new Password are required"});
    }
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        if(user.resetOtp==="" || user.resetOtp!=otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        //check if the otp has expired
        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false,message:"OTP has expired"});
        }
        //now we have to encrypt the password and store it in the database
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        return res.json({success:true,message:"Password has been reset"});
        
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}
