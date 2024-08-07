import UserModel from "../user/user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class ProductModel {


  constructor(
    name, 
    desc,
    price, 
    imageUrl, 
    category, 
    sizes , 
    id
  ) 
  {
    this._id = id;
    this.name = name;
    this.desc=desc;
    this.imageUrl=imageUrl;
    this.category=category;
    this.price=price;
    this.sizes=sizes;


  }
      //   //post
      static add(product){ // add is the function name here
        product.id = products.length+1;//specify id to that product when we are creating the product its server responsibility to give the id
        products.push(product);
        return product;  
       }//will call this function form the product controller

       

      // //function for one product
      static get(id){
        const product = products.find(
          (i)=> i.id==id
        );
        return product;
           //call in controller
      }



      // //function to return the data  and inside the controller call back function
       static getAll(){      // GetAllis the function name
        return products;
      }



      //to filter products based on price and categories
      // static filter(minPrice , maxPrice , category){
      //    const result =products.filter((product)=>{         //filter function to filter array of object
      //     return(   // if all condition will match will return intoresult
      //    (!minPrice || product.price>=minPrice)&& 
      //     ( !maxPrice || product.price<=maxPrice) &&
      //     (!category || product.category==category) //cat should match the category of user
      //     );
      //       });
      //   return result;
      //  } // this function need to be call form the controller




        // function for the rating
        static rateProduct(userID, productID, rating){
          
          //1. validate user and products
          const user = UserModel.getAll().find(
              (u) =>u.id == userID
            ); //will return all the model
            if (!user){
              //user- defined error
            throw new ApplicationError('User not found', 400);
          }
          //validating products
          const product = products.find(
            (p) => p.id == productID);
          if(!product){
            throw new ApplicationError("Product not found", 400);
          }
          //2. Check if there are any ratings and if not then add rating array.
          //if first time rating
          if(!product.ratings){
            product.ratings = [];
            product.ratings.push({
              userID:userID, 
              rating:rating
            });
          }
          else{
          //3.checking if rating available or not
          const existingratingIndex =product.ratings.findIndex(
            (r)=> r.userID == userID
          );
          if(existingratingIndex >=0){
            product.ratings[existingratingIndex]={
              userID: userID,
              rating:rating,
            };
          }else{
            //if no existing rating, then add new rating
            product.ratings.push({
              userID: userID,
              rating: rating
            });      
          }
          }//after this function we will go to product contoller
        }
      }



    var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
       'Category1'
    ),

    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']

    ),

    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
       ['M','XL','S']
    )
  ];
