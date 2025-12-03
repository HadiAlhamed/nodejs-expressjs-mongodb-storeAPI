require("dotenv").config();
require("express-async-errors");
const express = require("express");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const connectDB = require("./db/connect");
const proudctsRouter = require("./routes/products");

const app = express();

//rootes

app.get("/" ,(req , res)=>{
        res.send(`<h1>Store Api </h1>
                <a href = "/api/v1/products">products route</a>
                `);
} );
//products route
app.use('/api/v1/products', proudctsRouter);
//middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(express.json());
app.use(express.urlencoded());


const port = process.env.PORT || 3000;
const start = async ()=>{
        try{
                await connectDB(process.env.MONGO_URI);
                app.listen(port , ()=>{
                        console.log(`Server is listening on port ${port}...`)
                });
        }catch(error)
        {
                console.log(`Error : ${error}`);
        } 
};

start();