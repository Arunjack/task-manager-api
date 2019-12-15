const express = require('express')
require('./db/mongoose.js')
const UserObj = require('./model/user')
const TaskModel = require('./model/task')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT

const multer = require('multer')
const upload = multer({
    dest: 'uploadFiles',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a Word document'))
        }
 
      cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Middleware to do something
//app.use(auth)   

app.use(express.json()) // Automatically parse the incomming json to object

app.use(userRouter) // Register the user model router with express

app.use(taskRouter) // Register the Task model router with express


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
