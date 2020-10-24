const { urlencoded } = require('body-parser');
const express = require('express');
const db = require('./config/mongoose');
const fetch = require('node-fetch');


const Record = require('./models/record');

const app = express();
const port = 3000;

const url = 'https://doaj.org/query/journal%2Carticle/_search?ref=public_journal_article&callback=jQuery34009323951310715559_1602429079749&source=%7B%22query%22%3A%7B%22query_string%22%3A%7B%22query%22%3A%22data%20mining%22%2C%22default_operator%22%3A%22AND%22%7D%7D%2C%22aggs%22%3A%7B%22journal_article%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22_type%22%2C%22size%22%3A2%2C%22order%22%3A%7B%22_term%22%3A%22desc%22%7D%7D%7D%2C%22subject%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.classification.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22apc%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.has_apc.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22journal_title%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22bibjson.journal.title.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22seal%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.has_seal.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22journal_licence%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.license.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22publisher%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22bibjson.publisher.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22country_publisher%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.country.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22language%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22index.language.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22peer_review%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22bibjson.editorial_review.process.exact%22%2C%22size%22%3A10%2C%22order%22%3A%7B%22_count%22%3A%22desc%22%7D%7D%7D%2C%22year_added%22%3A%7B%22date_histogram%22%3A%7B%22field%22%3A%22created_date%22%2C%22interval%22%3A%22year%22%7D%7D%2C%22year_published%22%3A%7B%22date_histogram%22%3A%7B%22field%22%3A%22index.date%22%2C%22interval%22%3A%22year%22%7D%7D%7D%7D&_=1602429079766';

fetch(url)
    .then(res => res.text())
    .then(body => {
      
        const records=JSON.parse(body.substring(body.indexOf("(")+1,body.lastIndexOf(")"))).hits.hits;
        for(record of records){
       
          Record.create({
            title:record._source.bibjson.title,
            year:record._source.bibjson.year,
            author:record._source.bibjson.author.map(name=>name.name),
            url:"https://doaj.org/article/"+record._id 

          }) 
        } 

    });

app.use(express.urlencoded());

app.set('view engine','ejs');
app.set('views','./views');

app.get('/',(req,res)=>{
    
 Record.find((err,records)=>{
    res.render('home',{
        records:records
    })
 })

   
}) 


app.listen(port,(err)=>{
    if(err){console.log(`error in firing up the server ${err}`)};
    console.log(`server is running on port : ${port}`)
})