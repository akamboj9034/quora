var mongoose = require("mongoose");

var messageContent = mongoose.Schema({
    sentBy:{
        type:String
    },
    body:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

var messageSchema = mongoose.Schema({

    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],

    messages: [messageContent]

})

module.exports = mongoose.model('messages', messageSchema)