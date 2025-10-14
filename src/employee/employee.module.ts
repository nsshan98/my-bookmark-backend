import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), CloudinaryModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, CloudinaryService],
})
export class EmployeeModule {}
