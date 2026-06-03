import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../models/entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto, TagDto, UpdateTagDto } from '../models/dtos/tag.dto';

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
