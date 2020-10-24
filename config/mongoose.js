const mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost/crawl');  

const db = mongoose.connection;   // if connection succesfull

db.on('error',console.error.bind('console',"error in connecting to Db")); // if error in connecting

db.once('open',()=>{
    console.log('Database Successfuly Connected');
})

module.exports =db; 