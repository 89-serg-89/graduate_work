import { Model } from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { BooksService } from './books.service'
import { Books } from './schemas/books.schema'

const mockBook = {
  id: '62ed1ffc91e8eb901830b94d',
  title: 'jest test book',
  description: 'description'
}

const booksArray = [
  {
    _id: '62ed1ffc91e8eb901830b94d',
    title: 'test',
    description: 'description',
    favorite: false
  },
  {
    _id: '62f7b9da6d2ca3f23005ad79',
    title: 'test1',
    description: 'description1',
    favorite: false
  }
]

describe ('BooksService', () => {
  let booksService: BooksService
  let model: Model<Books>

  beforeEach (async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Books.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn()
          }
        }
      ]
    }).compile()

    booksService = moduleRef.get<BooksService>(BooksService)
    model = moduleRef.get<Model<Books>>(getModelToken(Books.name))
  })

  it('should be defined', () => {
    expect(booksService).toBeDefined()
  })

  it ('findAll', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(booksArray)
    } as any)
    const res = await booksService.findAll()
    expect(res).toEqual(booksArray)
  })

  it ('create', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() => {
      return Promise.resolve(mockBook)
    })
    const res = await booksService.create(mockBook)
    expect(res).toEqual(mockBook)
  })

  it ('update', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook)
    } as any)
    const res = await booksService.update('62ed1ffc91e8eb901830b94d', {} as any)
    expect(res).toEqual(mockBook)
  })

  it ('delete', async () => {
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(true)
    } as any)
    const res = await booksService.delete('62ed1ffc91e8eb901830b94d')
    expect(res).toBeTruthy()
  })
})
