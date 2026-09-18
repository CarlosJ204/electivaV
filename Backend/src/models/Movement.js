import mongoose from "mongoose";

const movementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["ingreso", "gasto"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        default: Date.now,
    },
    categoryId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    userId: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Number,
        default: Date.now,
    },
});

const Movement = mongoose.model("Movement", movementSchema);

export default Movement;