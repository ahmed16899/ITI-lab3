const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username:{
      type:String,
      require:true,
      min:3,
      max:25,
      unique:true
  },
  password:{
    type:String,
    require:true,
    min:3,
    max:25,
},
age:{}
},{strict:true}
);

const User = mongoose.model('User' , userSchema);

module.exports = User ;