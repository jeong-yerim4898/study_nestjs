import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { UsersModel } from "../entites/users.entity";

export const User = createParamDecorator((data : keyof UsersModel | undefined, context : ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    
    if (!user) {
        // 클라가 아니라 서버에서 에러다. 알려주기
        throw new InternalServerErrorException("User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다. Request에 user 프로퍼티가 존재하지 않습니다!");
    }

    if (data) {
        return user[data];
    }

    return user;
});