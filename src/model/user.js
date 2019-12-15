const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
       type: String,
       required: true,
       unique: true,
       trim: true,
       lowercase: true,
       validate(value) {
          if (!validator.isEmail(value)) {
           throw new Error('Invalid email')
          }
       }
   },
   password : {
       type: String,
       required: true,
       trim: true,
       minlength: 7,
       validate(value) {
           if (value.toLowerCase().includes('password')){
               throw new Error('Password cannot contain "password"')
           }
       }
   },
    age : {
        type: Number,
        default: 0,
        validate(value){
          if (value < 0) {
              throw new Error('Age should be positive value')
          }
        }
        
    },

    tokens : [{
        token : {
            type: String,
            required : true
        }
    }],
    avatar : {
        type: Buffer
    }
 }, {
     timestamps: true
 }) 

userSchema.virtual('tasks', {
    ref: 'Task', // module export name of task model.
    localField: '_id', // Task and User is related with localfield  _id (Object ID)
    foreignField: 'owner' // Name of key which is  related in  Task model
})

// Hiding Private Data from user object
 userSchema.methods.getProfileData = function () {
     const user = this
     const userObject = user.toObject()

     delete userObject.password
     delete userObject.tokens

     return userObject
 }
// Generate Token 
//methods are accessible on the instances, so it call instance methods
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    console.log(token)

    user.tokens = user.tokens.concat({token}) // Adding multiple token for user login from different systems

    console.log(user.tokens)
    await user.save()

    return token
}
 //Find password matching the User
//statics methods accessiable on model, so it call model methods 
 userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({email})

    if (!user) {
        throw new Error('User not found from userSchema')
    }

    console.log(user)

    console.log(password)

    console.log(user.password)

    const isMatch = await bcrypt.compare(password, user.password)

    console.log(user)

    if (!isMatch){
        throw new Error('User password not matching')
    }

    return user
 }

 //Before saving model to db, you can do all kind of middleware operation here.
 userSchema.pre('save', async function(next) {
   
    console.log("save before saving is called")
    const userMod = this

    if(userMod.isModified('password')) {
        userMod.password = await bcrypt.hash(userMod.password, 8)
    }
    
    next()
 })

 // Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
 const User = mongoose.model('User', userSchema)

 
 module.exports = User