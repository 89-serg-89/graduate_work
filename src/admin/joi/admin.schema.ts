import * as Joi from 'joi'

export const createAdminSchema = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(2).required(),
  contactPhone: Joi.string().min(2).optional(),
  role: Joi.string().optional()
})

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
  hotelId: Joi.string().required()
})

export const updateHotelRoomsAdminSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  hotelId: Joi.string().required(),
  images: Joi.alternatives([Joi.array(), Joi.string()]).optional(),
  isEnabled: Joi.boolean().optional()
})