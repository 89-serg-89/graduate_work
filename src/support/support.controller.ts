import {
  Body,
  Query,
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
  createSupportRequestClientSchema,
  listSupportRequestClientSchema
} from './joi/support.schema'
import { SupportRequestClientService } from './support-request-client.service'
import { SupportRequestService } from './support-request.service'

@Controller('api/')
export class SupportController {
  constructor (
    private supportRequestClientService: SupportRequestClientService,
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
      const message = await this.supportRequestService.sendMessage({
        author: req.user,
        ...body
      })
      const support = await this.supportRequestClientService.createSupportRequest({
        user: req.user,
        messages: [message],
        isActive: true,
        hasNewMessages: true
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
}
