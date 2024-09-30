const mongoose=require('mongoose');
const main=async ()=>{
    try{
        await mongoose.connect("mongodb://0.0.0.0:27017/working");
        console.log('connected');
    }catch(error){
        console.log(error);
    }
}

main()