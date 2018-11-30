'use strict'
require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
//x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//json
app.use(bodyParser.json());

//routes
app.use(require('./routes/index'));
//app.use(express.static(path.resolve(__dirname,'../public')))

mongoose.connect('mongodb://db:27017/Feriados',(err)=>{
	if(err) throw err;
	console.log('Base de datos en el aire');
});
app.listen(PORT,()=>{
	console.log("Escuchando el puerto ",PORT);
});