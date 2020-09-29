const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const passport = require('passport');



//database connection
mongoose.connect('mongodb://localhost:27017/node_shop', {useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect to database');
});



const app = express();

//view engine
app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs')

//set public folder
app.use(express.static(path.join(__dirname , 'public')));

//set global errors variable
//app.locals.errors = null;

//Get all Category
const Category = require('./models/category');
Category.find((err , categories)=>{
  if(err) {
   console.log(err);
 }else{
  app.locals.categories = categories ;
 }
});


//file upload

app.use(fileUpload());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express-session

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//express-messages

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//passport middlewire
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.get('*' , (req , res, next)=>{
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


// set routes
const pages = require('./routes/pages');
const products = require('./routes/products');
const cart = require('./routes/cart');
const users = require('./routes/users');
const adminPages = require('./routes/adminpages');
const adminCategory = require('./routes/admin_category');
const adminProduct = require('./routes/admin_product');

app.use('/' , pages);
app.use('/products' , products);
app.use('/cart' , cart);
app.use('/users' , users);
app.use('/admin/pages' , adminPages);
app.use('/admin/categories' , adminCategory);
app.use('/admin/products' , adminProduct);





//start the server
app.listen(3000 , ()=>{
 console.log('server running');
});
