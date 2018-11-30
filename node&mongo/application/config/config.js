const seeder=require('mongoose-seeder')
//const data=require('../../data.json')
const Feriado=require('../models/feriado')
const Año=require('../models/feriado')
//================
// Puerto
//================
PORT=process.env.PORT || 3000;


//================
// Entorno
//================


NODE_ENV=process.env.NODE_ENV || 'development';

//=======================
// Token
//=======================

Caducidad_Token=Math.floor(Date.now()/1000)+(60 * 60)

//=======================
//Conexiones
//=======================

mongoUrl= 'mongodb://localhost:27017/Feriados';

//=======================
// Feriados
//=======================

module.exports={
	// si es un entero, es N dias antes de la fecha inicial 
  feriados: new Array(
    {
      fecha: "01-01",
      motivo: ["Año nuevo",],
    },
    {
      fecha: "01-22",
      motivo: ["Dia del Estado Plurinacional de Bolivia",],
    },
    {
      fecha: "-48",
      motivo: ["Lunes de Carnaval",],
    },
    {
      fecha: "-47",
      motivo: ["Martes de Carnaval",],
    },
    {
      fecha: "-2",
      motivo: ["Viernes Santo",],
    },
    {
      fecha: "05-01",
      motivo: ["Dia del trabajo",],
    },
    {
      fecha: "-",
      motivo: ["Corpus Christi",], // fecha inicial
    },
    {
      fecha: "06-21",
      motivo: ["Aymara Amazonico",],
    },
    {
      fecha: "08-06",
      motivo: ["Dia de la Independencia de Bolivia",],
    },
    {
      fecha: "11-02",
      motivo: ["Dia de Todos los Difuntos",],
    },
    {
      fecha: "12-25",
      motivo: ["Navidad",],
    }
  ),
  mongoUrl
}