const userModel = require('../models/user')

module.exports = {

  retrieveAll: (req, res, next) => {
    userModel.find({ ...req.query }, (err, data) => {
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
  },

  create: (req, res, next) => {
    const { name, lastname, email, password, role, inactive } = req.body
    if (!name || !lastname || !email || !password || !role) {
      return res.status(400).json({ status: 'error', message: 'Bad request. Missing fields !' })
    }

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

    const bodyData = {
      name,
      lastname,
      email,
      password,
      role,
      inactive
    }
    userModel.create(bodyData, (err, data) => {
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
          res.status(404).json({ status: 'error', message: 'Data not found' })
        }
      }
    })
  },

  update: (req, res, next) => {
    const { name, lastname, email, password, role, inactive } = req.body
    const bodyData = {
      name,
      lastname,
      email,
      password,
      role,
      inactive
    }
    userModel.findByIdAndUpdate(req.params.id, bodyData, (err, old) => {
      if (err) {
        err.status = 500
        next(err)
      } else {
        if (old) {
          res.json({ status: 'success', message: 'Updated successfully!', updated: bodyData, old_data: old })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found' })
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
          res.status(404).json({ status: 'error', message: 'Data not found.' })
        }
      }
    })
  }

}
