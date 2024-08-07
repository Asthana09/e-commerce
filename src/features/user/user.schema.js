

import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({

    name: String,
    email:{type:String , unique: true,
    match:[/.+\@.+\../, "Please enter the valid email"] },
    password: {
        type:String,
        validate: {validator:function(value){
            return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
        
        },
        message:"Password should be between8-12 character and have special char"
        }
    },
    type:{type:String, enum:['Customer','Seller']}
})