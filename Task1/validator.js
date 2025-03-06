const validator = require("validator");
const bcrypt = require("bcrypt");


const validateSignUpData = (req) => {
    const { firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("ENTER_VALID_USERNAME");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("ENTER_VALID_EMAIL_ID");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("ENTER_STRONG_PASSWORD");
    }
}


const validateNewPassword =async (req)=>{
    const newPassword = req.body.password;

    return validator.isStrongPassword(newPassword);

}
module.exports = {
    validateSignUpData,
    validateNewPassword
}