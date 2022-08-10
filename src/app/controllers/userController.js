const userModel = require('../models/user')

module.exports = {

  retrieveAll: (req, res, next) => {
    userModel.find({ ...req.query }, { password: 0 }, (err, data) => {
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

  create: async (req, res, next) => {
    const { name, lastname, email, password, inactive } = req.body
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Bad request. Missing fields !' })
    }

    try {
      const existUser = await userModel.exists({ email })
      if (existUser) {
        return res.status(409).json({ status: 'error', message: 'The email already exists in the database' })
      }
    } catch (err) {
      return next(err)
    }

    const bodyData = {
      name,
      lastname,
      email,
      password,
      role: 'USER',
      inactive
    }
    try {
      const user = await userModel.create(bodyData)
      if (user) {
        res.status(201).json({ status: 'success', message: 'Created successfully!!!', data: user })
      } else {
        res.status(500).json({ status: 'error', message: 'Data was no saved!' })
      }
    } catch (err) {
      next(err)
    }
  },

  retrieve: (req, res, next) => {
    const { tokenData } = req
    /**
     * Esto se puede mejorar con un middleware, pero solo es demostrativo
     */
    if (tokenData.id !== req.params.id && !['EMPLOYEE', 'MOD', 'ADMIN'].includes(tokenData.role)) {
      res.header('Content-Type', 'application/problem+json')
      return res.status(403).json({
        status: 'error',
        message: 'You only can retrieve the information for you own user.'
      })
    }

    userModel.findById(req.params.id, (err, data) => {
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
  },

  update: (req, res, next) => {
    const { tokenData } = req
    /**
     * Esto se puede mejorar con un middleware, pero solo es demostrativo
     */
    if (tokenData.id !== req.params.id && !['EMPLOYEE', 'MOD', 'ADMIN'].includes(tokenData.role)) {
      res.header('Content-Type', 'application/problem+json')
      return res.status(403).json({
        status: 'error',
        message: 'You only can update the information for you own user.'
      })
    }

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
        next(err)
      } else {
        if (old) {
          res.status(200).json({ status: 'success', message: 'Updated successfully!', updated: bodyData, old_data: old })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found' })
        }
      }
    })
  },

  delete: (req, res, next) => {
    userModel.findByIdAndRemove(req.params.id, (err, data) => {
      if (err) {
        next(err)
      } else {
        if (data) {
          res.status(200).json({ status: 'success', message: 'Deleted successfully!', data })
        } else {
          res.status(404).json({ status: 'error', message: 'Data not found.' })
        }
      }
    })
  }

}
