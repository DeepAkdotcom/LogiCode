/*
  Warnings:

  - You are about to drop the column `stdeerr` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "stdeerr",
ADD COLUMN     "stderr" TEXT;
