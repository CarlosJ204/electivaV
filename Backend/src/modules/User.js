import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

const User = mongoose.model("User", userSchema);

export default User;