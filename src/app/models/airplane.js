const mongoose = require('mongoose')

/** Definimos la const de Schema */
const Schema = mongoose.Schema

const AirplaneSchema = Schema({
  /** NOMBRE DEL AVION */
  name: {
    type: String,
    required: true
  },
  /** TIPO DE AVION */
  type: {
    type: String,
    required: true
  },
  /** FECHA EN LA QUE FUE LANZADO AL PUBLICO */
  releaseDate: {
    type: Date,
    required: true
  },
  /** Si es una avion en EN SERVICIO, EN DESUSO, ETC */
  status: {
    type: String,
    default: 'Unknown'
  }
}, {
  timestamps: true
})

/** Me parece mejor practica nombrar las colecciones en lowerCase */
module.exports = mongoose.model('airplanes', AirplaneSchema)
