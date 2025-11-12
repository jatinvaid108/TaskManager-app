import Todo from "../models/Todo.js";

//Create new Task 

export const createTodo= async(req,res)=>{
    try{
        const{title ,description, priority, dueDate} =req.body;
        if(!title) return res.status(400).json({message: "Title is required"});

        const todo=await Todo.create({
            user: req.user._id,
            title,
            description,
            priority,
            dueDate,
        });
        res.status(201).json({success: true, todo});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//Get all tasks for logged-in user (non-deleted)
export const getTodos=async (req,res)=>{
    try{
        const todos=(await Todo.find({user: req.user._id, deleted: false})).toSorted({createdAt: -1});
        res.json({success: true, count: todos.length, todos});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//GET single task by ID
export const getTodoById= async(req,res)=>{
    try{
        const todo=await Todo.findOne({_id:req.params.id, user:req.user._id});
        if(!todo) return res.status(404).json({message: "Task not found"});
        res.json({success: true, todo});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

//Update a task
export const updateTodo=async (req,res)=>{
    try{
        const{title, description, priority, dueDate, completed}=req.body;
        const todo=await Todo.findOneAndUpdate(
            {_id:req.params.id, user: req.user._id},
            {title, description,priority, dueDate,completed},
            {new: true}
        );
        
        if(!todo) return res.status(404).json({message: "Task not Found"});
        res.json({success: true, todo});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

// DELETE (soft delete)
export const deleteTodo= async(req,res)=>{
    try{
        const todo= await Todo.findOneAndUpdate(
            {_id:req.params.id, user:req.user._id},
            {deleted:true},
            {new:true}
        );
         if (!todo) return res.status(404).json({ message: "Task not found" });
        res.json({ success: true, message: "Task deleted (soft delete)", todo });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

// What this covers:

// Full CRUD (Create, Read All, Read One, Update, Delete)

// Soft delete mechanism

// Only user’s own tasks (security)

// Sorted newest first (sort({ createdAt: -1 }))