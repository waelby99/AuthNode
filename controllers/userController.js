import userModel from "../models/user.model.js";


export const getUserData = async (req,res)=>{
    try {
        const {userId}=req.body;

        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"Utilisateur n'existe pas"})
        }
        res.json({
            success:true,
            userData:{
                name: user.name,
                lname:user.lname,
                isVerified:user.isVerified
            }
        })
    }catch (error){
        return res.json({success:false,message:error.message})
    }
}