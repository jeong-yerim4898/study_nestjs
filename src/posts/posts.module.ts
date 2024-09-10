import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsModel} from "./entities/posts.entity";
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
      // 모델에 해당하는 repository를 주입할때 사용
      TypeOrmModule.forFeature([
          PostsModel
      ]),AuthModule,UsersModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
