const path = require('path');
module.exports.isImage = function (value , filename) {
  
  var extension = (path.extname(filename)).toLowerCase();

  switch (extension) {
    case '.jpg' :
       return '.jpg' ;
         break;
    case '.png' :
       return '.png' ;
         break;
    case '.jpeg' :
       return '.jpeg' ;
         break;
    case '' :
       return '.jpg' ;
         break;
    default:
       return false ;
  }
}