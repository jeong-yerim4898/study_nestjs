import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class paginatePostDto {
    // 이전 마지막 데이터의 ID
    // 이 프로퍼티에 입력된 ID 보다 높은 ID 부터 값을 가져오기
    // 쿼리로 들어오기 때문에 숫자를 넣어도 string 타입이다. 그래서 Type으로 number로 변환해야한다.
    // @Type(()=> Number)
    @IsNumber()
    @IsOptional()
    where__id_more_than? : number;

    // 10 9 8 7
    @IsNumber()
    @IsOptional()
    where__id_less_than? : number;

    // 정렬
    // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt?: 'ASC' | 'DESC' = 'ASC';

    // 몇개의 데이터를 응답으로 받을지
    @IsNumber()
    @IsOptional()
    take : number = 20;
}