import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';

@ApiTags('Channel')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  getAllChannels() {}

  @Post()
  createChannel() {}

  @Get('name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {}

  @Post(':name/chats')
  postChat(@Body() body) {
    console.log(body);
  }

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMember() {}
}
