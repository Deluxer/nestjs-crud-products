import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '639bc918-63df-46ce-832d-3bb74acb8d9c',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
    })
    @Column('text', {
        unique: true
    })
    title: string;
    
    @ApiProperty({
        example: 10,
        description: 'Product title',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'product Description etc...',
        description: 'Product title',
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug',
        uniqueItems: true

    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;


    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product size',
        default: 0
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: ['men','women','kids','unisex'],
        description: 'gender',
        default: 0
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'tags',
    })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if(!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
}
