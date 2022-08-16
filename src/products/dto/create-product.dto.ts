import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'price (unique)',
        nullable: true,
        minLength: 1
    })
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Description (unique)',
        nullable: true,
        minLength: 1
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Slug (unique)',
        nullable: true,
        minLength: 1
    })
    @IsOptional()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Stock',
        nullable: true,
        minLength: 1
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'sizes',
        nullable: false,
        minLength: 1
    })
    @IsString({ each: true})
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Gender (unique)',
        nullable: false,
        minLength: 1
    })
    @IsIn(['men','women','kids','unisex'])
    gender: string;

    @ApiProperty({
        description: 'Tags (unique)',
        nullable: true,
        minLength: 1
    })
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
