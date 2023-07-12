export const canChangeTime = (minTime, nextTime, maxTime) => {
    return (nextTime >= minTime && nextTime <= maxTime);
}