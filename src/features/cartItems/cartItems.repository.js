import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";


export default class CartItemsRepository{
    
    constructor(){
        this.collection = "cartItems";  //now we wil use is as the nme of collection 
      }


      //add
    async add(productID , userID , quantity){
        try{
            const db= getDB();
            const collection = db.collection(this.collection)
            const id = await this.getNextCounter(db);

            //find the document
            //either insert or update
           //insertion //insert item in cart
           // this whole will help in- if there is already a data it will add the quantity if not the it will add the product
           await collection.updateOne(
            {productID: new ObjectId(productID), userID:new ObjectId(userID)},
            {
                $setOnInsert: {_id:id},
                $inc:{
                quantity: quantity
            }},
            {upsert: true}) 

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
           }   
    }

    async get(userID){
        try{
        const db = getDB();
        const collection = db.collection(this.collection)
        return await collection.find({userID: new ObjectId(userID)}).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    async delete(userID, cartItemID){
        try{
        const db = getDB();
        const collection = db.collection(this.collection);
        const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID:  new ObjectId(userID)});
        return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        } 
    }
    //to find and update the data
    async getNextCounter(db){

        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value: 1}},
            {returnDocument:'after'}
        )  
        console.log(resultDocument);
        return resultDocument.value.value;
    }

}