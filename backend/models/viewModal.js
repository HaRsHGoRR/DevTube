const mongoose = require("mongoose");

const ViewSchema = new mongoose.Schema(
  {
    
    videoId: {
      type: String,
      unique:true,
      required: true,
    },
    user:[
        {
            type:String 
        }
    ]
   
    
  },
  {
    timestamps: true,
  }
);

const DevTubeViews = mongoose.model("DevTubeViews", ViewSchema);

module.exports = DevTubeViews;
