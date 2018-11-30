const id = require('pow-mongodb-fixtures').createObjectId
const años=[
    {
        _id:id(),
        gestion:"2018",
        vacio:false
    },
]
const feriados=[
    {
        _id:id(),
        fecha: "2018-01-01",
        motivo: ["Año nuevo"],

    },
    {
        _id:id(),
        fecha: "2018-01-22",
        motivo: ["Dia del Estado Plurinacional de Bolivia"],

    },
    {
        _id:id(),
        fecha: "2018-02-12",
        motivo: ["Lunes de Carnaval"],

    },
    {
        _id:id(),
        fecha: "2018-02-13",
        motivo: ["Martes de Carnaval"],

    },
    {
        _id:id(),
        fecha: "2018-03-30",
        motivo: ["Viernes Santo"],

    },
    {
        _id:id(),
        fecha: "2018-05-01",
        motivo: ["Dia del trabajo"],

    },
    {
        _id:id(),
        fecha: "2018-06-21",
        motivo: ["Corpus Christi"], 

    },
    {
        _id:id(),
        fecha: "2018-08-21",
        motivo: ["Aymara Amazonico"],

    },
    {
        _id:id(),
        fecha: "2018-08-06",
        motivo: ["Dia de la Independencia de Bolivia"],

    },
    {
        _id:id(),
        fecha: "2018-11-02",
        motivo: ["Dia de Todos los Difuntos"],

    },
    {
        _id:id(),
        fecha: "2018-12-25",
        motivo: ["Navidad"],

    }
]
module.exports={
    años,
    feriados
}
