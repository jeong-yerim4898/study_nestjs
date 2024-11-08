import {Injectable, NotFoundException} from '@nestjs/common';
import {In, MoreThan, Repository} from "typeorm";
import {PostsModel} from "./entities/posts.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { UsersModel } from 'src/users/entites/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from 'src/common/env.const';

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

    async generatePosts(userId : number) {
        for (let i = 0; i<100; i++) {
            await this.createPost(userId, {
                title : `임의로 생서된 포스트 제목${i}`,
                content : `임의로 생성된 포스트 내용${i}`
            });
        }
    }
    // 1) 오름차순으로 정렬하는 pagination만 구현한다.
    async paginatePosts(dto : paginatePostDto) {
        // 1,2,3,4,5 
        const posts  = await this.postsRepository.find({
            where : {
                // 더 크다 / 더 많다
                id : MoreThan(dto.where__id_more_than ?? 0)
            },
            // order __createdAt
            order : {
                createdAt : dto.order__createdAt
            },
            take : dto.take
        });
        // 해당되는 포스트가 0개 이상이면
        // 마지막 포스트를 가져오고
        // 아니면 null을 반환한다.
        const lastItem = posts.length > 0 && posts.length === dto.take ? posts[posts.length -1] : null;

        const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

        if (nextUrl) {
            /**
             * dto의 키 값들을 루팡하면서
             * 키 값에 해당되는 벨류가 존재한다면 
             * parma에 그대로 붙여넣는다.
             * 
             * 단 , where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
             */
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== "where__id_more_than") {
                        nextUrl.searchParams.append(key,dto[key]);
                    } 
                }
            }
            nextUrl.searchParams.append("where__id_more_than", lastItem.id.toString());
        }
        
        /**
         * Reponse
         * 
         * data : Data[],
         * cursor : {
         *     after : 마지막 Data의 ID
         * },
         * count : 응답한 데이터의 갯수
         * next : 다음 요청을 할때 사용할 URL
         */

        return {
            data : posts,
            cursor : {
                after : lastItem?.id??null
            },
            count : posts.length,
            next : nextUrl?.toString()
        }
    }

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

    async createPost(authorId : number, postDto : CreatePostDto) {
        // 1) create -> 저장할 객체를 생성한다.
        // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

        const post = this.postsRepository.create({
            author : { 
                id : authorId,
            },
            ...postDto,
            likeCount: 0,
            commentCount: 0
        });

        const newPost = await this.postsRepository.save(post);

        return newPost;
    };

    async updatePost(postId: number, postDto : UpdatePostDto) {
        const {title, content} = postDto;
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
