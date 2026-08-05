/**
 * Calculates the duration (in seconds) required to pump a target volume of water.
 * 
 * @param volumeMl The target volume of water to deliver in milliliters.
 * @param flowRateMlPerSec The calibrated flow rate of the pump channel in mL/sec.
 * @returns Duration in seconds the pump relay should remain ON.
 */
export function calculateWateringDuration(volumeMl: number, flowRateMlPerSec: number): number {
    return volumeMl / flowRateMlPerSec;
}
