import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from 'src/entities/user.entity';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGINATION_LIMIT } from 'src/utils/constants';
import { VerificationCode } from 'src/entities/verification-code.entity';
import { EmailService } from 'src/email/email.service';
// import { randomInt } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userReporsitory: Repository<User>,
    @InjectRepository(VerificationCode)
    private codeRepository: Repository<VerificationCode>,
    private emailService: EmailService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.userReporsitory.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new NotFoundException('User with this email already exists');
    }

    const user = this.userReporsitory.create(dto);
    const savedUser = await this.userReporsitory.save(user);

    // const code = randomInt(100000, 999999).toString();
    // console.log(code, 'v-code');
    // const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    // console.log(expires, 'expires');

    // await this.codeRepository.save(
    //   this.codeRepository.create({
    //     user: savedUser,
    //     code,
    //     expiresAt: expires,
    //   }),
    // );
    // await this.emailService.sendVerificationEmail(savedUser.email, code);

    return {
      message: 'Signup successful',
      user: savedUser,
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userReporsitory.findOne({
      where: { email },
      relations: ['verificationCodes'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validCode = user.verificationCodes.find(
      (c) => c.code === code && c.expiresAt > new Date(),
    );

    if (!validCode) {
      throw new NotFoundException('Invalid or expired verification code');
    }

    user.is_email_verified = true;
    await this.userReporsitory.save(user);
    await this.codeRepository.delete(validCode.id);

    return { message: 'Email verified successfully' };
  }

  async getSingleUser(id: number) {
    const userInfo = await this.userReporsitory.findOne({
      where: {
        id,
      },
      select: ['id', 'role', 'hashed_refresh_token'],
    });
    if (!userInfo) {
      throw new NotFoundException();
    }
    return userInfo;
  }

  async getAllUsers(paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return await this.userReporsitory.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGINATION_LIMIT,
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    return await this.userReporsitory.update({ id }, dto);
  }

  async deleteUser(id: number) {
    return await this.userReporsitory.delete({ id });
  }

  async findUserByEmail(email: string) {
    return await this.userReporsitory.findOne({
      where: {
        email,
      },
    });
  }

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ) {
    return await this.userReporsitory.update(
      { id: userId },
      { hashed_refresh_token: hashedRefreshToken },
    );
  }
}
