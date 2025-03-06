const express = require("express");
const { validateSignUpData } = require("../utils/validator");
const { User } = require("../model/userSchema");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/userAuth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user1 = new User({
            firstName,
            lastName,
            password: passwordHash,
            emailId
        });

        await user1.save();
        res.send("AN INSTANCE OF User MODEL AKA user1 WERE ADD");
    } catch (err) {
        res.status(400).send("ERROR_OCCURED_IN_STORING : " + err.message);
    }
});

authRouter.get("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const isPasswordValid = await user.getPasswordAuthentication(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("USER_LOGIN_SUCCESSFULLY_DONE");
        } else {
            throw new Error("INVALID_CREDENTIALS");
        }
    } catch (err) {
        res.status(411).send("ERROR_OCCURED_IN_LOGIN : " + err.message);
    }
});

authRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("USER_DOES_NOT_EXIST");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(435).send("ERROR_OCCURE_IN_LOG_IN : " + err.message);
    }
});

module.exports = {
    authRouter
};