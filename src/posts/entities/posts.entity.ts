import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entites/users.entity";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { IsString } from "class-validator";


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
        message: "title은 string 타입을 입력 해주어야합니다."
    })
    title: string;

    @Column()
    @IsString({
        message: "content는 string 타입을 입력 해주어야합니다."
    })
    content: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;

}