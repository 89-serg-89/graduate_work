import * as Joi from 'joi'

export const signInSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required()
})
