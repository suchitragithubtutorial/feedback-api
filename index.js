/*
Problem Statement: Feedback System for a Learning App
You're building an API for a learning app where users can log in and submit feedback. You need to:
1.Login Route (/login):
Accepts userName and password.
Verifies credentials from a predefined array of users.
Returns a JWT token if valid.
POST /feedback Route:
Accepts title (min 5 chars) and message (min 20 chars).
Requires JWT authentication using a middleware.
Uses Zod to validate the request body.
Returns success message if valid, or errors if not.
*/
const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const JWT_SECRET = 'suchitrasecret';

const USERS = [
{ userName: 'alice', password: '123' },
{ userName: 'bob', password: '456' }
];
const feedbackSchema = z.object({
    message: z.string().min(10),
    rating: z.number().min(1).max(5)
});

function userExists(userName , password){
    return USERS.find(user => user.userName === userName && user.password === password)
}

app.post('/login',(req,res) => {
    const {userName , password} = req.body;
    const user = userExists(userName , password)

    if(!user){
        return res.status(403).json({msg:'invalid user credentials!!'})
    }
    const token = jwt.sign({userName} , JWT_SECRET)
    return res.json({token});
})

function jwtMiddleware(req,res,next){
  const authHeader = req.headers.authorization;

if(!authHeader){
    res.status(403).json({msg:'header is missing!!'})
}
const token = authHeader.split(' ')[1];

try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
}catch (err){
 return res.status(403).json({msg: 'invalid token!!'})
}
}

function validateFeedback(req , res, next){
    const parsed = feedbackSchema.safeParse(req.body)
    if(!parsed.success){
        res.status(403).json({
            msg:'validation failed',
            errors : parsed.error.errors
        })
    }
    next();
}

app.post('/feedback', jwtMiddleware , validateFeedback, (req,res) => {
  const { userName }= req.user;
  const {message,rating} = req.body;
  return res.json({
    msg:'feedback submitted successfully!!',
    submittedBy : userName,
    feedback : {message,rating}
  })

})
const PORT = 3000;
app.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
})
