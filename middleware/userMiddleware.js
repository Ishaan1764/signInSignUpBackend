const jwt=require("jsonwebtoken");
const {JWT_SECRET_USER}=require("../config");
function userMiddleware(req,res,next){
    const token = req.headers.token;
    const decoded=jwt.verify(token,JWT_SECRET_USER);

    if(decoded){
        req.userId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message:"You are not signed In!"
        })
    }

}
module.exports={
    userMiddleware
}