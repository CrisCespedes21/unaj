-- CreateTable
CREATE TABLE `Access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_user_id` INTEGER NOT NULL,

    INDEX `Access_type_user_id_idx`(`type_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `type_user_id` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_type_user_id_idx`(`type_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sede` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipoCombustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `abreviatura` VARCHAR(45) NOT NULL,
    `unidad` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Combustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `tipoEquipo` VARCHAR(45) NOT NULL,
    `consumo` FLOAT NOT NULL,
    `tipoCombustible_id` INTEGER NOT NULL,
    `mes_id` INTEGER NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `sede_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoFertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clase` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `porcentajeNitrogeno` FLOAT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `contenido` LONGBLOB NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoFertilizante_id` INTEGER NOT NULL,
    `cantidad` FLOAT NOT NULL,
    `is_ficha` BOOLEAN NOT NULL DEFAULT false,
    `ficha_id` INTEGER NULL,
    `sede_id` INTEGER NULL,
    `anio_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Fertilizante_ficha_id_key`(`ficha_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_tipoCombustible_id_fkey` FOREIGN KEY (`tipoCombustible_id`) REFERENCES `tipoCombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_tipoFertilizante_id_fkey` FOREIGN KEY (`tipoFertilizante_id`) REFERENCES `TipoFertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_ficha_id_fkey` FOREIGN KEY (`ficha_id`) REFERENCES `Documento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
