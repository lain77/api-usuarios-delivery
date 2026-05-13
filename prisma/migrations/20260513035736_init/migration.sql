-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(100) NOT NULL,
    `user_email` VARCHAR(254) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `user_cpf` VARCHAR(11) NOT NULL,
    `user_telefone` VARCHAR(20) NULL,
    `user_role` ENUM('CLIENTE', 'ENTREGADOR', 'ADMIN') NOT NULL,
    `user_status` ENUM('ATIVO', 'INATIVO', 'SUSPENSO') NOT NULL DEFAULT 'ATIVO',
    `user_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_user_email_key`(`user_email`),
    UNIQUE INDEX `user_user_cpf_key`(`user_cpf`),
    INDEX `user_user_role_user_status_idx`(`user_role`, `user_status`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente_dados` (
    `cliente_user_id` INTEGER NOT NULL,
    `cliente_data_nascimento` DATE NULL,

    PRIMARY KEY (`cliente_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entregador_dados` (
    `entregador_user_id` INTEGER NOT NULL,
    `entregador_cnh_numero` VARCHAR(11) NOT NULL,
    `entregador_cnh_categoria` ENUM('A', 'B', 'AB', 'C', 'D', 'E') NOT NULL,
    `entregador_cnh_validade` DATE NOT NULL,
    `entregador_veiculo_tipo` ENUM('MOTO', 'CARRO', 'BICICLETA', 'A_PE') NOT NULL,
    `entregador_veiculo_placa` VARCHAR(8) NULL,
    `entregador_status` ENUM('DISPONIVEL', 'EM_ENTREGA', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
    `entregador_cadastrado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `entregador_dados_entregador_cnh_numero_key`(`entregador_cnh_numero`),
    INDEX `entregador_dados_entregador_status_idx`(`entregador_status`),
    PRIMARY KEY (`entregador_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `endereco_id` INTEGER NOT NULL AUTO_INCREMENT,
    `endereco_user_id` INTEGER NOT NULL,
    `endereco_rua_nome` VARCHAR(150) NOT NULL,
    `endereco_rua_numero` VARCHAR(10) NOT NULL,
    `endereco_rua_complemento` VARCHAR(50) NULL,
    `endereco_rua_referencia` VARCHAR(100) NULL,
    `endereco_bairro` VARCHAR(80) NOT NULL,
    `endereco_cidade` VARCHAR(80) NOT NULL,
    `endereco_uf` CHAR(2) NOT NULL,
    `endereco_cep` VARCHAR(9) NOT NULL,
    `endereco_instrucao_entrega` VARCHAR(255) NULL,
    `endereco_principal` BOOLEAN NOT NULL DEFAULT false,
    `endereco_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `endereco_endereco_user_id_idx`(`endereco_user_id`),
    INDEX `endereco_endereco_uf_endereco_cidade_idx`(`endereco_uf`, `endereco_cidade`),
    PRIMARY KEY (`endereco_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cliente_dados` ADD CONSTRAINT `cliente_dados_cliente_user_id_fkey` FOREIGN KEY (`cliente_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregador_dados` ADD CONSTRAINT `entregador_dados_entregador_user_id_fkey` FOREIGN KEY (`entregador_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `endereco_endereco_user_id_fkey` FOREIGN KEY (`endereco_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
