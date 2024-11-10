require('dotenv').config();

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const {userRouter}=require("./routes/user");
const app=express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/v1/user",userRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Adjust the path if necessary
});
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3001);
}
main();