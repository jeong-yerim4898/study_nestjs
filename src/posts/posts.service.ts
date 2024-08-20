import {Injectable, NotFoundException} from '@nestjs/common';
import {In, Repository} from "typeorm";
import {PostsModel} from "./entities/posts.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { UsersModel } from 'src/users/entites/users.entity';

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
}

let posts: PostModel[] = [
    {
        id: 1,
        author: "newjeans_offical",
        title: "뉴진스 민지",
        content: "메이크업을 고치고 있는 민지",
        likeCount: 897564,
        commentCount: 48785
    }, {
        id: 2,
        author: "newjeans_offical",
        title: "뉴진스 해린",
        content: "노래를 고치고 있는 해린",
        likeCount: 245674,
        commentCount: 8813274
    }, {
        id: 3,
        author: "newjeans_offical",
        title: "뉴진스 혜인",
        content: "춤을 고치고 있는 혜인",
        likeCount: 1789751,
        commentCount: 3247895
    },
];

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>
    ) {
    }

    async getAllPosts() {
        return this.postsRepository.find({
            relations :['author']
        });
    };

    async getPostById(id: number) {
        const post = await this.postsRepository.findOne({
            where: {id},
            relations :['author']
        });

        if (!post) {
            throw new NotFoundException();
        }

        return post;
    };

    async createPost(authorId : number, title: string, content: string) {
        // 1) create -> 저장할 객체를 생성한다.
        // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

        const post = this.postsRepository.create({
            author : { 
                id : authorId,
            },
            title,
            content,
            likeCount: 0,
            commentCount: 0
        });

        const newPost = await this.postsRepository.save(post);

        return newPost;
    };

    async updatePost(postId: number, title: string, content: string) {
        // save의 기능
        // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
        // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

        const post = await this.postsRepository.findOne({
            where: {id: postId}
        });

        if (!post) {
            throw new NotFoundException();
        }

        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }
        const newPost = await this.postsRepository.save(post);

        return newPost;
    };

    async deletePost(postId: number) {

        const post = await this.postsRepository.findOne({
            where: {id: postId}
        })

        if (!post) {
            throw new NotFoundException();
        }

        await this.postsRepository.delete(postId);

        return postId;
    }
}
