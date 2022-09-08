import * as Joi from 'joi'

export const createSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(5).required(),
  favorite: Joi.boolean().optional(),
  authors: Joi.string().optional(),
  fileCover: Joi.string().optional(),
  fileName: Joi.string().optional(),
  fileBook: Joi.string().optional()
})
