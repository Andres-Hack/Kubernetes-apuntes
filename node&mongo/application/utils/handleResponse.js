
module.exports={
    mensajeExito: (res, mensajeExito, codigo, datos, next) => {
        if (next) next();
        const codigoEnviar = codigo ? codigo : 200;
        return res.status(codigoEnviar).json({
            finalizado: true,
            mensaje: mensajeExito,
            datos: datos ? datos : null,
          });
      },
    mensajeError: (res, mensajeError, codigo,datos,next) => {       
        if(next) next();
        const codigoEnviar = codigo ? codigo : 400;
        /*if (typeof mensajeError === 'object' && mensajeError.errors) {
            mensajeError = (mensajeError.errors.map((x) => x.message)).join(", ");
        } else if (mensajeError.message) {
            mensajeError = mensajeError.message;
        }**/
        return res.status(codigoEnviar).json({
            finalizado: false,
            mensaje: mensajeError,
            datos: datos ? datos: null
        });
    }
}