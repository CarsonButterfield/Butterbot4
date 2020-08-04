const { Schema } = require('mongoose')

export default UserSchema = new Schema({
    username:String,
    avatar:String,
    id:{
        type:String,
        required:true
    }
})