$(document).ready(function(){

 $('a.confirmDelete').on('click' , ()=>{
   if(!confirm('Confirm Deletion ?'))
     return false;

 })

 if($("[data-fancybox]").length) {
   $("[data-fancybox]").fancybox();
 }
  

});
  
