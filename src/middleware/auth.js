
const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next) => {

    try {
       
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
        const user = await User.findOne({ _id : decode._id, 'tokens.token': token})
        
        if (!user) {
            throw new Error({error: 'Authorization Faild'})
        }

        req.token = token // Authendication of current token
        req.user = user
        next()
    } catch (e) {
        res.status(400).send({ error: 'Please Authendicate'})
    }


   // next()
}

module.exports = auth