const {feriados,meses} = require('../config/config')
const {Feriado,Año} = require('../models/feriado')
const moment=require('moment')
const {mensajeError,mensajeExito}=require('../utils/handleResponse')
moment.locale('es')
var _ = require('lodash')

module.exports={
  fechaInicial: async (req, res) => {
    const anio=req.query.anio
    const vacio=req.query.vacio 
      const fecha_inicial = (anio) => {
        let p_m = 24
        let p_n = 5
        let p_a, p_b, p_c, p_d, p_e, p_dia, p_mes
        p_a = anio % 19
        p_b = anio % 4
        p_c = anio % 7
        p_d = (19 * p_a + p_m) % 30
        p_e = (2 * p_b + 4 * p_c + 6 * p_d + p_n) % 7
        if ((p_d + p_e) < 10) {
          p_dia = p_d + p_e + 22
          p_mes = 3
        } else {
          p_dia = p_d + p_e - 9
          p_mes = 4
        }
        if (p_dia == 26 && p_mes == 4) {
          p_dia = 19
        } else if (p_dia == 25 && p_mes == 4 && p_d == 28 && p_e == 6 && p_a > 10) {
          p_dia = 18
        }
        let fechaCalculada = moment(`${anio}/${p_mes}/${p_dia}`).format('YYYY-MM-DD')
        return fechaCalculada
      }
    
/*      const fecha_inicial= (anio) =>{
        let p_a,p_b,p_c,p_d,p_e,p_f,p_g,p_h,p_i,p_k,p_l,p_m,p_n,mes,dia
        p_a=anio%19
        p_b=(anio-(anio%100))/100
        p_c=anio%100
        p_d=(p_b-(p_b%4))/4
        p_e=p_b%4
        p_f=((p_b+8)-((p_b+8)%25))/25
        p_g=((p_b+p_f+1)-((p_b+p_f+1)%3))/3
        p_h=((19*p_a)+p_b+p_d+p_g+15)%30
        p_i=(p_c-(p_c%4))/4
        p_k=p_c%4
        p_l=(32+(2*p_e)+(2*p_i)-p_h-p_k)%7
        p_m=((p_a+(11*p_h)+(22*p_l))-((p_a+(11*p_h)+(22*p_l))%451))/451
        p_n=p_h+p_l+-(7*p_m)+114
        mes=(p_n-(p_n%31))/31
        dia=1+(p_n%31)
        let fecha_calculada=moment(`${anio}-${mes}-${dia}`).add(7,'day').format('YYYY-MM-DD')
        return fecha_calculada
      }
**/
      let copia_feriados=_.clone(feriados)
      let fechaCalculada = fecha_inicial(anio)
      const listaFeriados = (feriados) => {
        const nuevosFeriados = []
        for (let item of feriados) {
          const fecha = moment(`${anio}-${item.fecha}`)
          if (!fecha.isValid()) {
            if (item.fecha == '-') {
              nuevosFeriados.push(moment(fechaCalculada).subtract(1, 'year').add(2, 'month').add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD') )
            } else {
              nuevosFeriados.push(moment(fechaCalculada).subtract(parseInt(item.fecha.substring(1, item.fecha.length)), 'days').format('YYYY-MM-DD') )
            }
          } else {
            nuevosFeriados.push(moment(`${anio}-${item.fecha}`).format('YYYY-MM-DD') )
          }
        }
        return nuevosFeriados
      }
      let nuevosFeriados = listaFeriados(copia_feriados)
      const soloFeriadosHabiles = (copia_feriados) => {
        let nuevosFeriados = []
        for (let feriado of copia_feriados) {
          if ( moment(feriado).format('dddd') == 'Sunday') {
            feriado = moment(feriado).add(1, 'day').format('YYYY-MM-DD')
          }
          nuevosFeriados.push(feriado)
        }
        return nuevosFeriados
      }
      let nuevosFeriados_1 = soloFeriadosHabiles(nuevosFeriados)
      let i=0
      let copia_feriados_1=[]
      let dia_festivo
      for(let copia_feriado of copia_feriados){
          dia_festivo=new Object()
          dia_festivo.fecha=nuevosFeriados_1[i]
          dia_festivo.motivo=copia_feriado.motivo
          copia_feriados_1.push(dia_festivo)
          i=i+1
      }
      let feriado;
      if(vacio){
        let gestion=new Año({
          gestion: anio,
          vacio:vacio
        });
        gestion.save((err,añoDB)=>{
          if(err){
            return res.status(400).json({
              finalizado:false,
              mensaje:`El año ${anio} ya existe`,
              datos:null 
            })
          }
          mensajeExito(res,`Se creo la gestion ${anio}`,200,añoDB)  
        })  
      }
      else{
        let gestion=new Año({
          gestion: anio,
          vacio:false
        });
        gestion.save((err,añoDB)=>{
          if(err){
            return res.status(400).json({
              finalizado:false,
              mensaje:`El año ${anio} ya existe`,
              datos:null 
            })
          }
          for(let item of copia_feriados_1){
            feriado=new Feriado({
                fecha:item.fecha,
                motivo:item.motivo
            });
            feriado.save((error,feriadoDB)=>{
              if(error){
                return res.status(400).json({
                  finalizado:false,
                  mensaje:`la fecha ${item.fecha} ya existe`
                });
              }
            });
          }
          res.json({
            finalizado:true,
            mensaje:`Se creo el calendario de la gestion ${anio}`,
            datos:añoDB
          })
        })
      }
  },
  listarFeriados:(req,res)=>{
    Feriado.find({},'fecha motivo')
         .sort('fecha')
         .exec((err,feriados)=>{
            if(err){
              return res.status(400).json({
                finalizado:false,
                mensaje:`Error al generar la lista de feriados`,
              })
            }
            if(feriados.length==0){
              return res.status(400).json({
                finalizado:false,
                mensaje:`No existe la lista de feriados`,
              })
            }
            mensajeExito(res,`Se genero la lista de feriados`,200,feriados)
         });
  },
  busquedaTiempo:(req,res)=>{
    let anio=req.query.anio
    let mes=req.query.mes
    let dia=req.query.dia
    let busqueda
    if(anio){
      busqueda=anio
    }
    if(anio && mes){
      busqueda=`${anio}-${mes}`
    }
    if(anio && mes && dia){
      busqueda=`${anio}-${mes}-${dia}`
    }
    let re=new RegExp(busqueda,'i')
    Feriado.find({},'fecha motivo')
         .or({ fecha:{ $regex:re } })
         .sort('fecha')
         .exec((err,feriados)=>{
            if(err){
              return res.status(400).json({
                finalizado:false,
                mensaje:`Error al buscar el registro ${busqueda}`,
              })
            }
            if(feriados.length==0){
              return res.status(400).json({
                finalizado:false,
                mensaje:`No se encontro el registro ${busqueda}`,
              })
            }
            mensajeExito(res,`Se encontro registros con el patron ${busqueda}`,200,feriados)
    })
  },
  crearFecha:(req,res)=>{
    let fecha=req.body.fecha
    fecha=moment(fecha).format('YYYY-MM-DD')
    let motivo=req.body.motivo.split(",")
    let anio=moment(fecha).format('YYYY')
    let feriado=new Feriado({
      fecha:fecha,
      motivo:motivo
    });
    Año.findOneAndUpdate({},{vacio:false},{new:true,runValidators:true},(err,feriadoDB)=>{
      if(err){
        return res.status(400).json({
          finalizado:false,
          mensaje:`Error al modificar la fecha ${fecha}`,
          datos:null
        })
      }
    })
    feriado.save((err,feriadoDB)=>{
      if(err){
        return res.status(400).json({
          finalizado:false,
          mensaje:`La fecha ${fecha} ya existe`,
          datos:null 
        })
      }
      mensajeExito(res,`Se creo la fecha ${fecha} con exito`,200,feriadoDB)
    });
  },
  modificarFecha:(req,res)=>{
    let fecha=req.query.fecha
    //fecha=moment(fecha).format('YYYY-MM-DD')
    let body=req.body
    let descFeriado={
      motivo:body.motivo
    };
    Feriado.findOneAndUpdate({fecha:fecha},descFeriado,{new:true,runValidators:true},(err,feriadoDB)=>{
      if(err){
        return res.status(400).json({
          finalizado:false,
          mensaje:`Error al modificar la fecha ${fecha}`,
          datos:null
        })
      }
      if(!feriadoDB){
        return res.status(400).json({
          finalizado:false,
          mensaje:`No se encontro la fecha ${fecha}`,
          datos:null
        })
      }
      mensajeExito(res,`Se modifico la fecha ${fecha} con exito`,200,feriadoDB)
    })
  },
  eliminarFecha:(req,res)=>{
    let busqueda=req.query.fecha
    busqueda=moment(busqueda).format('YYYY-MM-DD')
    //console.log(busqueda)
    Feriado.findOneAndDelete({fecha:busqueda},(err,feriadoBorrado)=>{
      if(err){
        return res.status(400).json({
          finalizado:false,
          mensaje:`Error al eliminar la fecha ${fecha}`,
          datos:null
        })
      }
      if(!feriadoBorrado){
        return res.status(400).json({
          finalizado:false,
          mensaje:`No se encontro la fecha ${busqueda}`,
          datos:null
        })
      }
      mensajeExito(res,`Se elimino la fecha ${busqueda} con exito`,200,feriadoBorrado)
    })
  },
  listarGestiones:(req,res)=>{
    Año.find()
        .sort('gestion')
        .exec((err,años)=>{
                if(err){
                  return res.status(400).json({
                    finalizado:false,
                    mensaje:`Error al listar las gestiones`,
                  })
                }
                mensajeExito(res,`Lista de gestiones`,200,años)
            })
  },
  eliminarGestion:(req,res)=>{
    let anio=req.query.anio;
    Año.findOneAndDelete({gestion:anio},(err,añoBorrado)=>{
      if(err){
        return res.status(400).json({
          finalizado:false,
          mensaje:`Error al eliminar la gestion ${anio}`,
          datos:null
        })
      }
      if(!añoBorrado){
        return res.status(400).json({
          finalizado:false,
          mensaje:`No se encontro la gestion ${anio}`,
          datos:null
        })
      }
      let re=new RegExp(anio,'i')
      for(let i=1;i<=1000;i++){
        Feriado.find()
             .or({ fecha:{ $regex:re } })
             .remove()
             .exec((error)=>{
                if(error){
                mensajeError(res,error.message,400)
                }
           })
      }
      mensajeExito(res,`Se elimino la gestion ${anio} con exito`,200,añoBorrado)
    })
  },
  comprobarStatus:(req,res)=>{
    if(res.status(200)){
      return res.json({
        finalizado:true,
        mensaje:"Api disponible" 
      })
    }
    else{
      return res.json({
        finalizado:false,
        mensaje:"Api dado de baja",
      })
    }
  }
}