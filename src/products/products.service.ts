import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as uuid } from 'uuid';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly  productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    
    try{
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    }catch(error){
      this.handleDbException(error);
    }
  }

  //TODO: Pagination
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: realciones
    });
    return products;
  }
  
  async findOne(term: string) {
    let product: Product;

    if(isUUID(term))
      product = await this.productRepository.findOneBy({id: term});
    else {
      // product = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
      .where('title like title or slug =:slug',{
        title: term,
        slug: term,
      })
      .getOne();
    }
    
    if(!product) throw new NotFoundException(`Product with term ${ term } not found`)

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });
    
    try{
      if(!product) throw new NotFoundException(`roduct with term ${ id } not found`);
      await this.productRepository.save(product);
      return product;

    }catch(error) {
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
}
