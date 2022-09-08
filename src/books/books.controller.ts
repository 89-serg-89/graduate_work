import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException
} from '@nestjs/common'
import { BooksService } from './books.service'
import { CreateBooksDto } from './dto/create-books.dto'
import { JoiValidationPipe } from '../pipies/joi-validation.pipe'
import { createSchema } from './joi/create.schema'

@Controller('api/books')
export class BooksController {
  constructor (private booksService: BooksService) {  }

  @Get()
  async findAll () {
    try {
      return await this.booksService.findAll()
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Post()
  async create (
    @Body(new JoiValidationPipe(createSchema)) body: CreateBooksDto
  ) {
    try {
      return await this.booksService.create(body)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Put(':id')
  async update (
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createSchema)) body: CreateBooksDto
  ) {
    try {
      return await this.booksService.update(id, body)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  async delete (
    @Param('id') id: string
  ) {
    try {
      await this.booksService.delete(id)
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
