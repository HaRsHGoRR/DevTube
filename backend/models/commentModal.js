const mongoose=require("mongoose")

const CommmentSchema =new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    videoId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
    }

},{
    timestamps:true
})

const DevTubeComment = mongoose.model("DevTubeComment", DevTubeComment);

module.exports = DevTubeComment;
