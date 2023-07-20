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
exports.Barang = void 0;
const typeorm_1 = require("typeorm");
const perusahaan_model_1 = require("./perusahaan.model");
let Barang = class Barang {
    constructor(nama, harga, stok, perusahaan, kode) {
        this.nama = nama;
        this.harga = Math.max(harga, 0);
        this.stok = Math.max(stok, 0);
        this.perusahaan = perusahaan;
        this.kode = kode;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Barang.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Barang.prototype, "nama", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Barang.prototype, "harga", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Barang.prototype, "stok", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => perusahaan_model_1.Perusahaan, perusahaan => perusahaan.barangs),
    __metadata("design:type", perusahaan_model_1.Perusahaan)
], Barang.prototype, "perusahaan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Barang.prototype, "kode", void 0);
Barang = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Check)(`"harga" >= 0`),
    (0, typeorm_1.Check)(`"stok" >= 0`),
    __metadata("design:paramtypes", [String, Number, Number, perusahaan_model_1.Perusahaan, String])
], Barang);
exports.Barang = Barang;
