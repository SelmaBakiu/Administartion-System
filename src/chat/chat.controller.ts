import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversation/:receiverId')
  async getConversation(
    @Request() req,
    @Param('receiverId') receiverId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('conversation');
    return await this.chatService.getConversation(
      req.user.id,
      receiverId,
      limit,
      page,
    );
  }

  @Get('unread')
  async getUnreadCount(@Request() req) {
    console.log('unread');
    return await this.chatService.getUnreadCount(req.user.id);
  }
}
