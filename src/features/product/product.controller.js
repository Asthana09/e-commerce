import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{

   // to call product repository
  constructor(){
    this.productRepository = new ProductRepository();
  }

    //to call this Api we will create a route file which is provided by express
    
    //Get request
    async getAllProducts(req, res){
      try{
        const products = await this.productRepository.getAll();
        res.status(200).send(products); //returning data
         }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
          }
         }

        // calling the static function directly (GetAll) form model
       



    //Post Request
    async addProduct(req, res){         //method
      try{
        console.log(req.body);
        //receiving data in req.body
        const {name, price, sizes, categories, description}=req.body;
        const newProduct= new ProductModel(name,description, 
          parseFloat(price), req?.file?.filename,
        categories,
        sizes?.split(',')
      );
    //call the function inside the product.model
    const createdProduct=  await
    this.productRepository.add(newProduct);
    res.status(201).send(createdProduct); //sending req back to client
//status 201 for created successfully    
}
      catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
          }
         }

    
       //rate
        async rateProduct(req, res , next){
        //here we come after the product.model
        try{
        const userID = req.userID;
        const productID = req.body.productID;
        const rating = req.body.rating;

        await this.productRepository.rate(
          userID, productID , rating

        );
        //call product maodel
           return res
            .status(200)
            .send('rating has been added');

       }catch(err){
        console.log(err);
        console.log("Passing error to middleware");
        next(err);       
     }
          
    }  //now after this we have to update routes




    async getOneProduct(req, res) {

      try{
        const id = req.params.id;
        const product = await this.productRepository.get(id);
        if(!product){
        res.status(404).send("product not found"); //returning data
        }else{
          return res.status(200).send(product);
        }
         }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
          }
        }
  
    //now we will call it form the route
    
    async filterProducts(req, res) {
      try{
      const minPrice = req.query.minPrice;
      // const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      const result = await this.productRepository.filter(
        minPrice,
        // maxPrice,
        categories
      );
      res.status(200).send(result);
      }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
      }
    }

    async averagePrice(req, res, next){
      try{
           const result =await this.productRepository.averageProductPricePerCategory();
        res.status(200).send(result);
      }
      catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
      }
    }
  }