// will have functions add, gettall, get etc will get mongodb functions and return promises

import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";


const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

class ProductRepository{
    // coz we have to use this collection many time so we put it in constructor
  constructor(){
    this.collection = "products";  //now we wil use is as the nme of collection 
  }
    //1. function add
    async add(productData){
       try{
        //1. Add the product
        console.log(productData);
        productData.categories=productData.category.split(',').map(e=> e.trim());
        const newProduct = new ProductModel(productData);
        const savedProduct = newProduct.save();

        //2. Update categories
        await CategoryModel.updateMany(
            {_id: {$in: productData.categories}},
            {
                $push:{products: new ObjectId(savedProduct._id)}
            }
        )

       }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong", 500);
       }
    }

    //2. getAll
    async getAll(){
        try{
            //get database
            const db = getDB();
            // get collection
            const collection = db.collection(this.collection);
            const products =  await collection.find().toArray();
           console.log(products);
           return products;
        }catch(err){
            console.log(err);
         throw new ApplicationError("something went wrong",500);
            }
    }


    //3. get
    async get(id){
      try{
          const db = getDB();
          const collection = db.collection(this.collection);
          return await collection.findOne({_id: new ObjectId(id)});
      }catch(err){
          console.log(err);
          throw new ApplicationError("Something went wrong with database", 500);
      }
  }

      //product should have min price specified and category     
     async filter(minPrice, categories){
        try{
         const db = getDB();
         const collection= db.collection(this.collection);
           let filterExpression = {};
           if(minPrice){
            filterExpression.price ={$gte: parseFloat(minPrice)}
           }
        //    if(maxPrice){
        //     filterExpression.price ={...filterExpression.price, $lte: parseFloat(maxPrice)}
        //    }

        //['cat1','cat2'] convert it into doublr quotes
        categories = JSON.parse(categories.replace(/'/g, '"'));
        console.log(categories);   
        if(categories){
             filterExpression ={$or:[{category:{$in:categories}}  ,filterExpression]}
            // filterExpression.category=category;
           }
           //to return only name and price and even exclude the id
          return await collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:1}}).toArray();
        }catch(err){
            console.log(err);
         throw new ApplicationError("something went wrong",500);
            }
     }
           
   //   async rate(userID, productID, rating){
   //    try{
   //      const db = getDB();
   //        const collection = db.collection(this.collection);
   //        //1.find the product
   //        const product = await collection.findOne({_id:new ObjectId(productID)});
   //        //2. find the rating
   //        const userRating = product?.rating?.find(r=> r.userID==userID);
   //        if(userRating){
   //         //3 update rating
   //         await collection.updateOne({
   //          _id:new ObjectId(productID), "ratings.userID":new ObjectId(userID)
   //       },{
   //             $set:{
   //                "ratings.$.rating":rating
   //             }

   //       }
   //         )

   //       }else{
   //          await collection.updateOne({
   //             _id:new ObjectId(id)
   //           },{
   //             $push:{ratings:{userID:new ObjectId(userID), rating}}
             
   //            })
   //       }

   //    }catch(err){
   //          console.log(err);
   //       throw new ApplicationError("something went wrong",500);
   //          }
   //   }
     //}

     async rate(userID, productID, rating){
      try{
         //1. Check if products exists
         const productToUpdate = await ProductModel.findById(productID);
         if(!productToUpdate){
            throw new Error("Product not found");
         }
          // 2. Get the existing review
          const userReview =await ReviewModel.findOne({product:new ObjectId(productID), user:new ObjectId(userID)});
    if(userReview){
        userReview.rating=rating;
        await userReview.save();
    }else{
        const newReview = new ReviewModel({
            product: new ObjectId(productID),
            user: new ObjectId(userID),
            rating: rating
        })
        newReview.save();
    }
      }catch(err){
          console.log(err);
          throw new ApplicationError("Something went wrong with database", 500);
      }
  }

  async averageProductPricePerCategory(){
    try{
        const db=getDB();
        return await db.collection(this.collection)
        .aggregate([
            {
                //stage 1: Get average price per category
                $group:{
                    _id:"$category",
                    averagePrice:{$avg:"$price"}
                }
            }
        ]).toArray();

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;