import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createToken= (userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};


//POST /api/auth/register
export const register= async(req,res)=>{
    try{
        const { name, email, password }=req.body;
        if(!name || !email || !password)
            return res.status(400).json({message: "All fields are required "});

        const existing= await User.findOne({email});
        if(existing) return res.status(400).json({message: "Email already Exits "});

        const user=await User.create({name, email, password});
        const token= createToken(user._id);

        res.cookie("token",token, {
            httpOnly: true,
            secure: process.env.NODE_ENV=== "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
        });

        res.status(201).json({
            success:true,
            user: {id: user._id, name: user.name, email: user.email, role: user.role},
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};


// POST /api/auth/login

export const login= async(req,res)=>{
    try{
        const {name, email, password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"});

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token= createToken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
        });

        res.json({
            success:true,
            user: {id: user._id, name: user.name, email: user.email, role: user.role},
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

// GET /api/auth/me
export const getMe =async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.json({success: true, user});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//POST /api/auth/logout

export const logout=(req,res)=>{
    res.clearCookie("token");
    res.json({success:true, message: "Logged out successfully "});
};