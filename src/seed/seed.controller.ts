import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValidRoles } from '../auth/types/enum';
import { Auth } from '../auth/decorators';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed()
  }

}
