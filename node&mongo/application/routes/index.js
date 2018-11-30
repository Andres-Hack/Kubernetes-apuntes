const express=require('express');
const app=express();

app.use(require('./feriado'));
app.use(require('./gestion'));

module.exports=app;