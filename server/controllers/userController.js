import userModel from "../models/usermodel.js"

export const getUserData =async (req,res)=>{
    try {
        //find the user
        const {userId}=req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:'User Not found'})
        }
        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}