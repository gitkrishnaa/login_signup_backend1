module.exports.print2=(req,print_data_arr,is_print)=>{
    // how to use
    // requrw- 1st param will be req object, 2nd, all that to be printed, third param will tell print, even it not passed in headers
    // so if you want to print it, pass console true in headers, if passed, all variable in print_data_get printed
   if(is_print==false){

   }
   else if(is_print==true){
    console.log(print_data_arr)
   }
   else{
    const is_console=req.headers['console']
    if(is_console==true || is_console=="true"){
    if(   Object.prototype.toString.call(print_data_arr) === "[object Array]"){
       
       print_data_arr.map((args)=>{
        if(typeof(args)=="string"){
            const obj={}
            obj[`${args}`]=args;
            args=obj
        }
       
       })
        
     console.log(print_data_arr)

    }
    else{
        console.log("please use   {} in args 2nd of print() ");
    }
 

  
   }
}
    
   
}
module.exports.print=(req,print_data_arr,is_print)=>{
    // how to use
    // requrw- 1st param will be req object, 2nd, all that to be printed, third param will tell print, even it not passed in headers
    // so if you want to print it, pass console true in headers, if passed, all variable in print_data_get printed
   if(is_print==false){

   }
   else if(is_print==true){
    console.log(print_data_arr)
   }
   else{
    const is_console=req.headers['console']
    if(is_console==true || is_console=="true"){
    if(   Object.prototype.toString.call(print_data_arr) === "[object Object]"){
       
     console.log(print_data_arr)

    }
    else{
        console.log("please use {} in args 2nd of print() ");
    }
 

  
   }
}
    
   
}