import {Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards,Request, UseInterceptors, Query} from '@nestjs/common';
import {PostsService} from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entites/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginatePostDto } from './dto/paginate-post.dto';


/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount: string;
 * commentCount : string;
 */


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {
    }

    // 1) GET /posts
    // 모든 post를 가져온다.
    @Get()
    getPosts(
        @Query() query: paginatePostDto
    ) {
        // return this.postsService.getAllPosts();
        return this.postsService.paginatePosts(query);
    };

    // Post /posts/random
    @Post('random')
    @UseGuards(AccessTokenGuard)
    async postPostRandom(@User() user:UsersModel) {
        await this.postsService.generatePosts(user.id);

        return true

    }

    // 2) GET /posts/:id
    // id에 해당하는 post를 가져온다.
    @Get(':id')
    getPost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.getPostById(id);
    };

    //3) POST /posts
    // post생성한다.(id는 가드에서 받는다.)

    // DTO - Data Transfer Object
    @Post()
    @UseGuards(AccessTokenGuard)
    postPost(
        @User('id') userId : number,
        @Body() body : CreatePostDto,
        // @Body('title') title: string,
        // @Body('content') content: string,
    ) {        
        return this.postsService.createPost(userId, body);
    };

    //4) PATCh /posts/:id
    // id에 해당하는 post를 변경한다.
    @Patch(':id')
    patchPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() body : UpdatePostDto,
        // @Body('title') title?: string,
        // @Body('content') content?: string
    ) {
        return this.postsService.updatePost(id,body);
    }

    //5) DELETE /posts/:id
    // id에 해당하는 post를 삭제한다.
    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number) {
       return this.postsService.deletePost(id);
    }
}
