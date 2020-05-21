
const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('./models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
// const methodOverride = require('method-override');
// const path = require('path');

dotenv.config({ path: './.env'});



const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
// app.use(methodOverride('_method'));

mongoose.connect(process.env.DB_URL , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB is connected"));


app.get("/", (req, res) => {
    res.status(200).json({
        message: "All working very well"
    })
})

app.post('/', async (req, res) => {
    console.log(req.body);
    console.log("Inside update score");

    const user = await Quiz.find({
    email: req.body.user_email
    })
    console.log(user);
    const userUpdated = await Quiz.findByIdAndUpdate(user[0]._id,{
    score: req.body.score
    })
    console.log(userUpdated);

    res.status(200).json({
    user: userUpdated
    })
})

app.get('/Users', async (req, res) => {
    const allUsers = await Quiz.find({
    })
    res.status(200).json(allUsers)
})

app.post("/Users", async (req, res) => {

    const name = req.body.user_name;

console.log(name)

    try {
        const allUsers = await Quiz.find({
            name
        })

        res.render('/Users', {
           data: users

        })
    res.status(201).json(allUsers)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            status:error.message
        })
        res.send('/Users')
    }
})


app.get('/Register', (req, res) => {
    res.status(200).json({
           message: 'This is my test values',      
           user: 'Sam'
       })
   })

app.post('/Register', async (req, res) => {
    console.log(req.body);
    console.log("inside register");
    const name = req.body.user_name;
    const email = req.body.user_email;
    const password = req.body.user_password;

    // const hashedPassword = await bcrypt.hash(password, hashedPassword);

    try {
        const newUser = await Quiz.create({
            name: name,
            email: email,
            password: password
        })

        res.cookie(jwt);

    res.status(201).json(newUser)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            status: error.message
        })
    }
    
})

app.get('/Login', (req, res) => {
    res.status(200).json({
           message: 'This is me logged in',      
           user: 'Sam'
       })
   })

app.post('/Login', async (req, res) => {
    // console.log("*******");
    const email = req.body.user_email;
    const password = req.body.user_password;
   

    console.log(email);
    

     // const hashedPassword = user_password;

    try {
        const checkUser = await Quiz.findOne({
            email: email
        })

        if(!checkUser || !password || !bcrypt.compare(password, checkUser.password)){
            return res.status(400).json({
                message: "Email or Password is incorrect"
            })
        }

        const token = jwt.sign({id:checkUser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }

        res.cookie("jwt", token, cookieOptions)
        res.status(200).redirect('/')

        



    res.status(201).json(checkUser)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            status: error.message
        })
    }
    res.send('<h1>User Logged In</h1>')
})



app.listen(5000, (req,res) => {
    console.log("Server is running on PORT 5000");
});