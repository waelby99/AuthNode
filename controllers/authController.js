import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
export const register = async (req,res)=>{
    const {name,lname,email,password}=req.body

    if(!name || !lname || !email || !password){
        return res.json({success:false,message:"Missing Details !"})
    }
    try {
        const existingUser= await userModel.findOne({email})

        if(existingUser){
            return res.json({success:false,message:"User Already Exists !"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name,lname,email,password:hashedPassword})
        await user.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7D'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' :'strict',
            maxAge:7*24*60*60*1000
        })
        const mailOptions = {
            from: process.env.SENDER,
            to: email,
            subject: 'Welcome to Wael App',
            html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue chez Wael App !</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007BFF;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .content h2 {
                    font-size: 20px;
                    margin-bottom: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Bienvenue chez Wael App !</h1>
                </div>
                <div class="content">
                    <h2>Bonjour,</h2>
                    <p>Nous sommes ravis de vous accueillir dans notre communauté. Votre compte a été créé avec succès avec l'adresse email <strong>${email}</strong>.</p>
                    <p>Pour commencer, cliquez sur le bouton ci-dessous pour accéder à votre compte :</p>
                    <a href="[Lien vers votre site]" class="button">Accéder à mon compte</a>
                    <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter à <a href="mailto:support@waelapp.com">support@waelapp.com</a>.</p>
                    <p>À bientôt,<br>L'équipe Wael App</p>
                </div>
                <div class="footer">
                    <p>Vous recevez cet email parce que vous avez créé un compte sur Wael App.</p>
                    <p>&copy; 2025 Wael App. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
    `
        };

        await transporter.sendMail(mailOptions);
        return res.json({success:true})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const login = async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success:false,message:"Email and password are required !"})
    }

    try{
        const user= await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User not found !"})
        }
        const isMatch= await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Wrong Password!"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' :'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true})

    }catch(error){
        return res.json({success:false,message:error.message})

    }
}

export const logout =async(req,res)=>{
    try{
         res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' :'strict',
        })
        return res.json({success:true,message:'Logged Out !'})
    }catch (error){
        return res.json({success:false,message:error.message})
    }
}


export const sendVerifyOtp=async (req,res)=>{
    try {
        const {userId}=req.body;
        const user = await userModel.findById(userId)
        if(user.isVerified){
            return res.json({success:false, message:"Account Already Verified !"})
        }
        const otp=String(Math.floor(100000 + Math.random()*900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now()+ 24*60*60*1000
        await user.save();
        const mailOption={
            from : process.env.SENDER,
            to:user.email,
            subject: 'Account Verification',
            html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vérification de votre compte</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007BFF;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .content h2 {
                    font-size: 20px;
                    margin-bottom: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .verification-code {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #ffffff;
                    padding: 10px 20px;
                    font-size: 24px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Vérification de votre compte</h1>
                </div>
                <div class="content">
                    <h2>Bonjour,</h2>
                    <p>Merci de vous être inscrit sur <strong>Wael App</strong>. Pour finaliser la création de votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
                    <div class="verification-code">${otp}</div>
                    <p>Ce code expirera dans 10 minutes. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.</p>
                    <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter à <a href="mailto:support@waelapp.com">support@waelapp.com</a>.</p>
                    <p>À bientôt,<br>L'équipe Wael App</p>
                </div>
                <div class="footer">
                    <p>Vous recevez cet email parce que vous avez créé un compte sur Wael App.</p>
                    <p>&copy; 2023 Wael App. Tous droits réservés.</p></div></div></body></html>
    `
        }
        await  transporter.sendMail(mailOption)
        return res.json({success:true,message:'Verification Sent On Email'})
    }catch (error){
        return res.json({success:false,message:error.message})
    }
}

export const verifiedEmail = async(req,res)=>{
    const {userId,otp}=req.body;

    if(!userId || !otp){
        return res.json({success:fale, message:"Missing Details"})
    }

    try {
        const user = await userModel.findById(userId)
        if (!user){
            return res.json({success:false,message:'User Not Found'})
        }

        if(user.verifyOtp==='' || user.verifyOtp !== otp){
            return res.json({success:false,message:'Invalid Otp'})

        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false,message:'Code expired !'})

        }
        user.isVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success:true,message:'Email Verifié'})

    }catch (error){
        return res.json({success:false,message:error.message})
    }
}

export const isAuthenticated =async(req,res)=>{

    try{

        return res.json({success:true})
    }catch (error){
        return res.json({success:false,message:error.message})
    }
}

export const sendResetOtp = async (req,res)=>{
    const {email}=req.body
}