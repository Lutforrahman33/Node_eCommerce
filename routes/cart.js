const router = require('express').Router();
const Product = require('../models/product');

/*
* GET cart products
*/
router.get('/add/:product' , (req, res)=>{
 var slug = req.params.product;
 Product.findOne({ slug : slug } , (err , p)=>{
       if(err) console.log(err)
       if(typeof req.session.cart == "undefined"){
          req.session.cart = [];
          req.session.cart.push({
                  title: slug ,
                  qnty: 1,
                  price: parseFloat(p.price).toFixed(2),
                  image : '/product_images/'+p._id+'/'+p.image
          });
       }else{
             var cart = req.session.cart ;
             var newItem = true;
             for (var i = 0; i < cart.length ; i++) {
               if(cart[i].title == slug ){
                cart[i].qnty++ ;
                newItem = false;
                break;
               }
             }
             if(newItem){
                   cart.push({
                     title: slug ,
                     qnty: 1,
                     price: parseFloat(p.price).toFixed(2),
                     image : '/product_images/'+p._id+'/'+p.image
                 });
             }
       }

       
       req.flash('success' , 'Product Added');
       res.redirect('back');
  });

});

/*
* GET checkout page
*/
router.get('/checkout' , (req, res)=>{
  if(req.session.cart && req.session.length == 0){
    delete req.session.cart ;
     res.redirect('/cart/checkout');

  }else{
      res.render('page/checkout' , {
            title: 'Checkout',
            cart: req.session.cart
        });
  }
       
});

/*
* Update cart item
*/
router.get('/update/:product' , (req, res)=>{
    var slug = req.params.product;
    var action = req.query.action;
    var cart = req.session.cart;
    for (var i = 0; i <= cart.length; i++) {
      if(slug == cart[i].title){
        switch (action) {
          case "add":
             cart[i].qnty++;
            break;
          case "remove":
             cart[i].qnty--;
             if(cart[i].qnty < 1) cart.splice(i, 1);
             if(cart.length == 0) delete req.session.cart ;
            break;
          case "clear":
             cart.splice(i, 1);
             if(cart.length == 0) delete req.session.cart ;
            break;
          default:
            console.log('Update problem');
            break;
        }
        break;
      }

    }
       req.flash('success' , 'Cart updated');
       res.redirect('/cart/checkout');
       
});
/*
*  Clear cart item
*/

router.get('/clear' , (req, res)=>{
  
  delete req.session.cart ;
  req.flash('success' , 'Cart cleared');
   res.redirect('/cart/checkout');

});

/*
*  Buy cart item
*/

router.get('/buynow' , (req, res)=>{
  
  delete req.session.cart ;
  res.sendStatus(200);

});





module.exports = router;