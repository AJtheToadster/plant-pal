export interface Controller {
  id: string;
  name: string;
  deviceMacAddress: string;
  isOnline: boolean;
  outputs?: ControllerOutput[];
}

export interface ControllerOutput {
  id: string;
  controllerId: string;
  gpioPinNumber: number;
  flowRateMlPerSec: number;
}


export interface PlantSchedule {
  id: string;
  plantId: string;
  scheduledTime: string;
  daysOfWeek: number[];
  targetVolumeMl: number;
  isActive: boolean;
}

export interface Plant {
  id: string;
  name: string;
  species?: string | null;
  outputChannelId?: string | null;
  outputChannel?: ControllerOutput | null;
  safetyTriggerEnabled: boolean;
  moistureThresholdPct?: number | null;
  safetyWaterVolumeMl?: number | null;
  schedules?: PlantSchedule[];
  createdAt: string;
}

export interface WaterResponse {
  gpioPinNumber: number;
  durationSeconds: number;
}
