import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from 'src/common/entitys/message.entiry';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  async createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, receiverId } = createMessageDto;

    const sender = await this.userService.findOne(senderId);
    const receiver = await this.userService.findOne(receiverId);

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const message = this.messageRepository.create({
      content,
      sender,
      receiver,
      isRead: false,
    });

    return await this.messageRepository.save(message);
  }

  async getConversation(senderId: string, receiverId:string,limit:number,page:number): Promise<Message[]> {

    return await this.messageRepository
      .createQueryBuilder('message')
      .where(
        '(message.sender_id = :userId AND message.receiver_id = :otherUserId) OR ' +
        '(message.sender_id = :otherUserId AND message.receiver_id = :userId)',
        { senderId, receiverId }
      )
      .orderBy('message.createdAt', 'DESC')
      .skip(page)
      .take(limit)
      .getMany();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['receiver'] 
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiver.id !== userId) {
      throw new ForbiddenException('Cannot mark this message as read');
    }

    message.isRead = true;
    return await this.messageRepository.save(message);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.messageRepository.count({
      where: {
        receiver: { id: userId },
        isRead: false,
      },
    });
  }
}