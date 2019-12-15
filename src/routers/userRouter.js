const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const UserObj = require('../model/user')

const multer = require('multer')
const sharp = require('sharp')

const {sendWelcomeEmail} = require('../emails/account')

// Create User Endpoint
router.post('/users', async (req, res) => {

    console.log(req.body)

    const user = new UserObj(req.body)

   console.log(req.body)
    try {
       await user.save()
       sendWelcomeEmail(user.email, user.name)
       const token = await user.generateAuthToken()

       res.status(200).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }


   /* user.save()
    .then(() => {
     res.send(user)
    }).catch((error) => {
        res.status(400) // Give nice http status error code 
        res.send(error)
    })*/
})

// User Login
router.post('/users/login', async (req, res) => {
   

    try {
      const user = await UserObj.findByCredentials(req.body.email, req.body.password)
     console.log('**************', user)
      const token = await user.generateAuthToken()

       if (!user) {
           throw res.status(400).send('User not found')
       }
       res.status(200).send({user: user.getProfileData(), token})
    } catch(e) {
      res.status(500).send({ error : 'Invalid username/password'})
    }
})

// Logout User 

router.post('/users/logout', auth, async(req, res) => {

    try {
     req.user.tokens = req.user.tokens.filter( (token) => {

        console.log('*****************************', token)
        return token.token !== req.token
     })

     console.log(req.user.tokens.count)
     await req.user.save()
      
     res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send('Error during logout')

    }
 
})

router.post('/users/logoutAll', auth, async(req, res) => {

    try {
     req.user.tokens = []
     await req.user.save()
      
     res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send('Error during logout All')

    }
 
})
// Read User Endpoint

 router.get('/users', async (req, res) => {
   
   try {
      const users = await UserObj.find({})
      res.status(200).send(users)
   } catch (e) {
     res.status(400).send()
   }
   
   /* UserObj.find({}).then((result) => {
    
    res.send(result)
   }).catch((error) => {
    res.status(400).send()
   }) */
}) 

// Read User Profile Endpoint

router.get('/users/me', auth, async (req, res) => {
    
    res.status(200).send(req.user)
 })

// Read User By Id

router.get('/users/:id', async (req, res) => {

    const _id = req.params.id
    console.log(_id)

    try {
        const user = await UserObj.findById(_id)

        if (!user) {
            return res.status(404).send()
        }
        console.log(user)
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send('Internal servere error')
    }
  /*  UserObj.findById(_id).then((user) => {
     
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((error) => {
     res.status(500).send()
    }) */
 })

 // Update User By ID

//  router.patch('/users/:id', auth, async (req, res) => {

//  }
 router.patch('/users/me', auth, async (req, res) => {

    const updateBody = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValideUpdate = updateBody.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValideUpdate) {
        return res.status(400).send( { error : 'invalid update'})
    }

    try {

       const  user = await UserObj.findById(req.user._id)

       updateBody.forEach((update) => {
        user[update] = req.body[update]
       })

       await user.save() // so that you can run your middleware functionalities on Schema pre or post  saving 
       //const user = await UserObj.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
       
       if (!user) {
        return res.status(404).send()
        }
       res.status(200).send({user: user.getProfileData()})

    } catch {
        res.status(400).send('User not found')
    }

 })

// Delete User

router.delete('/users/me', auth, async(req, res) => {

    try {
    // const user = await UserObj.findByIdAndDelete(req.user._id)
    // if(!user) {
    //     return res.status(400).send({error: 'User not found'})
    // }

    await req.user.remove()
    sendCancelationEmail(req.user.email, req.user.name)
    res.send(user)
    } catch (e) {
        res.status(500).send('User not found')
    }
})

const upload = multer({
   // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// File to user profile Upload

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
   
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send('Image uploaded')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Delete Avatar from user profile

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.status(200).send('Profile image deleted')
} )

//Fetching avatar with ID
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png') // You have to set expected type, by viewing image in browser.
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router