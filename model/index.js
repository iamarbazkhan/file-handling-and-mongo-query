const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    
    filename:{
        type:String,
        required:"Name is required field",
        
    }
})

module.exports= mongoose.model("Image", imageSchema)