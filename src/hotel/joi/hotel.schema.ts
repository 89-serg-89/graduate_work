import * as Joi from 'joi'

export const searchHotelRoomSchema = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  hotel: Joi.string().min(1).optional(),
  isEnabled: Joi.boolean().optional()
})
