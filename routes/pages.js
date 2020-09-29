const router = require('express').Router();
const Page = require('../models/page');

/*
* GET pages index
*/
router.get('/' , (req, res)=>{
 res.render('page/index' , {
  title: 'Home' 
 });
})


/*
* GET any pages 
*/
// router.get('/:slug' , (req, res)=>{
//   var slug = req.params.slug;
//   Page.findOne({slug : slug} ,(err , page)=>{
//     if(err) console.log(err)
//       if(!page){
//         res.redirect('/');
//       }
//   });
// });



module.exports = router;