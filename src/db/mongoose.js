/*Mongoose provides a straight-forward, schema-based solution to model your application data.
 It includes built-in type casting, validation, query building, business logic hooks 
 and more, out of the box.*/

 const mongoose = require('mongoose')
 const connectionURL = process.env.MONGODB_URL
 const validator = require('validator')
 mongoose.connect(connectionURL, { useNewUrlParser: 
    true, useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}).then((result) => {
    console.log('Mongoose connected')
 }).catch((error) => {
    console.log('Mongoose ' + error)

 })


  /*const me = new User({
      name : '  Prasanth',
      email: 'ARUN.TELL6@GMAIl.com ',
      age: 35
  })

  me.save().then(() => {
   console.log(me)
  }).catch((error) => {
      console.log(error)
  }) */


  /*const Price = mongoose.model('Price', {
    product : {
        type: String
    },
    price : {
        type: Number
    }
 })

 const price = new Price({
    product : 'Tooth Paste',
    price: 35
 })

 price.save().then(() => {
  console.log(price)
 }).catch((error) => {
     console.log(error)
 }) */


 /*

 const task = new Task({
    description : 'Learn mongoose',
    completed: false
 })

 task.save().then(() => {
  console.log(task)
 }).catch((error) => {
     console.log(error)
 }) */