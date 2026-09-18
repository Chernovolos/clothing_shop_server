import { Injectable, NotFoundException } from '@nestjs/common';
import { Stock } from '../models/entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockDto } from '../models/dtos/stock.dto';
import { ProductFilterDto } from '../models/dtos/product.dto';
import { ProductSize } from '../enums/product.enums';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async getStockById(id: number): Promise<StockDto> {
    const stock = await this.stockRepository.findOne({
      where: {
        id,
      },
      relations: {
        color: true,
      },
    });
    if (!stock) {
      throw new NotFoundException('stock not found');
    }

    return new StockDto(stock);
  }

  async filterSizeProducts(filter: ProductFilterDto): Promise<ProductSize[]> {
    const query = this.stockRepository
      .createQueryBuilder('s')
      .select('DISTINCT s.productSize', 'size')
      .innerJoin('s.product', 'p')
      .where('s.available > 0');

    if (filter.categoryType) {
      query.andWhere('p.category_type = :categoryType', { categoryType: filter.categoryType });
    }

    if (filter.type !== undefined) {
      query.andWhere('p.type = :type', {
        type: filter.type,
      });
    }

    if (filter.subType?.length) {
      query.andWhere('p.subType IN (:...subType)', {
        subType: filter.subType,
      });
    }

    if (filter.colors && filter.colors.length > 0) {
      query.andWhere((subQb) => {
        const subQuery = subQb
          .subQuery()
          .select('1')
          .from('stock', 'st')
          .where('st.product_id = p.id')
          .andWhere('st.color_id IN (:...colors)', { colors: filter.colors })
          .andWhere('st.available > 0')
          .getQuery();

        return `EXISTS ${subQuery}`;
      });
    }

    if (filter.tags && filter.tags.length > 0) {
      query.andWhere((subQb) => {
        const subQuery = subQb
          .subQuery()
          .select('1')
          .from('product_tags', 'pt')
          .where('pt.product_id = p.id')
          .andWhere('pt.tag_id IN (:...tags)', { tags: filter.tags })
          .groupBy('pt.product_id')
          .having('COUNT(DISTINCT pt.tag_id) = :tagCount', {
            tagCount: filter.tags?.length,
          })
          .getQuery();

        return `EXISTS ${subQuery}`;
      });
    }

    if (filter.minPrice !== undefined && filter.minPrice !== null && !isNaN(filter.minPrice)) {
      query.andWhere('p.price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice !== undefined && filter.maxPrice !== null && !isNaN(filter.maxPrice)) {
      query.andWhere('p.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    const result = await query.getRawMany<{ size: ProductSize }>();

    return result.map((item) => item.size);
  }
}
