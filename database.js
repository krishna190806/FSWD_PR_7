
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://yg:vqWTQ96RaE1L2prr@nodeyg.sx9dr.mongodb.net/LAB7"
    );
};

module.exports = {
    connectDB,
};