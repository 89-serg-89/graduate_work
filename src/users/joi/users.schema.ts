import * as Joi from 'joi'

export const createSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(2).required(),
  contactPhone: Joi.string().min(2).optional()
})
