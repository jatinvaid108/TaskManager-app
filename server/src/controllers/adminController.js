import User from "../models/User.js";
import Todo from "../models/Todo.js";

//Get all users
export const getAllUsers= async (req,res)=>{
    try{
        const users=await User.find().select("-password");
        res.json({success: true, count: users.length, users});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//Delete a User and their todos(hard delete)

export const deleteUser= async(req,res)=>{
    try{
        await Todo.deleteMany({user: req.params.id});
        await User.findByIdAndDelete(req.params.id);
        res.json({success: true, message: "User and their Tasks deleted"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//Get all tasks (System-wide)
export const getAllTasks= async(req, res)=>{
    try{
        const tasks=await Todo.find().populate("user","name","email");
        res.json({success:true, count: tasks.length,tasks});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//Hard delete a task
export const hardDeleteTask= async (req,res)=>{
    try{
        await Todo.findByIdAndDelete(req.params.id);
        res.json({success: true, message:"Tasks Permanentaly deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}