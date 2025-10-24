import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Public } from 'src/auth/decorators/public.decorators';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('signup')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto.email, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUserById(@Req() req) {
    return this.userService.getSingleUser(req.user.id as number);
  }

  @Get()
  getAllUsers(@Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return this.userService.getAllUsers(paginationDto);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id as number, dto);
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id) {
    await this.userService.deleteUser(id as number);

    return {
      message: 'User Deleted',
    };
  }
}
