import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PostsModule} from './posts/posts.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsModel} from "./posts/entities/posts.entity";
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entites/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [
        PostsModule,
        TypeOrmModule.forRoot({
            // 데이터베이스 타입
            type : 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            entities : [
                PostsModel,
                UsersModel
            ],
            // 자동싱크 맞추기(local: true, prod: false)
            synchronize: true
        }),
        UsersModule,
        AuthModule,
        CommonModule
    ],
    controllers: [AppController],
    providers: [AppService, {
        provide : APP_INTERCEPTOR,
        useClass : ClassSerializerInterceptor
    }],
})
export class AppModule {
}
