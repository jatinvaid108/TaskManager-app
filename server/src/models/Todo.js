import mongoose from "mongoose";

const todoSchema= new mongoose.Schema(
    {
        user:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        title:{type: String, required: true, trim: true},
        description: {type: String, default: "", trim: true},
        priority: {type: String, enum: ["low", "medium" , "high"], default: "medium"},
        dueDate: {type: Date, default: null},
        completed: {type: Boolean, default: false},
        deleted:{ type: Boolean, default: false},  //soft delete

        sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]  //Future Collab
    },
    {timestamps: true}
);

const Todo=mongoose.model("Todo", todoSchema);

export default Todo;