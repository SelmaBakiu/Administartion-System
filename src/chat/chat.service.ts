import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
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

  async createMessage(
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
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

  async getConversation(
    senderId: string,
    receiverId: string,
  ): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .select([
        'message.id',
        'message.content',
        'message.isRead',
        'message.createdAt',
        'sender.id',
        'receiver.id',
      ])
      .where(
        new Brackets((qb) => {
          qb.where(
            '(message.senderId = :senderId AND message.receiverId = :receiverId)',
          ).orWhere(
            '(message.senderId = :receiverId AND message.receiverId = :senderId)',
          );
        }),
      )
      .setParameters({ senderId, receiverId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['receiver'],
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
