const{sequelize}= require('./models')///must do it dont forget
const express = require('express');
const cors = require('cors')
const app = express();
const port = 5001;
//import user route
const user = require('./routes/userRoute')

//import posts route
const post = require("./routes/postRoutes")
//import follower routes
const follower = require("./routes/followerRoute")
//import follower routes
 const following = require("./routes/followingRoute")
//import comment route
const comment= require("./routes/commentRoute")   
//import comment route
const like= require("./routes/likeRoute")   
//import expresss-fileupload
const fileUpload = require('express-fileupload')



app.use(fileUpload({
    useTempFiles : true
}))

//Cors
app.use(cors())

//express.json() is a built-in middleware function in Express.
//This method is used to parse the incoming requests with JSON 
//payloads and is based upon the bodyparser.
//This method returns the middleware that only parses JSON and 
//only looks at the requests where the content-type header matches the type option.
app.use(express.json())


////////////for user
app.use('/user',user)

/////////// for post 
app.use("/post",post)

////////////for follower
app.use('/follower',follower)

////////////for following route
app.use('/following',following)

// ////////////for comment
app.use('/comment',comment)

// ////////////for like
app.use('/like',like)





app.listen(port,async()=>{

    console.log(`server is running on port ${port}`)
    try {
        await sequelize.authenticate();
      } catch (error) {
        console.log("error", error.message);
      }
    console.log('Database connected')
})

