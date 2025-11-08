import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/db.config';
import { EmployeeModule } from './employee/employee.module';
import { UrlModule } from './url/url.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CategoryModule } from './category/category.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      max: 100, // maximum number of items in cache
      ttl: 0, // time to live in seconds
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig],
    }),
    UserModule,
    BookmarkModule,
    CategoryModule,
    EmployeeModule,
    UrlModule,
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
