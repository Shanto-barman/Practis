const express = require ("express")
const appRouter = require ('./app')
const dotenv= require('dotenv')
const connectDB= require('./src/config/connection')
const { PORT } = require("./src/config/envConfig.js");

dotenv.config()
const app = express()

app.use(express.json());
connectDB();

app.use('/api', appRouter)

// const PORT =process.env.PORT
app.listen(PORT, ()=>console.log(`server runing on port ${PORT}`));