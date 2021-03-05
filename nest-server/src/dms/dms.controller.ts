import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DmsService } from './dms.service';

@ApiTags('Direct Message')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DmsService) {}

  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 아이디',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가져올 갯수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query);
    console.log(param);
  }

  @Post(':id/chats')
  postChat(@Body() body) {
    console.log(body);
  }
}
