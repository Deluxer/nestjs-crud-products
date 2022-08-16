import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'product_images'})
export class ProductImage {

    @ApiProperty({
        example: '639bc918-63df-46ce-832d-3bb74acb8d9c',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: ['1741111-00-A_0_2000.jpg', '1741111-00-A_1.jpg'],
    })
    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: "CASCADE"}
    )
    product: Product;
}