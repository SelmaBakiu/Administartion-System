import {
  Controller,
  Get,
  Param,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversation/:senderId/:receiverId')
  async getConversation(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    console.log('conversation');
    return await this.chatService.getConversation(
      senderId,
      receiverId
    );
  }

  @Get('unread')
  async getUnreadCount(@Request() req) {
    return await this.chatService.getUnreadCount(req);
  }
}
