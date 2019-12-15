// CRUD  Create Read Update Delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const objID = mongodb.ObjectID

// Destrucing 
const {MongoClient, ObjectID} =  require('mongodb')



const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//Setup connection to MongoClient 
MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {

    if (error) {
        return console.log('Unable to connect to database')
    }

    console.log('Connected Correctly')

    const db = client.db(databaseName)

  db.collection('users').findOne({_id: new ObjectID("5de2569f4fe5f1597a7116e2")}, (error, user) => {
    if (error) {
        console.log('Unable to find user')
    }
    console.log(user)
  })

  db.collection('users').find({age: 27}).toArray( (error, users) => {
    if (error) {
        console.log('No users')
    }
    console.log(users)
  })

  //Update Single record
  db.collection('users').updateOne({ _id : new ObjectID("5de25447b6665b593222512d")}, {
      $set : {
          name : 'Mike'
      }
  }).then((result) => {
     
    console.log('Update Success:', result)
  }).catch((error) => {
    console.log('Update Faild:', error)

  })

  //Deleting Document 

  db.collection('users').deleteOne({ 
      _id : new ObjectID("5de2548308518b593d8e036f")
   
    }).then((result) => {
     console.log('Delete Success:', result)
    }).catch((error) => {
    console.log('Delete Faild:', error)
    })
})















 /* db.collection('users').insertOne({
        name: 'Arun',
        age: 27
    }, (error, result) => {
   
        if (error) {
            console.log('Unable to insert user')
        }
        console.log(result.ops)
    }) */

    // Insert Multiple documents 
    /*db.collection('tasks').insertMany([

        {
            description: 'Do Node JS',
            completed: false
        },
        {
            description: 'Setup MongoClient from mongodb',
            completed: true
        },
        {
            description: 'Insert document to Collection',
            completed: true
        }

    ], (error, result) => {
   
        if (error) {
            console.log('Unable to insert users')
        }
        console.log(result.ops)
    }) */