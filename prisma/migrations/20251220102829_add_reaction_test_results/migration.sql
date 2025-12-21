-- CreateTable
CREATE TABLE "ReactionTestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactionTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReactionTestResult_userId_idx" ON "ReactionTestResult"("userId");

-- CreateIndex
CREATE INDEX "ReactionTestResult_createdAt_idx" ON "ReactionTestResult"("createdAt");

-- CreateIndex
CREATE INDEX "ReactionTestResult_userId_createdAt_idx" ON "ReactionTestResult"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ReactionTestResult" ADD CONSTRAINT "ReactionTestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
