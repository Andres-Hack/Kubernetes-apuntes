'use strict'
const {feriados}=require('../config/config')
const feriado=require('../controller/feriado')
const {Año,Feriado}=require('../models/feriado')
const {Caducidad_Token}=require('../config/config')
//=============================
// Verificar Token
//=============================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.año = decoded.año;
        next();
    });
};

module.exports={
	
}
