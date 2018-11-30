'use strict'
const express=require('express');
const app=express();
//const _=require('underscore');
const {listarGestiones,eliminarGestion}=require('../controller/feriado')

//=============================
// Listar todas las Gestiones
//=============================

app.get('/api/v1/feriados/anio',listarGestiones);

//==========================
// Borrar una Gestion
//==========================

app.delete('/api/v1/feriados/gestion',eliminarGestion);
module.exports=app;
