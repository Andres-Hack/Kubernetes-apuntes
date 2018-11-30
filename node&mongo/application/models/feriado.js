const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let feriadoSchema = new Schema({
    fecha: { type: String, required: [true, 'La fecha es necesario'] ,unique:true },
    motivo: { type: Array, required: [true, 'El nombre de la fecha es necesario'] },
});

let añoSchema = new Schema({
    gestion: { type: String, required: [true, 'El año es necesario'] ,unique:true },
    vacio: {type: Boolean,default:true}
});

let Feriado=mongoose.model('Feriado', feriadoSchema);
let Año=mongoose.model('Año', añoSchema);

module.exports={
    Feriado,
    Año
}
