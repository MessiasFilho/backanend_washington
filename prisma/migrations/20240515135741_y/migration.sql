/*
  Warnings:

  - Added the required column `pessoa` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `pessoa` VARCHAR(10) NOT NULL;
