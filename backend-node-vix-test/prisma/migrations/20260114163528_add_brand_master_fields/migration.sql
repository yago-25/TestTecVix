-- AlterTable
ALTER TABLE `brandMaster` ADD COLUMN `discountRate` DECIMAL(10, 2) NULL,
    ADD COLUMN `hasPrepaid` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `hasSelfRegister` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `idBrandTheme` INTEGER NULL,
    ADD COLUMN `isStripeActive` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `minConsumption` DECIMAL(10, 2) NULL,
    ADD COLUMN `retailPercentageDefault` DECIMAL(10, 2) NULL;
