-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('REACTION');

-- CreateTable
CREATE TABLE "TestSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testType" "TestType" NOT NULL,
    "resultValue" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestSession_userId_createdAt_idx" ON "TestSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TestSession_userId_testType_createdAt_idx" ON "TestSession"("userId", "testType", "createdAt");

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
