-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "content_name" TEXT,
    "unit" TEXT,
    "max_capacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "current_quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "skin" TEXT NOT NULL DEFAULT 'premium',
    "attributes" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);
