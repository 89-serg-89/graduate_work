import * as Joi from 'joi'

export const createSupportRequestClientSchema = Joi.object({
  text: Joi.string().min(3).required()
})
