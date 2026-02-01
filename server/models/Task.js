import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: String,

        category: {
            type: String,
            default: "general"
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        deadline: Date,

        completed: {
            type: Boolean,
            default: false
        },

        images: [
            {
                type: String
            }
        ]

    },
    { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
