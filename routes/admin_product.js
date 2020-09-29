const router = require('express').Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

const Product = require('../models/product');
const Category = require('../models/category');

//const isImage = require('../middleware/image_validator');

const { body, validationResult } = require('express-validator');

/*
* GET product index
*/
router.get('/' , isAdmin , (req, res)=>{
  var count;
  Product.countDocuments((err ,c)=>{
     count = c;
  });

  Product.find((err , products)=>{
   if(err) return console.log(err)

    res.render('admin/product' ,{
        products : products,
        count : count
    });
  });

});

/*
* GET add Product
*/
router.get('/add-product' , isAdmin , (req, res)=>{
    var title = "" ;
    var price = "" ;
    var desc = "" ;

  Category.find((err , categories)=>{
  if(err) return console.log(err)
        
        res.render('admin/add_product', {
        title: title ,
        desc: desc ,
        price: price,
        categories: categories
    });
  });
    
});

/*
* POST add product
*/
router.post('/add-product' , [

      body('title' ,'title Must have a value').not().isEmpty(), 
      body('desc' ,'Description Must have a value').not().isEmpty(),
      body('price' ,'Price Must have a decimal value').isDecimal(),

  ] ,(req, res)=>{

    var title = req.body.title;
    var slug = title.replace(/\s+/g ,'-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var imagefile = req.files ? req.files.image.name : "";
    var inValid = false;
    const expectedFileType = ['png' , 'jpg' , 'jpeg'];
     if(imagefile != ""){
       const extension = imagefile.split('.').pop();
     
      if(!expectedFileType.includes(extension)){
        var inValid = true;
        
      }
    }
     
   
    const errors = validationResult(req);

   if (!errors.isEmpty() || (inValid)) {
      if(inValid){
        var message = "Please insert a valid image file of .jpg, .png or .jpeg "; 
      }else{
        message = "";
      }
    console.log(message);
      const error = errors.array();
        Category.find((err , categories)=>{
          if(err) return console.log(err)
        res.render('admin/add_product', {
            message: message,
            error: error ,
            title: title ,
            price: price ,
            desc: desc,
            categories: categories
        });
      });

  }else{
      Product.findOne({ slug: slug } ,( err , product )=>{
       if(product){
        req.flash('danger' ,"Product title exists.. choose another ");

        Category.find((err , categories)=>{
          if(err) return console.log(err)
        res.render('admin/add_product', {

            title: title ,
            price: price ,
            desc: desc,
            categories: categories
        });
      });

       }else{
        var price2 = parseFloat(price).toFixed(2);
        var product = new Product({
           title: title,
           slug: slug ,
           desc: desc,
           price: price2,
           category: category,
           image: imagefile

        });
       product.save((err)=>{
        if(err) return console.log(err);
         
         mkdirp.sync('public/product_images/'+product._id);

         mkdirp.sync('public/product_images/'+product._id+'/gallery');

         mkdirp.sync('public/product_images/'+product._id+'/gallery/thumbs');

         if(imagefile != ""){
          var productImage = req.files.image;
          var path = 'public/product_images/'+product._id+'/'+imagefile;
          productImage.mv(path , (err)=>{
           if(err) return console.log(err);
          });
         }
         

        req.flash('success' ,"product created");
        res.redirect('/admin/products');

       });

       }

      });
     
  }
});


/*
* GET Edit product
*/
router.get('/edit-product/:id' , isAdmin , (req, res)=>{
     
     Category.find((err , categories)=>{
          
          Product.findById(req.params.id , (err , p)=>{
            if(err){
              console.log(err);
              res.redirect('/admin/products');
            }else{
              var galleryDir = 'public/product_images/'+p._id+'/gallery';
              var galleryImages = null;

              fs.readdir(galleryDir , (err , files)=>{
               if(err){
                console.log(err)
               }else{
                galleryImages = files;
                 res.render('admin/edit_product', {
                      title: p.title ,
                      price: parseFloat(p.price).toFixed(2),
                      desc: p.desc,
                      categories: categories,
                      image : p.image,
                      galleryImages: galleryImages,
                      category: p.category.replace(/\s+/g ,'-').toLowerCase(),
                      id : p._id
                  });

               }
              });
            }
          });
      });
});

/*
* POST Edit product
*/
router.post('/edit-product/:id' , isAdmin ,[
      body('title' ,'title Must have a value').not().isEmpty(), 
      body('desc' ,'Description Must have a value').not().isEmpty(),
      body('price' ,'Price Must have a decimal value').isDecimal() 

  ] ,(req, res)=>{

    var title = req.body.title;
    var slug = title.replace(/\s+/g ,'-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;

    var imagefile = req.files ? req.files.image.name : "";
    var inValid = false;
    const expectedFileType = ['png' , 'jpg' , 'jpeg'];
     if(imagefile != ""){
       const extension = imagefile.split('.').pop();
     
      if(!expectedFileType.includes(extension)){
        var inValid = true;
        
      }
    }
      
   const errors = validationResult(req);

   if (!errors.isEmpty() || (inValid)) {
      if(inValid){
        var message = "Please insert a valid image file of .jpg, .png or .jpeg "; 
      }else{
        message = "";
      }
      const error = errors.array();
         Category.find((err , categories)=>{
          
          Product.findById(req.params.id , (err , p)=>{
            if(err){
              console.log(err);
              res.redirect('/admin/products');
            }else{
              var galleryDir = 'public/product_images/'+p._id+'/gallery';
              var galleryImages = null;

              fs.readdir(galleryDir , (err , files)=>{
               if(err){
                console.log(err)
               }else{
                galleryImages = files;
                 res.render('admin/edit_product', {
                      message: message,
                      error: error ,
                      title: p.title ,
                      price: parseFloat(p.price).toFixed(2),
                      desc: p.desc,
                      categories: categories,
                      image : p.image,
                      galleryImages: galleryImages,
                      category: p.category.replace(/\s+/g ,'-').toLowerCase(),
                      id : p._id
                  });

               }
              });
            }
          });
      });

  }else{
      Product.findOne({ slug: slug , _id: { $ne : id }} ,( err , p )=>{
       if(p){
        req.flash('danger' ,"product title exists.. choose another ");

        res.redirect('/admin/products/edit-product/'+id);

       }else{
         Product.findById(id , (err , p)=>{
        if(err) return console.log(err);

             p.title = title;
             p.slug = slug;
             p.desc = desc;
             p.price = parseFloat(price).toFixed(2);
             p.category = category;

             if(imagefile != ""){
              p.image = imagefile;
             }
             p.save((err)=>{
              if(err) console.log(err);
              if(imagefile!=""){
                if(pimage != ""){
                  fs.remove('public/product_images/'+id+'/'+ pimage ,(err)=>{
                     if(err) console.log(err);
                  });
                }
               var productImage = req.files.image;
               var path = 'public/product_images/'+id+'/'+imagefile;
               productImage.mv(path , (err)=>{
               if(err) return console.log(err);
                });  
              
              }
               req.flash('success' ,"product edited");
               res.redirect('/admin/products/edit-product/'+id);

             });
        

         });
       }

      });
     
  }
});

/*
* POST Product gallery 
*/
router.post('/product-gallery/:id' , isAdmin ,(req, res)=>{
   var productImages = req.files.file ;
   var id = req.params.id;
   var path = 'public/product_images/'+id+'/gallery/'+req.files.file.name;
   var thumbPath = 'public/product_images/'+id+'/gallery/thumbs/'+req.files.file.name;

   productImages.mv(path , (err)=>{
           if(err) return console.log(err);
          resizeImg(fs.readFileSync(path) , {width: 100 , height: 100})
          .then((buf)=>{
               fs.writeFileSync(thumbPath , buf);
            });
          });
   res.sendStatus(200);
   
})

/*
*  Delete Gallery Image 
*/
router.get('/delete-image/:image' , isAdmin ,(req, res)=>{
    var originalPath = 'public/product_images/'+req.query.id+'/gallery/'+req.params.image;
    var thumbPath = 'public/product_images/'+req.query.id+'/gallery/thumbs/'+req.params.image;  
   
    fs.remove(originalPath ,(err)=>{
                     if(err) {
                console.log(err);
              }else{
                fs.remove(thumbPath ,(err)=>{
                     if(err){ 
                      console.log(err);
                    }else{
                         req.flash('success' ,"Image deleted");
                         res.redirect('/admin/products/edit-product/'+req.query.id);
                    }
                  });
              }
          });

});



/*
* GET Delete Products 
*/
router.get('/delete-product/:id' , isAdmin ,(req, res)=>{
   var id = req.params.id;
   var path = 'public/product_images/'+id ;
   fs.remove(path , (err)=>{
    if(err){
      console.log(err);
    }else{
           Product.findByIdAndRemove(id , (err)=>{
          if(err) return console.log(err);
          req.flash('success' ,"product Deleted");
          res.redirect('/admin/products');

      });

    }
   });

});



module.exports = router;