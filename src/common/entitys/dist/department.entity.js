"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Department = void 0;
var typeorm_1 = require("typeorm");
var Department = /** @class */ (function () {
    function Department() {
    }
    __decorate([
        typeorm_1.Generated('uuid'),
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Department.prototype, "id");
    __decorate([
        typeorm_1.Column('varchar', {
            length: 255,
            nullable: false
        })
    ], Department.prototype, "name");
    __decorate([
        typeorm_1.Column('varchar', {
            length: 255,
            nullable: true
        })
    ], Department.prototype, "description");
    __decorate([
        typeorm_1.Column('varchar', {
            length: 255,
            nullable: true
        })
    ], Department.prototype, "parentDepartmentId");
    __decorate([
        typeorm_1.Column('boolean', {
            "default": false
        })
    ], Department.prototype, "isDeleted");
    Department = __decorate([
        typeorm_1.Entity()
    ], Department);
    return Department;
}());
exports.Department = Department;
