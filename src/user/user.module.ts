import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { VerificationCode } from 'src/entities/verification-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerificationCode])],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
