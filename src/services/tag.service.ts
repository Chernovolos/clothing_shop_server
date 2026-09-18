import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../models/entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto, TagDto, TagFilterDto, UpdateTagDto } from '../models/dtos/tag.dto';
import { ProductType } from '../enums/product.enums';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(newTag: CreateTagDto): Promise<TagDto> {
    const tag = this.tagRepository.create({
      title: newTag.title,
    });

    const saved = await this.tagRepository.save(tag);
    return new TagDto(saved);
  }

  async getTags(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find();
    return tags.map((tag) => new TagDto(tag));
  }

  async filterTags(filter: TagFilterDto): Promise<TagDto[]> {
    let sqlString = `
      SELECT DISTINCT t.id, t.title
      FROM products p
      JOIN product_tags pt ON pt.product_id = p.id
      JOIN tags t ON t.id = pt.tag_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filter.categoryType) {
      params.push(filter.categoryType);
      sqlString += ` AND p.category_type = $${params.length} `;
    }

    if (filter.type) {
      params.push(filter.type);
      sqlString += ` AND p.type = $${params.length} `;
    }

    if (filter.subType && filter.subType.length > 0) {
      if (filter.subType.length == 1) {
        sqlString += ` AND p.sub_type = $${params.length + 1} `;
      } else {
        const subTypeParamsStr = filter.subType.map((_, i) => `$${params.length + i + 1}`).join(', ');
        sqlString += ` AND p.sub_type IN (${subTypeParamsStr}) `;
      }
      params.push(...filter.subType);
    }

    if (filter.colors && filter.colors.length > 0) {
      const colorsCondition =
        filter.colors.length == 1
          ? `st.color_id = $${params.length + 1}`
          : `st.color_id IN (${filter.colors.map((_, i) => `$${params.length + i + 1}`).join(', ')})`;

      sqlString += ` AND EXISTS (                                                                                                                                                   
                      SELECT 1 FROM stock st                                                                                                                                                      
                      WHERE st.product_id = p.id                                                                                                                                                  
                      AND ${colorsCondition}                                                                                                                                                      
                      AND st.available > 0                                                                                                                                                        
                    ) `;
      params.push(...filter.colors);
    }

    if (filter.sizes && filter.sizes.length > 0) {
      const sizesCondition =
        filter.sizes.length == 1
          ? `st.product_size = $${params.length + 1}`
          : `st.product_size IN (${filter.sizes.map((_, i) => `$${params.length + i + 1}`).join(', ')})`;

      sqlString += ` AND EXISTS (                                                                                                                                                   
                      SELECT 1 FROM stock st                                                                                                                                                      
                      WHERE st.product_id = p.id                                                                                                                                                  
                      AND ${sizesCondition}                                                                                                                                                      
                      AND st.available > 0                                                                                                                                                        
                    ) `;
      params.push(...filter.sizes);
    }

    if (filter.minPrice !== undefined && filter.minPrice !== null && !isNaN(filter.minPrice)) {
      params.push(filter.minPrice);
      sqlString += ` AND p.price >= $${params.length} `;
    }

    if (filter.maxPrice !== undefined && filter.maxPrice !== null && !isNaN(filter.maxPrice)) {
      params.push(filter.maxPrice);
      sqlString += ` AND p.price <= $${params.length} `;
    }

    return await this.tagRepository.query<TagDto[]>(sqlString, params);
  }

  async getTagById(id: number): Promise<TagDto> {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return new TagDto(tag);
  }

  async getTagsByIds(ids: number[]): Promise<Tag[]> {
    return this.tagRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async updateTag(id: number, tag: UpdateTagDto): Promise<TagDto> {
    const isExistTag = await this.checkTag(id);
    const updatedTagData = this.tagRepository.merge(isExistTag, tag);
    const updatedTag = await this.tagRepository.save(updatedTagData);

    return new TagDto(updatedTag);
  }

  async deleteTag(id: number): Promise<{ message: string }> {
    const result = await this.tagRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Tag with ID ${id} is not found`);
    }

    return {
      message: `Tag with ID ${id} was successfully deleted`,
    };
  }

  private async checkTag(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} is not found`);
    }

    return tag;
  }
}
