import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../auth/auth.module'
import { Users, UsersSchema } from './schemas/users.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{
      name: Users.name,
      schema: UsersSchema
    }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {  }
