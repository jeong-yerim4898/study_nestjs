import {Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {PostsService} from './posts.service';


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
    getPosts() {
        return this.postsService.getAllPosts();
    };

    // 2) GET /posts/:id
    // id에 해당하는 post를 가져온다.
    @Get(':id')
    getPost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.getPostById(id);
    };

    //3) POST /posts
    // post생성한다.
    @Post()
    postPost(
        @Body('authorId') authorId: number,
        @Body('title') title: string,
        @Body('content') content: string,
    ) {
        return this.postsService.createPost(authorId, title, content);
    };

    //4) PATCh /posts/:id
    // id에 해당하는 post를 변경한다.
    @Patch(':id')
    patchPost(
        @Param('id', ParseIntPipe) id: number,
        @Body('title') title?: string,
        @Body('content') content?: string) {
        return this.postsService.updatePost(id,  title, content);
    }

    //5) DELETE /posts/:id
    // id에 해당하는 post를 삭제한다.\
    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number) {
       return this.postsService.deletePost(id);
    }


}
