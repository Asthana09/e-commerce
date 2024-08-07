
import jwt from 'jsonwebtoken';

//creating middleware
const jwtAuth = (req, res, next)=>{
    //1. read the token - 
    // receive the token and match if its exist or not
         const token = req.headers['authorization'];
        
    // 2. if no token the send the error msg 
    if (!token){
        return res.status(401)
        .send('Unauthorized');
     }

    //3. check if token is valid or not
    try{
        const payload = jwt.verify(token , 
            "CxcyJyX4g8QNDaWWFLBjld389tKdFU91" 
        );
        req.userID= payload.userID;
        //  console.log(payload);
    }
    catch(err){
        //4. return error
        console.log(err);
        return res.status(401).send('Unauthorized');
    }


    //5. return error
    next();
};
export default jwtAuth;