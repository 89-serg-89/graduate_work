import * as Joi from 'joi'

export const registrationSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(2).required(),
  contactPhone: Joi.string().min(2).optional()
})

export const createAdminSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(2).required(),
  contactPhone: Joi.string().min(2).optional(),
  role: Joi.string().optional()
})

export const listSchema = Joi.object({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  contactPhone: Joi.number().optional(),
})
