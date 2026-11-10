-- ====================================================================
-- StepFlow MySQL Database Schema (Kanmo Support Portal)
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB, Laragon & Hostinger
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `stepflow_db` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `stepflow_db`;

-- --------------------------------------------------------------------
-- 1. Tabel workflows: Menyimpan metadata panduan / SOP
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `workflows` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT 'General SOP',
  `target_url` text,
  `author` varchar(100) DEFAULT 'Tim Perusahaan',
  `last_edited_by` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Tabel steps: Menyimpan langkah, gambar, screenshot & anotasi
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `steps` (
  `id` varchar(64) NOT NULL,
  `workflow_id` varchar(64) NOT NULL,
  `order_index` int NOT NULL,
  `action_type` varchar(50) DEFAULT 'click',
  `title` varchar(255) NOT NULL,
  `description` text,
  `url` text,
  `page_title` text,
  `screenshot_url` longtext NOT NULL,
  `highlight_json` json DEFAULT NULL,
  `callout_json` json DEFAULT NULL,
  `blur_regions_json` json DEFAULT NULL,
  `target_element_json` longtext,
  `arrows_json` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_workflow_order` (`workflow_id`,`order_index`),
  CONSTRAINT `fk_steps_workflow` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Tabel workflow_edit_logs: Riwayat pengeditan panduan oleh tim
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `workflow_edit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workflow_id` varchar(100) NOT NULL,
  `editor_name` varchar(100) NOT NULL,
  `edited_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wf_log` (`workflow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Tabel team_accounts: Hak akses, Akun Tim & PIN Editor
-- Dikelola langsung melalui database (phpMyAdmin)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `team_accounts` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pin` varchar(50) NOT NULL,
  `role` varchar(50) DEFAULT 'editor',
  `badge_color` varchar(50) DEFAULT 'emerald',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Data Awal (Seeding) Akun Tim & PIN
-- Anda dapat menambah, mengubah, atau menghapus akun langsung dari phpMyAdmin
-- --------------------------------------------------------------------
INSERT INTO `team_accounts` (`id`, `name`, `pin`, `role`, `badge_color`, `is_active`)
VALUES
  ('team_1', 'Ridho', '24170', 'editor', 'emerald', 1),
  ('team_2', 'Hikam', '23721', 'editor', 'blue', 1),
  ('team_3', 'Fazril', '20642', 'editor', 'purple', 1)
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `pin` = VALUES(`pin`),
  `badge_color` = VALUES(`badge_color`),
  `role` = VALUES(`role`),
  `is_active` = VALUES(`is_active`);
