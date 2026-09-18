import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { CreateTagDto, TagDto, TagFilterDto, UpdateTagDto } from '../models/dtos/tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() newTag: CreateTagDto) {
    return this.tagService.createTag(newTag);
  }

  @Get()
  getTags(): Promise<TagDto[]> {
    return this.tagService.getTags();
  }

  @Post('filter')
  async filterTags(@Body() filter: TagFilterDto) {
    const tags = await this.tagService.filterTags(filter);
    return tags.map((tag) => new TagDto(tag));
  }

  @Get(':id')
  getTagById(@Param('id', ParseIntPipe) id: number): Promise<TagDto> {
    return this.tagService.getTagById(id);
  }

  @Put(':id')
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() tag: UpdateTagDto) {
    return this.tagService.updateTag(id, tag);
  }

  @Delete(':id')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }
}
