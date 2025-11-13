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

// export const getTodos = async (req, res) => {
//   try {
//     // Let MongoDB handle sorting
//     const todos = await Todo.find({ user: req.user._id, deleted: false }).sort({ createdAt: -1 });
    
//     res.json({ success: true, count: todos.length, todos });
//   } catch (err) {
//     console.error("Error fetching todos:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

export const getTodos = async (req, res) => {
  try {
    const { completed, priority, deleted, search, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Base filter → always for logged-in user
    const filter = { user: req.user._id };

    // Filter by deleted or not
    if (deleted === "true") filter.deleted = true;
    else filter.deleted = false;

    // Filter by completion
    if (completed !== undefined)
      filter.completed = completed === "true";

    // Filter by priority
    if (priority) filter.priority = priority;

    // Search in title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default
    if (sort === "priority") sortQuery = { priority: 1 };
    if (sort === "dueDate") sortQuery = { dueDate: 1 };
    if (sort === "title") sortQuery = { title: 1 };

    // Fetch tasks
    const tasks = await Todo.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    // Total count for pagination
    const total = await Todo.countDocuments(filter);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      total,
      tasks
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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


// Filter + Pagination for user's tasks

// Restore soft-deleted task
export const restoreTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, deleted: true },
      { deleted: false },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Task not found or not deleted" });
    res.json({ success: true, message: "Task restored", todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllCompleted = async (req, res) => {
  try {
    await Todo.updateMany({ user: req.user._id, deleted: false }, { completed: true });
    res.json({ message: "All tasks marked as completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const restoreAll = async (req, res) => {
  try {
    await Todo.updateMany({ user: req.user._id, deleted: true }, { deleted: false });
    res.json({ message: "All tasks restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

