import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation-message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude } from "class-transformer";

@Entity()
export class UsersModel extends BaseModel{

    @Column({
        // 1.
        length : 20,
        // 2.
        unique : true
    })
    
    @IsString({
        message : stringValidationMessage
    })
    @Length(1, 20, {
        message : lengthValidationMessage
    })
    // 1. 길이가 20을 넘지 않을 것
    // 2. 유일무이한 값이 될 것
    nickname : string;

    @Column({
        unique : true
    })

    @IsString({
        message : stringValidationMessage
    })
    @IsEmail({}, {
        message : emailValidationMessage
    })
    // 1. 유일무이한 값이 될 것
    email : string;

    @Column()
    @IsString({
        message : stringValidationMessage
    })
    @Length(3,8,{
        message : lengthValidationMessage
    })
    @Exclude()
    password: string;

    @Column({
        enum: Object.values(RolesEnum),
        default : RolesEnum.USER
    })
    role : RolesEnum;
    
    @OneToMany(() => PostsModel,(post) => post.author)
    posts : PostModel[];


}