// to save the data or file on the server

import multer from 'multer';


// configure the storage with the specification of file name and location

const storage = multer.diskStorage({
   destination: (req ,file , cb)=> { //where to store file
   cb(null , './uploads/' );//call back(cb) //null is for errors ,
 },
 filename:(req, file , cb)=>{
    cb(null , 
       file.originalname); // appending file name with the date
 },
});

export const upload = multer({
   storage: storage,});
// in multer(function) will configure the storage with storage which we create