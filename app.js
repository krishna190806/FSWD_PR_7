
const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const { authRouter } = require("./router/userRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB()
    .then(() => {
        console.log("CONNECTION_TO_DATABASE_IS_SUCCESSFULLY_ESTABLISHED");
        app.use("/", authRouter);
        app.listen(108, () => {
            console.log("SERVER_UP_108");
        });
    })
    .catch((err) => {
        console.error("ERROR_OCCURED_IN_DATABASE_CONNECTION : " + err);
    });
    