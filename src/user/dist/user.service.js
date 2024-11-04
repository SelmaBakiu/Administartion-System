"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("src/common/entitys/user.entity");
var generatePassword_1 = require("src/common/utils/generatePassword");
var bcrypt = require("bcrypt");
var UserService = /** @class */ (function () {
    function UserService(userRepository, firebaseService, mailService) {
        this.userRepository = userRepository;
        this.firebaseService = firebaseService;
        this.mailService = mailService;
    }
    UserService.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, Promise, function () {
            var existingUser, password, salt, hashedPassword, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: userData.email, isDeleted: false }
                            })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new common_1.ConflictException('User with this email already exists');
                        }
                        password = generatePassword_1.generatePassword();
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 2:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(password, salt)];
                    case 3:
                        hashedPassword = _a.sent();
                        user = this.userRepository.create(__assign(__assign({}, userData), { department: userData.departmentId
                                ? { id: userData.departmentId }
                                : undefined, password: hashedPassword }));
                        return [4 /*yield*/, this.mailService.sendMail({
                                to: user.email,
                                subject: 'Welcome to the app',
                                context: "Your password is " + password + ". Please change your password after login."
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        error_1 = _a.sent();
                        console.log(error_1);
                        throw new common_1.InternalServerErrorException('Failed to create user');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, Promise, function () {
            var existingUser, emailExists, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: id, isDeleted: false }
                        })];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        if (!(userData.email && userData.email !== existingUser.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: userData.email, isDeleted: false }
                            })];
                    case 2:
                        emailExists = _a.sent();
                        if (emailExists) {
                            throw new common_1.ConflictException('Email already in use');
                        }
                        _a.label = 3;
                    case 3:
                        updateData = __assign(__assign({}, userData), { department: userData.departmentId
                                ? { id: userData.departmentId }
                                : undefined });
                        console.log(updateData);
                        return [4 /*yield*/, this.userRepository.update(id, updateData)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: id, isDeleted: false },
                            relations: ['department']
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserService.prototype.getUserForChat = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.find({
                            where: { isDeleted: false },
                            select: ['id', 'firstName', 'lastName', 'profileImageUrl'],
                            order: { firstName: 'ASC', lastName: 'ASC' }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.getAllUsersByDepartmentId = function (page, limit, firstName, lastName, departmentId) {
        if (page === void 0) { page = 0; }
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, Promise, function () {
            var queryBuilder, _a, data, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queryBuilder = this.userRepository
                            .createQueryBuilder('user')
                            .leftJoinAndSelect('user.department', 'department')
                            .where('user.isDeleted = :isDeleted', { isDeleted: false });
                        if (firstName) {
                            queryBuilder.andWhere('LOWER(user.firstName) LIKE LOWER(:firstName)', {
                                firstName: "%" + firstName + "%"
                            });
                        }
                        if (lastName) {
                            queryBuilder.andWhere('LOWER(user.lastName) LIKE LOWER(:lastName)', {
                                lastName: "%" + lastName + "%"
                            });
                        }
                        if (departmentId) {
                            queryBuilder.andWhere('department.id = :departmentId', { departmentId: departmentId });
                        }
                        return [4 /*yield*/, queryBuilder
                                .orderBy('user.firstName', 'ASC')
                                .addOrderBy('user.lastName', 'ASC')
                                .take(limit)
                                .skip(page * limit)
                                .getManyAndCount()];
                    case 1:
                        _a = _b.sent(), data = _a[0], total = _a[1];
                        return [2 /*return*/, { data: data, all: total, page: page }];
                }
            });
        });
    };
    UserService.prototype.findUserByDepartmentId = function (departmentId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.find({
                            where: {
                                department: { id: departmentId },
                                isDeleted: false
                            },
                            relations: ['department']
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: id, isDeleted: false }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [4 /*yield*/, this.userRepository.update(id, { isDeleted: true })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.uploadImage = function (file, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var user, profileImageUrl, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: userId, isDeleted: false }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.firebaseService.uploadFile(file, 'profileImages', 'square')];
                    case 3:
                        profileImageUrl = _a.sent();
                        return [4 /*yield*/, this.userRepository.update(userId, { profileImageUrl: profileImageUrl })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, profileImageUrl];
                    case 5:
                        error_2 = _a.sent();
                        throw new common_1.InternalServerErrorException('Failed to upload image');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.changePassword = function (id, resetPasswordDto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, salt, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: id, isDeleted: false }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 2:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt.compare(resetPasswordDto.oldPassword, user.password)];
                    case 3:
                        if (!(_a.sent()).valueOf()) {
                            throw new common_1.BadRequestException('Old passsword is not current');
                        }
                        return [4 /*yield*/, bcrypt.hash(resetPasswordDto.newPassword, salt)];
                    case 4:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.userRepository.update(id, { password: hashedPassword })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
