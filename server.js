import "./env.js";
//1. import express
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from "cors";

import productRouter from './src/features/product/product.routes.js';
// import bodyParser from 'body-parser';
import userRouter from './src/features/user/user.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
import apiDocs from "./swagger.json" assert{type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";


//2.create server
const server = express();

//CORS policy configuration
var corsOptions ={
    origin: 'http://localhost:5500'
}

server.use(cors(corsOptions));



// // Middleware -CORS policy configuration
// server.use((req, res, next)=>{
// res.header("Access-Control-Allow-Origin", "http://localhost:5500");
// res.header("Access-Control-Allow-Header" , '*');
// res.header("Access-Control-Allow-Methods",'*');

// //return ok for preflight request.
// if(req.method=='OPTIONS'){
// return req.sendStatus(200);
// }
// next();
// });


//body-parser midleware
// server.use(bodyParser.json());
server.use(express.json());


// for all request related to products, redirect to product routes.
//middleware
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/orders' ,jwtAuth , orderRouter);
server.use('/api/products', productRouter );//all the request starts form /api/products will go to product.router
server.use('/api/cartItems', jwtAuth ,cartRouter);
server.use('/api/users' , userRouter);
server.use('/api/likes', jwtAuth, likeRouter);
//3.defaault request handler   //will send the response
server.get('/' , (req, res)=>{
    res.send("Welcome to E-commerce APIs");
});


//Error handler middelware //on the application level
server.use((err , req, res ,next)=>{
console.log(err);

if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
}
if(err instanceof ApplicationError){
    res.status(err.code).send(err.message);
}
//server error 500
res.status(500).send('Something went wrong, please try later');
});




//4. if non of the above path has matched
//Middleware to handel the 404 request
server.use((req, res) =>{
    res.status(404).send("API not found");
});



//5. Specify port
server.listen(3200, ()=>{

    //request coming form user module like 
    //  /api/users
    //  /api/products


    console.log("server is running on 3200");
    // connectToMongoDB();
    connectUsingMongoose();
});
