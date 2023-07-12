import React from 'react';
import {canChangeTime} from '../../util/functions';

const TimeAdjuster = ({incrementValue, timerData}) => {
      const {setIsChangingTime, setBegunChangingTime, isCounting, minTimeRemaining, timeRemaining, maxTimeRemaining, setTimeRemaining} = timerData;
  
    return (
        <button
        onMouseDown={() => {
          setBegunChangingTime(true);
          setIsChangingTime(incrementValue);
        }}
        onTouchStart={() => {
          setIsChangingTime(incrementValue);
        }}
        onMouseUp={() => setIsChangingTime(0)}
        onTouchEnd={() => setIsChangingTime(0)}
        disabled={isCounting || (!canChangeTime(minTimeRemaining, (timeRemaining + incrementValue), maxTimeRemaining))}>
          {incrementValue > 0 ? "+" : "-"}
        </button>
    );
  };
  
  export default TimeAdjuster;