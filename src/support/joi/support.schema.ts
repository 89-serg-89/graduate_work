import * as Joi from 'joi'

export const createSupportRequestClientSchema = Joi.object({
  text: Joi.string().min(3).required()
})

export const createMessageSchema = Joi.object({
  text: Joi.string().min(3).required()
})

export const listSupportRequestClientSchema = Joi.object({
  isActive: Joi.boolean().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional()
})

export const messagesReadSchema = Joi.object({
  createdBefore: Joi.date().required()
})
