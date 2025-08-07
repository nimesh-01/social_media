const jwt = require('jsonwebtoken')
const userModel = require('../model/user.model')

async function authMiddleware(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorised access"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: decoded.id })
       req.user=user
       next()
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid Token,Please Login again",
            error
        })
    }
}
module.exports = authMiddleware