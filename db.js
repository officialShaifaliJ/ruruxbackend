const mongoose = require("mongoose");

// const connection = mongoose.connect('mongodb://127.0.0.1:27017/rurux-university-dashboard')
const connection = mongoose.connect('mongodb+srv://shaifali02000:shaifali123@cluster0.otc3adu.mongodb.net/')


module.exports = {connection};