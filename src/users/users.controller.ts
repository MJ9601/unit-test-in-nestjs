import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dtos/user.dtos';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  @Post()
  async createUserHandler(@Body() payload: CreateUserDto) {
    try {
      return await this.userService.createUser(payload);
    } catch (error: any) {
      console.error('');
      return error;
    }
  }

  @Get()
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const { count, page } = req.query;

    if (!count || !page) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  }

  @Get('user')
  async getUser(@Req() req: Request, @Res() res: Response) {
    const { count, page } = req.query;

    if (!count || !page) {
      return res.status(400).send({ msg: 'Not Found!' });
    } else {
      return res.sendStatus(200);
    }
  }
}
