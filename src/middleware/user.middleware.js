const jwt = require('jsonwebtoken')

exports.verifyUserMiddleware = (req,res,next)=>{
    const {token} = req.headers
    
}