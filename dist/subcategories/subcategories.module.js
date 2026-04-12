"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subcategories_controller_1 = require("./subcategories.controller");
const subcategories_service_1 = require("./subcategories.service");
const subcategory_entity_1 = require("../entities/subcategory.entity");
const category_entity_1 = require("../entities/category.entity");
let SubCategoriesModule = class SubCategoriesModule {
};
exports.SubCategoriesModule = SubCategoriesModule;
exports.SubCategoriesModule = SubCategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([subcategory_entity_1.SubCategory, category_entity_1.Category])],
        controllers: [subcategories_controller_1.SubCategoriesController],
        providers: [subcategories_service_1.SubCategoriesService],
        exports: [subcategories_service_1.SubCategoriesService],
    })
], SubCategoriesModule);
//# sourceMappingURL=subcategories.module.js.map