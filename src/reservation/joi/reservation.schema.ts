import * as Joi from 'joi'

export const createClientSchema = Joi.object({
  hotelRoom: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
})
