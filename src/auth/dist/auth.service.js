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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var user_entity_1 = require("src/common/entitys/user.entity");
var generatePassword_1 = require("src/common/utils/generatePassword");
var AuthService = /** @class */ (function () {
    function AuthService(userRepository, jwtService, userService, mailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.userService = userService;
        this.mailService = mailService;
    }
    AuthService.prototype.signIn = function (signinData) {
        return __awaiter(this, void 0, Promise, function () {
            var user, isPasswordValid, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { email: signinData.email }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        }
                        return [4 /*yield*/, bcrypt.compare(signinData.password, user.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        }
                        return [4 /*yield*/, this.generateToken(user.id, user.role)];
                    case 3:
                        token = _a.sent();
                        return [2 /*return*/, {
                                token: token,
                                user: user
                            }];
                }
            });
        });
    };
    AuthService.prototype.forgotPassword = function (userEmail) {
        return __awaiter(this, void 0, Promise, function () {
            var user, password, salt, hashedPassword, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: userEmail }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Invalid user');
                        }
                        password = generatePassword_1.generatePassword();
                        return [4 /*yield*/, this.mailService.sendMail({
                                to: user.email,
                                subject: 'Forgot Password',
                                context: "Your new password is " + password + ".\n        Please change your password after login."
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 3:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(password, salt)];
                    case 4:
                        hashedPassword = _a.sent();
                        user.password = hashedPassword;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        err_1 = _a.sent();
                        if (err_1 instanceof common_1.UnauthorizedException) {
                            throw err_1;
                        }
                        throw new Error("Failed to process forgot password: " + err_1.message);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.generateToken = function (userId, userRole) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.jwtService.signAsync({
                        sub: userId,
                        role: userRole
                    })];
            });
        });
    };
    AuthService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
