-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetExpiry" TEXT,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "verificationToken" TEXT;
