/*
  Warnings:

  - The values [admin,user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Room` table. All the data in the column will be lost.
  - The primary key for the `RoomMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `RoomMember` table. All the data in the column will be lost.
  - The `id` column on the `RoomMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `RoomMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `hashedPassword` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reset` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('PENDING', 'REVEALED', 'HIDDEN');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "RoomMember" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_roomId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "password",
DROP COLUMN "type",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "reset" TEXT NOT NULL,
ADD COLUMN     "voteStatus" "VoteStatus" NOT NULL DEFAULT 'HIDDEN',
ALTER COLUMN "autoRevealCards" SET DEFAULT false,
ALTER COLUMN "showAveraging" SET DEFAULT false;

-- AlterTable
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_pkey",
DROP COLUMN "userId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "vote" DROP NOT NULL,
ADD CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Voting" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "values" TEXT[],
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingSystem" (
    "id" SERIAL NOT NULL,
    "votingId" INTEGER NOT NULL,
    "roomId" UUID NOT NULL,

    CONSTRAINT "VotingSystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voting_name_key" ON "Voting"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VotingSystem_roomId_votingId_key" ON "VotingSystem"("roomId", "votingId");

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingSystem" ADD CONSTRAINT "VotingSystem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingSystem" ADD CONSTRAINT "VotingSystem_votingId_fkey" FOREIGN KEY ("votingId") REFERENCES "Voting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
