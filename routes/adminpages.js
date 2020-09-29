const router = require('express').Router();
const Page = require('../models/page');

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

const { body, validationResult } = require('express-validator');

/*
* GET pages index
*/
router.get('/' , isAdmin , (req, res)=>{
   Page.find({ } , (err , pages)=>{
 if(pages){
             res.render('admin/index' , { pages : pages });

 }else{
  req.flash('danger' ," no page");
 }

   });
})

/*
* GET add pages
*/
router.get('/add-page' , isAdmin , (req, res)=>{
    var title = ""
    var slug = ""
    var content = ""

    res.render('admin/add_page', {
        title: title ,
        slug: slug ,
        content: content

    });
})

/*
* POST add pages
*/
router.post('/add-page' , isAdmin ,[
      body('title' ,'title Must have a value').not().isEmpty(), 
      body('content' ,'content Must have a value').not().isEmpty()

  ] ,(req, res)=>{

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g ,'-').toLowerCase();
    if (slug == ""){
      slug = title.replace(/\s+/g ,'-').toLowerCase();
    }
    var content = req.body.content;
      
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      
      const error = errors.array();
        res.render('admin/add_page', {
            error: error ,
            title: title ,
            slug: slug ,
            content: content
        });

  }else{
      Page.findOne({ slug: slug } ,( err , page )=>{
       if(page){
        req.flash('danger' ,"page exists.. choose another ");

        res.render('admin/add_page', {
            title: title ,
            slug: slug ,
            content: content
        });

       }else{
        var page = new Page({
           title: title,
           slug: slug ,
           content: content

        });
       page.save((err)=>{
        if(err) return console.log(err);

        req.flash('success' ,"page created");
        res.redirect('/admin/pages');

       });

       }

      });
     
  }
});


/*
* GET Edit pages
*/
router.get('/edit-page/:slug' , isAdmin , (req, res)=>{
      Page.findOne({ slug: req.params.slug } , (err , page)=>{
       if(err) return console.log(err);

        res.render('admin/edit_page', {
        title: page.title ,
        slug: page.slug ,
        content: page.content,
        id: page._id

    });
       
      });    
});

/*
* POST Edit pages
*/
router.post('/edit-page/:slug' , isAdmin ,[
      body('title' ,'title Must have a value').not().isEmpty(), 
      body('content' ,'content Must have a value').not().isEmpty()

  ] ,(req, res)=>{

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g ,'-').toLowerCase();
    if (slug == ""){
      slug = title.replace(/\s+/g ,'-').toLowerCase();
    }
    var content = req.body.content;
    var id = req.body.id;
      
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      
      const error = errors.array();
        res.render('admin/edit_page', {
            error: error ,
            title: title ,
            slug: slug ,
            content: content,
            id: id
        });

  }else{
      Page.findOne({ slug: slug , _id: {'$ne': id }} ,( err , page )=>{
       if(page){
        req.flash('danger' ,"page exists.. choose another ");

        res.render('admin/edit_page', {
            title: title ,
            slug: slug ,
            content: content,
            id: id
        });

       }else{
         Page.findById(id , (err , page)=>{
        if(err) return console.log(err);

             page.title = title;
             page.slug = slug;
             page.content = content;
        page.save((err)=>{
        if(err) return console.log(err);

        req.flash('success' ,"page created");
        res.redirect('/admin/pages/edit-page/'+page.slug);

       });

         });
       }

      });
     
  }
});


/*
* GET Delete page 
*/
router.get('/delete-page/:id' , isAdmin, (req, res)=>{
   Page.findByIdAndRemove(req.params.id , (err)=>{
   if(err) return console.log(err);

    req.flash('success' ,"page Deleted");
    res.redirect('/admin/pages');

   });
})



module.exports = router;