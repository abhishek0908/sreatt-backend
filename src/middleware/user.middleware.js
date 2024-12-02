import jwt from 'jsonwebtoken';

exports.verifyUserMiddleware = (req,res,next)=>{
    const {token} = req.headers
    
}