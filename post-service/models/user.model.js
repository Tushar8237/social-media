import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  profilePic: String,
}, { timestamps: false }); // no need for timestamps

const User = mongoose.model("User", userSchema);
export default User
