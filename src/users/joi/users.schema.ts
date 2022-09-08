import * as Joi from 'joi'

export const createSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required()
})

export const signInSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required()
})
