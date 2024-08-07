//ProductRouter

//to Manage routes/paths to ProductController

//1. Import express
import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileupload.middleware.js';//2 Initialize Express Router
 import jwtAuth from '../../middlewares/jwt.middleware.js';


// 2. Initialize Express router.
const productRouter = express.Router();

const productController = new ProductController();

//after server come here
//All the paths to controller method
//localhost/api/products - already done


//localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.post(
    '/rate', jwtAuth,
    (req, res , next)=> {      
        productController.rateProduct(req, res, next)
    });
productRouter.get(
    '/filter', 
    (req, res)=> {      
    productController.filterProducts(req, res)
});

productRouter.get('/', 
    (req, res)=> {     
    productController.getAllProducts(req, res)
    }
);

productRouter.post(
    '/' ,
     upload.single('imageUrl'), //appending fileUpload middleware
       (req, res)=> {      
        productController.addProduct(req, res)
    }
);

productRouter.get(
    "/averagePrice", (req, res, next)=>{
    productController.averagePrice(req, res)
}
);

productRouter.get(
    '/:id', 
    (req, res)=> {      
        productController.getOneProduct(req, res)
    }
);
 
 
export default productRouter;