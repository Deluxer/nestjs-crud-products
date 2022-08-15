import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateContextOptions } from 'vm';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    
    const { password, ...userData } = createUserDto;
    
    try{
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      
      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    }catch(error){
      this.handleError(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user =  await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true}
    });

    if(!user)
      throw new UnauthorizedException('Not valid credentials');

    if(!bcrypt.compareSync(password, user.password))
    throw new UnauthorizedException('Not valid credentials');
    
    const token = this.getJwtToken({id: user.id});
    delete user.id;
    
    return {
      ...user,
      token
    };

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleError(error: any): void {
    if(error.code === '23505') throw new BadRequestException(error.detail)
  }
}
