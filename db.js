const {Schema, mongo, default: mongoose}=require("mongoose");
const objId= Schema.ObjectId;

const userSchema=Schema({
    email:{type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
});
const userModel=mongoose.model("user",userSchema);


module.exports={
    userModel
}