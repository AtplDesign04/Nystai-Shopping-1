const products = require('../basedata/exampledata.json');
const sampleProducts = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database')

dotenv.config({path:'backend/config/config.env'});
connectDatabase();

const seedProducts = async ()=>{
    try{
        await sampleProducts.deleteMany();
        console.log('sample products deleted!')
        await sampleProducts.insertMany(products);
        console.log('All Products added!');
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProducts();



