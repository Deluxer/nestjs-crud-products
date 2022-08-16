import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail } from "class-validator";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty({
        example: '639bc918-63df-46ce-832d-3bb74acb8d9c',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'test@test.com',
        description: 'Email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    @IsEmail()
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        example: 'Gerardo Del Angel',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        default: true
    })
    @Column('bool', {
        default: true
    })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        default: ['user', 'admin', 'super']
    })
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert()
    }
}
