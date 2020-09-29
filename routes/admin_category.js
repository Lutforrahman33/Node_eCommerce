const router = require('express').Router();
const Category = require('../models/category');
const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

const { body, validationResult } = require('express-validator');

/*
* GET category index
*/
router.get('/' , isAdmin ,(req, res)=>{
  
  Category.find({ } , (err , categories)=>{
 if(categories){
             res.render('admin/category' , { categories : categories });

 }else{
  req.flash('danger' ," no Category");
 }

   });
})

/*
* GET add category
*/
router.get('/add-category' , isAdmin ,(req, res)=>{
    var title = ""
  

    res.render('admin/add_category', {
        title: title 

    });
})

/*
* POST add category
*/
router.post('/add-category' , isAdmin, [
      body('title' ,'title Must have a value').not().isEmpty(), 

  ] ,(req, res)=>{

    var title = req.body.title;
  
    var slug = title.replace(/\s+/g ,'-').toLowerCase();
    
      
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      
      const error = errors.array();
        res.render('admin/add_category', {
            error: error ,
            title: title 
        });

  }else{
      Category.findOne({ slug: slug } ,( err , category )=>{
       if(category){
        req.flash('danger' ,"Category exists.. choose another ");

        res.render('admin/add_category', {
            title: title 
             
        });

       }else{
        var category = new Category({
           title: title ,
           slug: slug
          
        });
       category.save((err)=>{
        if(err) return console.log(err);

            Category.find((err , categories)=>{
          if(err) {
           console.log(err);
          }else{
          req.app.locals.categories = categories ;
          }
        });

        req.flash('success' ,"Category created");
        res.redirect('/admin/categories');

       });

       }

      });
     
  }
});


/*
* GET Edit Category
*/
router.get('/edit-category/:id' , isAdmin , (req, res)=>{
      Category.findById(req.params.id , (err , category)=>{
       if(err) return console.log(err);

        res.render('admin/edit_category', {
        title: category.title ,
        id: category._id

    });
       
      });    
});

/*
* POST Edit pages
*/
router.post('/edit-category/:id' , isAdmin ,[
      body('title' ,'title Must have a value').not().isEmpty()

  ] ,(req, res)=>{

    var title = req.body.title;
   
    var slug = title.replace(/\s+/g ,'-').toLowerCase();
        
    var id = req.params.id;
      
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      
      const error = errors.array();
        res.render('admin/edit_category', {
            error: error ,
            title: title ,
            id: id
        });

  }else{
      Category.findOne({ slug: slug , _id: {'$ne': id }} ,( err , category )=>{
       if(category){
        req.flash('danger' ,"Category exists.. choose another ");

        res.render('admin/edit_category', {
            title: title ,
            id: id
        });


       }else{
         Category.findById(id , (err , category)=>{
        if(err) return console.log(err);

             category.title = title;
             category.slug = slug;
             
        category.save((err)=>{
        if(err) return console.log(err);

              Category.find((err , categories)=>{
            if(err) {
             console.log(err);
            }else{
            req.app.locals.categories = categories ;
            }
          });

        req.flash('success' ,"category edited");
        res.redirect('/admin/categories/edit-category/'+id);

       });

         });
       }

      });
     
  }
});


/*
* GET Delete Category 
*/
router.get('/delete-category/:id' , isAdmin ,(req, res)=>{
   Category.findByIdAndRemove(req.params.id , (err)=>{
   if(err) return console.log(err);

    req.flash('success' ,"Category Deleted");
    res.redirect('/admin/categories');

   });
})



module.exports = router;