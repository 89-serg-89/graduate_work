import * as Joi from 'joi'

export const createHotelAdminSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional()
})

export const searchHotelAdminSchema = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  title: Joi.string().optional()
})

export const searchHotelRoomSchema = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  hotel: Joi.string().min(1).required(),
  isEnabled: Joi.boolean().optional()
})
