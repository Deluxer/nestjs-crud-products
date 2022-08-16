import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Auth, GetUser, RowHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { CreateUserDto, LoginUserDto } from './dto';
import { ValidRoles } from './types/enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({status: 201, description: 'User registered successfully', type: User})
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @UseGuards(AuthGuard())
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  // @UseGuards(AuthGuard())P
  PrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RowHeaders() rowHeaders: string[]
  ){
    return {
      ok: true,
      msg: 'Hola Mundo',
      user,
      userEmail,
      rowHeaders
    }
  }
  
  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  PrivateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  PrivateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
  
}


