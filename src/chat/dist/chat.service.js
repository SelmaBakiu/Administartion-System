"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var message_entiry_1 = require("src/common/entitys/message.entiry");
var ChatService = /** @class */ (function () {
    function ChatService(messageRepository, userService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
    }
    ChatService.prototype.createMessage = function (senderId, createMessageDto) {
        return __awaiter(this, void 0, Promise, function () {
            var content, receiverId, sender, receiver, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = createMessageDto.content, receiverId = createMessageDto.receiverId;
                        return [4 /*yield*/, this.userService.findOne(senderId)];
                    case 1:
                        sender = _a.sent();
                        return [4 /*yield*/, this.userService.findOne(receiverId)];
                    case 2:
                        receiver = _a.sent();
                        if (!receiver) {
                            throw new common_1.NotFoundException('Receiver not found');
                        }
                        message = this.messageRepository.create({
                            content: content,
                            sender: sender,
                            receiver: receiver,
                            isRead: false
                        });
                        return [4 /*yield*/, this.messageRepository.save(message)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatService.prototype.getConversation = function (senderId, receiverId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageRepository
                            .createQueryBuilder('message')
                            .leftJoin('message.sender', 'sender')
                            .leftJoin('message.receiver', 'receiver')
                            .select([
                            'message.id',
                            'message.content',
                            'message.isRead',
                            'message.createdAt',
                            'sender.id',
                            'receiver.id'
                        ])
                            .where(new typeorm_2.Brackets(function (qb) {
                            qb.where('(message.senderId = :senderId AND message.receiverId = :receiverId)')
                                .orWhere('(message.senderId = :receiverId AND message.receiverId = :senderId)');
                        }))
                            .setParameters({ senderId: senderId, receiverId: receiverId })
                            .orderBy('message.createdAt', 'DESC')
                            .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatService.prototype.markMessageAsRead = function (messageId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageRepository.findOne({
                            where: { id: messageId },
                            relations: ['receiver']
                        })];
                    case 1:
                        message = _a.sent();
                        if (!message) {
                            throw new common_1.NotFoundException('Message not found');
                        }
                        if (message.receiver.id !== userId) {
                            throw new common_1.ForbiddenException('Cannot mark this message as read');
                        }
                        message.isRead = true;
                        return [4 /*yield*/, this.messageRepository.save(message)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatService.prototype.getUnreadCount = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageRepository.count({
                            where: {
                                receiver: { id: userId },
                                isRead: false
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(message_entiry_1.Message))
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
