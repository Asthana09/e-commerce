import { ObjectId } from "mongodb";
import {getClient, getDB} from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        
           const client = getClient();
           const session = client.startSession();
            try{
                const db =getDB();
            session.startTransaction();
        //1. Get cartitems and calculate the total amount

         const items =   await this.getTotalAmount(userId , session);
         const finalTotalAmount= items.reduce((acc , items)=>acc+items.totalAmount, 0)
         console.log(finalTotalAmount);
        //2. Create an order record
         const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
         db.collection(this.collection).insertOne(newOrder, {session});

        //3. Reduce the stock.
         for(let item of items){
            await db.collection("products").updateOne(
              {_id: items.productID},
              {$inc:{stock: -item.quantity}},{session}
            )
         }
          //throw new Error("Something is wrong in placeOrder");
         //4. Clear the Cart items.
         await db.collection("cartItems").deleteMany({
         userID: new ObjectId(userId)
         } , {session});

         session.commitTransaction();
          
         session.endSession();
         return;
         }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
           }       
    }


    async getTotalAmount(userId, session){
       const db = getDB();

       const items = await db.collection("cartItems").aggregate([
         //1. Get cartitems and calculate the total amount

        {

            $match:{userID:new ObjectId(userId)}
        },

        //2. Get the products from the products collection
            {
               $lookup:{
                from :"products",
                localField:"productID",
                foreignField:"_id",
                as:"productInfo"
               }
            },
        
        //3. Unwind the productinfo
        {
            $unwind:"$productInfo"
        },


        //4. Calculate the total amount for each cartitems
        {
            $addFields:{
                "totalAmount":{
                    $multiply:["$productInfo.price" , "$quantity"]
                }
            }
        }
        

       ], (session)).toArray();
       return items;
       
    }
}