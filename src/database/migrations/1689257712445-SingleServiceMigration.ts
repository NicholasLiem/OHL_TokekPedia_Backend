import { MigrationInterface, QueryRunner } from "typeorm"
import { Perusahaan } from "../../models/perusahaan.model"
import { Barang } from "../../models/barang.model"
import { UserModel } from "../../models/user.model"

export class SingleServiceMigration1689257712445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const perusahaanRepository = queryRunner.manager.getRepository(Perusahaan);
        const barangRepository = queryRunner.manager.getRepository(Barang);
        const userRepository = queryRunner.manager.getRepository(UserModel);

        for (let i = 1; i <= 10; i++) {
        const perusahaanCode = this.generateRandomCode(3);
        const perusahaan = new Perusahaan(
            `PT. ${String.fromCharCode(65 + i)}`,
            "08123456789",
            perusahaanCode,
            `Jl. ${String.fromCharCode(65 + i)}`
        );
        await perusahaanRepository.insert(perusahaan);

        for (let j = 1; j <= 10; j++) {
            const barangCode = this.generateRandomCode(3);
            const barang = new Barang(
            `Barang ${String.fromCharCode(65 + j)}`,
            this.getRandomPrice(),
            this.getRandomStock(),
            perusahaan,
            barangCode
            );
            await barangRepository.insert(barang);
        }
    }

    // Inserting admin user
    const user = new UserModel("admin", "admin", "admin");
    await userRepository.insert(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

    private generateRandomCode(length: number): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++)
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    }

    private getRandomPrice(): number {
        return Math.floor(Math.random() * 1000000);
    }

    private getRandomStock(): number {
        return Math.floor(Math.random() * 100);
    }

}
