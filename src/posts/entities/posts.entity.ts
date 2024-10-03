import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entites/users.entity";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation-message";


@Entity()
export class PostsModel extends BaseModel{

    // 1. UsersModel과 연동한다. Foreign Key를 이용해서
    // 2. null이 될 수 없다.
    @ManyToOne(() => UsersModel, (user) => user.posts,  {
        nullable : false
    })
    author: UsersModel;

    @Column()
    @IsString({
        message : stringValidationMessage
    })
    title: string;

    @Column()
    @IsString({
        message : stringValidationMessage
    })
    content: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;

}