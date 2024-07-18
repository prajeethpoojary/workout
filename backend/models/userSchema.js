const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema =new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,

    }
})

 userSchema.statics.signup = async function(email,password){

    if(!email||!password){
        throw Error("fill all the fields")
    }
    if(!validator.isEmail(email)){
        throw Error("enter a correct email")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("enter a strong  password")
    }

    const exists= await this.findOne({email})

    if(exists){
        throw Error('email in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    const user = await this.create({email,password:hash})
    return user
 }




//login function 
 userSchema.statics.login=async function(email,password){

    if(!email||!password){
        throw ERROR("fill all the fields")
    }
    const user =await this.findOne({email})
    if(!user){
        throw ERROR("email does not exists")
    }
    const match =await bcrypt.compare(password,user.password)
    if(!match){
        throw ERROR("password incorrect")
    }

    return user

 }


module.exports = mongoose.model('user',userSchema)