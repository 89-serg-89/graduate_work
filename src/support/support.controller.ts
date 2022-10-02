import {
  Body,
  Query,
  Param,
  Req,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  SetMetadata,
  UseGuards
} from '@nestjs/common'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/access.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { serialize } from '../helpers/utils'
import {
  createMessageSchema,
  createSupportRequestClientSchema,
  listSupportRequestClientSchema, messagesReadSchema
} from './joi/support.schema'
import { SupportRequestClientService } from './support-request-client.service'
import { SupportRequestService } from './support-request.service'
import { SupportRequestEmployeeService } from './support-request-employee.service'

@Controller('api/')
export class SupportController {
  constructor (
    private supportRequestClientService: SupportRequestClientService,
    private supportRequestEmployeeService: SupportRequestEmployeeService,
    private supportRequestService: SupportRequestService
  ) {  }

  @Post('client/support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client'])
  async createSupportRequestClient (
    @Req() req,
    @Body(new JoiValidationPipe(createSupportRequestClientSchema)) body
  ) {
    try {
      const support = await this.supportRequestClientService.createSupportRequest({
        user: req.user,
        ...body
      })
      return serialize(['id', 'createdAt', 'isActive', 'hasNewMessages'], support)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('client/support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client'])
  async listClient (
    @Query(new JoiValidationPipe(listSupportRequestClientSchema)) query
  ) {
    try {
      const lists = await this.supportRequestService.findSupportRequests(query)
      return lists.map(list => serialize(['id', 'createdAt', 'isActive', 'hasNewMessages'], list))
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('manager/support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['manager'])
  async listManager (
    @Query(new JoiValidationPipe(listSupportRequestClientSchema)) query
  ) {
    try {
      return await this.supportRequestService.findSupportRequests(query)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('common/support-requests/:id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  async messagesAll (
    @Req() req,
    @Param('id') id: string
  ) {
    try {
      const messages = await this.supportRequestService.getMessages({
        supportRequest: id,
        user: req.user
      })
      return messages.map(msg => {
        return {
          ...serialize(['id', 'sentAt', 'readAt', 'text'], msg),
          author: serialize(['id', 'name'], msg.author)
        }
      })
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('common/support-requests/:id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  async sendMessage (
    @Req() req,
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createMessageSchema)) body
  ) {
    try {
      if (!id) {
        throw new HttpException('support request id is required', HttpStatus.BAD_REQUEST)
      }
      const message = await this.supportRequestService.sendMessage({
        author: req.user,
        supportRequest: id,
        ...body
      })
      return {
        ...serialize(['id', 'sentAt', 'readAt', 'text'], message),
        author: serialize(['_id', 'name'], req.user)
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('common/support-requests/:id/messages/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  async messagesRead (
    @Req() req,
    @Param('id') id: string,
    @Body(new JoiValidationPipe(messagesReadSchema)) body
  ) {
    try {
      if (!id) {
        throw new HttpException('support request id is required', HttpStatus.BAD_REQUEST)
      }
      const service = req.user === 'client'
        ? this.supportRequestClientService
        : this.supportRequestEmployeeService
      await service.markMessagesAsRead({
        user: req.user,
        supportRequest: id,
        createdBefore: body.createdBefore
      })
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('common/support-requests/:id/messages/count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['client', 'manager'])
  async countUnreadMessages (
    @Req() req,
    @Param('id') id: string
  ) {
    try {
      if (!id) {
        throw new HttpException('support request id is required', HttpStatus.BAD_REQUEST)
      }
      const service = req.user === 'client'
        ? this.supportRequestClientService
        : this.supportRequestEmployeeService
      return await service.getUnreadCount(id)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('common/support-requests/:id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['manager'])
  async closeSupport (
    @Param('id') id: string
  ) {
    try {
      if (!id) {
        throw new HttpException('support request id is required', HttpStatus.BAD_REQUEST)
      }
      return await this.supportRequestEmployeeService.closeRequest(id)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
