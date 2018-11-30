const debug = require('debug')('bpm:fixtures')
const mongoose = require('mongoose')
const path = require('path')
const {mongoUrl} = require('../config/config')
const inquirer = require('inquirer')
// const { exec } = require('child_process')
const prompt = inquirer.createPromptModule()
const{años,feriados}=require('../fixtures/data/data')
const MongoClient = require('mongodb').MongoClient;

// Promesa para cargar los fixtures
function loadFixtures(xmongoUrl, fixtures_path) {
  return new Promise(async resolve => {
    const fixtures = await require('pow-mongodb-fixtures').connect(xmongoUrl)
    await fixtures.load(path.join(__dirname, fixtures_path), err => {
      if (err) {
        console.log('========================================_MENSAJE_A_MOSTRARSE_========================================')
        console.log(err);
        console.log('=====================================================================================================')
        throw 'Error al cargar fixtures'
      } else {
        resolve()
      }
    })
    await MongoClient.connect(xmongoUrl, async function(err, client) {
      const nameDB = xmongoUrl.split('/').pop()
      const db = client.db(nameDB);
      await db.command( { create: "feriados", viewOn: "feriado", pipeline: feriados});
      await db.command( { create: "years", viewOn: "year", pipeline: years});
      client.close();
    });
  })
}

// Funcion para borrar y crear la base de datos
async function cleanDatabase (xmongoUrl){
    try {
      const conn = await mongoose.connect(xmongoUrl)
      await conn.connection.db.dropDatabase()
      const allModels = await require('../models/feriado')
      debug('Cargando Modelos de Schema: \n%o', allModels)
    } catch (error) {
      debug('No se puede establecer conexion con la base de datos', error) 
    }
}

// Funcion principal para cargar fixtures basado en la variable de entorno
// NODE_ENV en producion, development o test
async function start () {
  const node_env =  NODE_ENV
  if (node_env === 'production' || node_env === 'development') {
    const answer = await prompt([{
      type: 'confirm',
      name: 'setup',
      message: 'Este proceso destruira tu base de datos, usted esta seguro?'
    }])
    if (!answer.setup){
      return console.log('Accion cancelada')
    }
  }
  await cleanDatabase(mongoUrl)
  await loadFixtures(mongoUrl, 'data/')
  process.exit(0)
}

// El Proceso se esta ejecutando desde la terminal
if (!module.parent){
  start()
}

module.exports = start