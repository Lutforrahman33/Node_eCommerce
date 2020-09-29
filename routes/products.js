const router = require('express').Router();
const fs = require('fs-extra');


const Product = require('../models/product');
const Category = require('../models/category');

/*
* GET All Products
*/
router.get('/' , (req, res)=>{
   Product.find((err , products)=>{
    if(err) console.log(err);
    res.render('page/all_products' ,{
       title: 'All Products',
       products: products 

    });
   });

})
/*
* get Categorywise Product
*/
router.get('/:slug' , (req, res)=>{
   
  Category.findOne({ slug: req.params.slug } , (err , cat)=>{
           
            Product.find({ category : req.params.slug } , (err , products)=>{
            if(err) console.log(err);
             res.render('page/cat_products' ,{
               title: cat.title,
                  products: products 

    });
   });
  });

});

/*
* get Product details
*/
router.get('/:category/:slug' , (req, res)=>{
  
  var galleryImages = null ;

      Product.findOne({ slug : req.params.slug} , (err , product)=>{
             if(err) {
              console.log(err);
            }else{
                gallerydir = 'public/product_images/'+product._id+'/gallery';
                fs.readdir(gallerydir ,(err , files)=>{
                if(err){
                  console.log(err);
                }else{
                    galleryImages = files ;
                        res.render('page/single_products' ,{
                             title: product.title,
                             p: product,
                             galleryImages: galleryImages 

                    });
                }
              });
            }

      });   

});






module.exports = router;