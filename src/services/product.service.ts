import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../models/entities/product.entity';
import { CreateProductDto, ProductFilterDto, ProductDetailsDto, ProductDto } from '../models/dtos/product.dto';
import { TagService } from './tag.service';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly tagService: TagService,
  ) {}

  async addProduct(newProduct: CreateProductDto): Promise<ProductDetailsDto> {
    const tags = await this.tagService.getTagsByIds(newProduct.tags);

    if (tags.length !== newProduct.tags.length) {
      throw new BadRequestException('Some tags do not exist');
    }

    const product = this.productRepository.create({
      title: newProduct.title,
      categoryType: newProduct.categoryType,
      description: newProduct.description,
      price: newProduct.price,
      type: newProduct.type,
      subType: newProduct.subType,
      tags: tags,
    });

    const saved = await this.productRepository.save(product);

    return new ProductDetailsDto(saved);
  }

  async getProducts(): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      order: { id: { direction: 'ASC' } },
    });

    return products.map((product) => new ProductDto(product));
  }

  async getProductById(id: number): Promise<ProductDetailsDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        images: true,
        stocks: true,
        tags: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return new ProductDetailsDto(product);
  }

  async filterProducts(filter: ProductFilterDto) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.tags', 'tag')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('image.color', 'color')
      .leftJoinAndSelect('product.stocks', 'stocks')
      .leftJoinAndSelect('stocks.color', 'stockColor')
      .where('1=1');

    if (filter.categoryType !== undefined) {
      qb.andWhere('product.categoryType = :categoryType', {
        categoryType: filter.categoryType,
      });
    }

    if (filter.type?.length) {
      qb.andWhere('product.type IN (:...type)', {
        type: filter.type,
      });
    }

    if (filter.subType?.length) {
      qb.andWhere('product.subType IN (:...subType)', {
        subType: filter.subType,
      });
    }

    if (filter.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', {
        minPrice: filter.minPrice,
      });
    }

    if (filter.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', {
        maxPrice: filter.maxPrice,
      });
    }

    if (filter.tags && filter.tags.length > 0) {
      qb.andWhere((subQb) => {
        const subQuery = subQb
          .subQuery()
          .select('1')
          .from('product_tags', 'product_tag')
          .where('product_tag.product_id = product.id')
          .andWhere('product_tag.tag_id IN (:...tags)', { tags: filter.tags })
          .groupBy('product_tag.product_id')
          .having('COUNT(DISTINCT product_tag.tag_id) = :tagCount', {
            tagCount: filter.tags?.length,
          })
          .getQuery();

        return `EXISTS ${subQuery}`;
      });
    }

    this.logger.log('FILTER', filter);
    return qb.getMany();
  }

  async getProductsByIds(ids: number[]): Promise<ProductDetailsDto[]> {
    if (ids.length === 0) {
      return [];
    }

    const result = await this.productRepository.findBy({
      id: In(ids),
    });

    if (result.length === 0) {
      throw new NotFoundException(`Product  not found`);
    }

    return result.map((product) => new ProductDetailsDto(product));
  }
}
