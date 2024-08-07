
//create model using class
// what we need here is productID whcih will store in and userID, quantity

export default class CartItemModel{
    constructor(productID , userID , quantity , id){
        this.productID = productID;
        this.userID= userID;
        this.quantity = quantity;
        this.id =id;
    }


    // function to add items in the cart
    static add(productID, userID, quantity) {
        const cartItem = new CartItemModel(
            productID,
            userID, 
            quantity
            );
            cartItem.id = cartItems.length + 1;
            cartItems.push(cartItem);
            return cartItem;
    }

   //return the cart items for a specific userID
    static get(userID){
        return cartItems.filter(
            (i)=> i.userID == userID
        );
    } 
    //go to controller


    //to delete
    static delete(cartItemID, userID){
        //exists or not
        const cartItemIndex = cartItems.findIndex(
            (i) =>
              i.id == cartItemID && i.userID == userID
          );
          if (cartItemIndex == -1) {
            return 'Item not found';
          } else {
            cartItems.splice(cartItemIndex, 1);
          }
        }


}

//for existing items
var cartItems = 
 [
 new CartItemModel(1,2,1,1),
 new CartItemModel(1,1,2,2),
];