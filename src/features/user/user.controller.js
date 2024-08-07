import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from "bcrypt";//for password 
//create controller class
export default class UserController{


  constructor(){
    this.userRepository = new UserRepository();
    }
    //function
    async signUp(req,res, next){
const {name, email, password, type} = req.body; //req.body is an object

try{
  const hashedPassword =await bcrypt.hash(password, 12)

  const user = new UserModel(name , email , hashedPassword , type
  );
  await this.userRepository.signUp(user);
  res.status(201).send(user);    
}catch(err){
  next(err);
}

}
//to hashing the password




    //function
    async signIn(req,res , next){
      try{
        //1. try to find user by email
        const user = await this.userRepository.findByEmail(req.body.email);
        if(!user){
          return res
          .status(400)
          .send('Incorrect Credentials');
        }else{
          //2. comapre password with HAshed password by using bcrypt function of this library
         const result = await bcrypt.compare(req.body.password, user.password);
         if(result){

            //create token and send that 
            //3. create token
            const token = jwt.sign(
              {
                userID: user._id, 
                email: user.email},
              process.env.JWT_SECRET ,//2 parameters palyload and key and opyion in last
                {
                  expiresIn: "1h",
                }
          );
             //4. send token
         return res.status(200).send(token);
         } else{
          return res
          .status(400)
          .send('Incorrect Credentials');

         }
        }
    }
    catch(err){
      next(err);
   console.log(err);
   return res.status(200).send("Something went wrong");
  }
}

async resetPassword(req, res , next){
  const {newPassword}= req.body;
  const userID = req.userID;
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  try{
    await this.userRepository.resetPassword(userID, hashedPassword);
    res.status(200).send("password is reset");
  }catch(err){
    console.log(err);
    return res.status(200).send("Something went worng");
  }
}
}