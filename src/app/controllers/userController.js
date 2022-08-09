const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

module.exports = {

  login: {

  },

  refreshToken: {

  },

  retrieveAll: (req, res, next) => {
    userModel.find({ ...req.query }, (err, data) => {
      if (err) {
        next(err)
      } else {
        if (data) {
          res.json({ status: 'success', message: 'Data found successfully!!', data })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found.', data: null })
        }
      }
    })
  },

  create: (req, res, next) => {
    const { name, lastname, username, email, password, role } = req.body
    if (!name || !lastname || !username || !email || !password || !role) {
      userModel.findOne({ email }, (err, data) => {
        if (err) {
          err.status = 500
          next(err)
        } else {
          if (data) {
            return res.status(409).json({ status: 'error', message: 'The email already exists in the database' })
          }
        }
      })
    }

    userModel.create({ name, lastname, username, email, password, role, active: true }, (err, data) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        res.json({ status: 'success', message: 'Created successfully!!!', data })
      }
    })
  },

  retrieve: (req, res, next) => {
    userModel.findById(req.params.id, (err, data) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        if (data) {
          res.json({ status: 'success', message: 'Retrieved successfully!', data })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found', data: null })
        }
      }
    })
  },

  update: (req, res, next) => {
    const data = { ...req.body }
    userModel.findByIdAndUpdate({ _id: req.params.id }, data, (err, old) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        if (old) {
          res.json({ status: 'success', message: 'Updated successfully!', data, old })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found', data: null })
        }
      }
    })
  },

  delete: (req, res, next) => {
    userModel.findByIdAndRemove(req.params.id, (err, data) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        if (data) {
          res.json({ status: 'success', message: 'Deleted successfully!', data })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found.', data: null })
        }
      }
    })
  }

}
