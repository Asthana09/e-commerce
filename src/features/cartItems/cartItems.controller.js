import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController{


    constructor(){
        this.cartItemsRepository = new CartItemsRepository();
    }

    async add(req, res){
        //this will be given by the customer
       try{ 
        const{productID , quantity} = req.body;

        //to get user id - use jwt middleware - the tocken which user is sending
        const userID = req.userID;
        await this.cartItemsRepository.add(productID , userID , quantity);
        res.status(201).send('Cart is updated');
      }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }  
    }


    //another function to use the user id to add items
    async get(req, res){
        try{
        const userID = req.userID;
        const items =await this.cartItemsRepository.get(userID)
        return res.status(200).send(items);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
       }   
}

     //to delete the items - function
     async delete(req, res){
        const userID = req.userID; // to attactch the token to middleware
        const cartItemID =req.params.id;
         const isDeleted =await this.cartItemsRepository.delete(
            userID,
            cartItemID
        );
         if(!isDeleted){
            return res
            .status(404)
            .send("Item not found");
         }
         return res
         .status(200)
         .send("cart item is removed");
     }
   }