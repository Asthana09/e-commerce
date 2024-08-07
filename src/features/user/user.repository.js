
import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import {ApplicationError} from "../../error-handler/applicationError.js";

//creating model from schema
const UserModel = mongoose.model('User', userSchema)

export default class UserRepository{

    async signUp(user){
        try{
       //create instance of model
       const newUser = new UserModel(user);
       await newUser.save();
       return newUser;
        }
        catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
            throw new ApplicationError("something went wrong with the database", 500);
        }}
     
    }

    async singIn(email, password){
        try{
         UserModel.findOne({email, password});

        }
        catch(err){
        console.log(err);
        throw new ApplicationError("something went wrong with the database", 500);
        }
          
    }

    async findByEmail(email){
        try{      
           return await UserModel.findOne({email});
           
        }catch(err){
            console.log(err);
         throw new ApplicationError("something went wrong",500);
            }
        }

        async resetPassword(userID, newPassword){
            try{
            let user =await UserModel.findById(userID);
            if(user){
                user.password= newPassword;
                user.save();
            }else{
                throw new Error("User not found");
            }
            }catch(err){
                console.log(err);
                throw new ApplicationError("Something went wrong", 500);
            }
        }
}