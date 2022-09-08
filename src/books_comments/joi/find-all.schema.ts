import * as Joi from 'joi'

export const findAllSchema = Joi.object({
  bookId: Joi.string().required()
})
