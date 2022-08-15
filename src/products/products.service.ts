import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly  productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try{
      const { images = [], ...productDetail } = createProductDto;
      const product = this.productRepository.create({
        ...productDetail,
        images: images.map( image => this.productImageRepository.create({url: image})),
        user
      });
      await this.productRepository.save(product);

      return {...product, images};

    }catch(error){
      this.handleDbException(error);
    }
  }

  //TODO: Pagination
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map( ({images, ...rest}) => ({
      ...rest,
      images: images.map(image => image.url)
    }));
  }
  
  async findOne(term: string) {
    let product: Product;

    if(isUUID(term))
      product = await this.productRepository.findOneBy({id: term});
    else {
      // product = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      .where('title like title or slug =:slug',{
        title: term,
        slug: term,
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }
    
    if(!product) throw new NotFoundException(`Product with term ${ term } not found`)

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...restUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...restUpdate,
    });
    
    if(!product) throw new NotFoundException(`Product with term ${ id } not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    try{

      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id }})
        product.images = images.map(
          image => this.productImageRepository.create({url: image}
        ));
      } else {

      }
      product.user = user;
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return await this.findOnePlain(id);

    }catch(error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDbException(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    if(error.code === '23502')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Expected error, check server logs');
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try{
      
      return await query
                  .delete()
                  .where({})
                  .execute();

    }catch(error) {
      this.handleDbException(error);

    }
  }
}
