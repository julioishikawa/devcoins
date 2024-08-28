-- CreateEnum
CREATE TYPE "CurrencySymbols" AS ENUM ('BRL', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD');

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "currency_symbol" "CurrencySymbols" NOT NULL DEFAULT 'BRL';
