/*
  Warnings:

  - A unique constraint covering the columns `[user_id,coin_code]` on the table `balances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "balances_user_id_idx" ON "balances"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "balances_user_id_coin_code_key" ON "balances"("user_id", "coin_code");

-- CreateIndex
CREATE INDEX "purchases_user_id_idx" ON "purchases"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");
