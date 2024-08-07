import OrderRepository from "./order.repository.js";

export default class OrderController{
    constructor(){
        this.orderReporitory =new  OrderRepository();
    }

    async placeOrder(req, res, next){

        try{
            const userId = req.userID;
            await this.orderReporitory.placeOrder(userId);
             res.status(201).send("order is created");
        }
        catch(err){
            console.log(err);
            return res.status(200).send("Somethis went wrong");
        }
    
    }
}