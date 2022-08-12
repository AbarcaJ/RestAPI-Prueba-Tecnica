const airplaneModel = require('../models/airplane')

const retrieveAllAirplanes = (req, res, next) => {
  airplaneModel.find({}, (err, data) => {
    if (err) {
      next(err)
    } else {
      if (data) {
        res.json({ status: 'success', message: 'Data found successfully!!', data })
      } else {
        res.status(404).json({ status: 'error', message: 'Data not found.' })
      }
    }
  })
}

const createAirplane = async (req, res, next) => {
  const { name, type, releaseDate, status } = req.body
  if (!name || !type || !releaseDate) {
    return res.status(400).json({ status: 'error', message: 'Bad request. Missing fields !' })
  }

  const bodyData = { name, type, releaseDate, status }
  try {
    const airplane = await airplaneModel.create(bodyData)
    if (airplane) {
      res.status(201).json({ status: 'success', message: 'Created successfully!!!', data: airplane })
    } else {
      res.status(500).json({ status: 'error', message: 'Data was no saved!' })
    }
  } catch (err) {
    next(err)
  }
}

const retrieveAirplane = (req, res, next) => {
  airplaneModel.findById(req.params.id, (err, data) => {
    if (err) {
      next(err)
    } else {
      if (data) {
        res.status(200).json({ status: 'success', message: 'Retrieved successfully!', data })
      } else {
        res.status(404).json({ status: 'error', message: 'Data not found' })
      }
    }
  })
}

module.exports = {

  retrieveAllAirplanes,
  createAirplane,
  retrieveAirplane

}
