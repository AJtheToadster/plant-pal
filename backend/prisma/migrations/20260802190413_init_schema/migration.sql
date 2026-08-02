-- CreateTable
CREATE TABLE "Controller" (
    "id" TEXT NOT NULL,
    "deviceMacAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastPingAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Controller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControllerOutput" (
    "id" TEXT NOT NULL,
    "controllerId" TEXT NOT NULL,
    "gpioPinNumber" INTEGER NOT NULL,
    "flowRateMlPerSec" DOUBLE PRECISION NOT NULL DEFAULT 10.00,

    CONSTRAINT "ControllerOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "outputChannelId" TEXT,
    "safetyTriggerEnabled" BOOLEAN NOT NULL DEFAULT false,
    "moistureThresholdPct" DOUBLE PRECISION,
    "safetyWaterVolumeMl" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantSchedule" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "daysOfWeek" INTEGER[],
    "targetVolumeMl" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Controller_deviceMacAddress_key" ON "Controller"("deviceMacAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ControllerOutput_controllerId_gpioPinNumber_key" ON "ControllerOutput"("controllerId", "gpioPinNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_outputChannelId_key" ON "Plant"("outputChannelId");

-- AddForeignKey
ALTER TABLE "ControllerOutput" ADD CONSTRAINT "ControllerOutput_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "Controller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_outputChannelId_fkey" FOREIGN KEY ("outputChannelId") REFERENCES "ControllerOutput"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantSchedule" ADD CONSTRAINT "PlantSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
