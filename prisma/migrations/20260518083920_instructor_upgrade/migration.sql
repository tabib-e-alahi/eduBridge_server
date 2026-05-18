-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "completionCriteria" DOUBLE PRECISION NOT NULL DEFAULT 80.0,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "whatYouWillLearn" TEXT[];

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "expertise" TEXT[],
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;
