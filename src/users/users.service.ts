import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dtos';

@Injectable()
export class UsersService {
  private users = [
    { email: 'jane@mail.com' },
    { email: 'jane@mail.com' },
    { email: 'jane@mail.com' },
    { email: 'jane@mail.com' },
  ];

  async createUser(payload: CreateUserDto) {
    const { email } = payload;
    const exitsUser = this.users.find((user) => user.email == email);
    if (!exitsUser)
      return {
        id: 1,
        name: 'john',
        email: 'john@mail.com',
        password: 'password',
        status: 'success',
      };

    throw new ConflictException('User already taken!!');
  }
}
