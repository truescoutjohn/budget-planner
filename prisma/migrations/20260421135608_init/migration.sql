/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LOCALE" AS ENUM ('EN', 'RU', 'UK', 'DE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('UAH', 'EUR', 'USD');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH', 'CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "TYPE_STORAGE_MONEY" AS ENUM ('CARD', 'CRYPTO', 'CASH');

-- CreateEnum
CREATE TYPE "TYPE_DIRECTION_MONEY" AS ENUM ('INCOME', 'EXPENSES', 'TRANSFER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" "LOCALE" NOT NULL DEFAULT 'EN',
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'SAVINGS',
    "balance" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'UAH',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type_storage" "TYPE_STORAGE_MONEY" NOT NULL DEFAULT 'CARD',
    "type_direction" "TYPE_DIRECTION_MONEY" NOT NULL,
    "number" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
