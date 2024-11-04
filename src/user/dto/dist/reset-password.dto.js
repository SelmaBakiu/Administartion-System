"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResetPasswordDto = void 0;
var class_validator_1 = require("class-validator");
var ResetPasswordDto = /** @class */ (function () {
    function ResetPasswordDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], ResetPasswordDto.prototype, "oldPassword");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.Length(8),
        class_validator_1.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
        })
    ], ResetPasswordDto.prototype, "newPassword");
    return ResetPasswordDto;
}());
exports.ResetPasswordDto = ResetPasswordDto;
