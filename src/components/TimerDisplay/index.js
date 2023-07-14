import React from 'react';
import TimeAdjuster from '../TimeAdjuster';


const TimerDisplay = (props) => {
 
  const {timeRemaining} = props;
  
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60)).toString().padStart(2, "0");
    const minutesRemaining = Math.floor( (timeRemaining - hoursRemaining * 60 * 60) / 60).toString().padStart(2, "0");
    const secondsRemaining = Math.floor(timeRemaining - hoursRemaining * 60 * 60 - minutesRemaining * 60).toString().padStart(2, "0");

return (
  <div
  className="timer-display">
    <TimeAdjuster
      incrementValue={(60*60)}
      timerData={props}>
      </TimeAdjuster>
      <TimeAdjuster
      incrementValue={(60)}
      timerData={props}>
      </TimeAdjuster>
      <TimeAdjuster
      incrementValue={(1)}
      timerData={props}>
      </TimeAdjuster>
    <p><span className="timer-digits">{hoursRemaining}</span>:<span className="timer-digits">{minutesRemaining}</span>:<span className="timer-digits">{secondsRemaining}</span></p>
    <TimeAdjuster
      incrementValue={(-60*60)}
      timerData={props}>
      </TimeAdjuster>
      <TimeAdjuster
      incrementValue={(-60)}
      timerData={props}>
      </TimeAdjuster>
      <TimeAdjuster
      incrementValue={(-1)}
      timerData={props}>
      </TimeAdjuster>
  </div>
);
};
  
  export default TimerDisplay;
