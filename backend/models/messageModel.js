const mongoose = require('mongoose')
const {Schema} = mongoose


const messageSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    }
},{timestamps:true})

const messageModel = mongoose.model('Message',messageSchema)

module.exports = messageModel