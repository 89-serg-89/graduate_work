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

export const createHotelRoomsAdminSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  hotelId: Joi.string().required(),
})

export const updateHotelRoomsAdminSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  hotelId: Joi.string().required(),
  images: Joi.alternatives([Joi.array(), Joi.string()]).optional(),
  isEnabled: Joi.boolean().optional()
})

export const searchHotelRoomSchema = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  hotel: Joi.string().min(1).required(),
  isEnabled: Joi.boolean().optional()
})
