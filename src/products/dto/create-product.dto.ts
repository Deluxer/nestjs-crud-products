import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true})
    @IsArray()
    sizes: string[];

    @IsIn(['men','women','kids','unisex'])
    gender: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString({each: true})
    @IsOptional()
    images: string[]

    // constructor(
    //     title: string,
    //     price?: number,
    //     description?: string,
    //     slug?: string,
    //     stock?: number,
    //     sizes?: string[],
    //     gender?: string,
    //     tags?: string[],
    //     images?: string[]
    // ) {
    // }

}
