import * as Joi from 'joi'

export const createSchema = Joi.object({
  bookId: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  comment: Joi.string().min(5).required()
})
