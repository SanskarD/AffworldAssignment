const mongoose = require('mongoose')
const {Schema} = mongoose
const bcrypt = require('bcrypt')

const userSchema = new Schema(
    {
        username: {
          type: String,
          require: true,
        },
        email: {
          type: String,
          require: true,
          unique:true
        },
        password: {
          type: String,
          require: true,
        },
        sharedSecret:{
          type:Boolean,
          default:false
        }
      }
)

userSchema.methods.verifyPassword = async function(enteredPass){
    return await bcrypt.compare(enteredPass,this.password)
}


userSchema.pre('save',async function(next){
    if(!this.isModified){
      next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password =  await bcrypt.hash(this.password,salt)
  })
  
  
  const userModel = mongoose.model("User", userSchema);
  
  module.exports = userModel;


