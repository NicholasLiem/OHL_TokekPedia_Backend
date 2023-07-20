"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perusahaan = void 0;
const typeorm_1 = require("typeorm");
const barang_model_1 = require("./barang.model");
let Perusahaan = class Perusahaan {
    constructor(nama, no_telp, kode, alamat) {
        this.nama = nama;
        this.no_telp = no_telp;
        this.kode = kode;
        this.alamat = alamat;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Perusahaan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perusahaan.prototype, "nama", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perusahaan.prototype, "alamat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perusahaan.prototype, "no_telp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perusahaan.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => barang_model_1.Barang, barang => barang.perusahaan, { cascade: true }),
    __metadata("design:type", Object)
], Perusahaan.prototype, "barangs", void 0);
Perusahaan = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String])
], Perusahaan);
exports.Perusahaan = Perusahaan;
