import React from 'react';

const TimerDisplay = ({timeRemaining, minTimeRemaining, setIsChangingTime, isCounting}) => {
  
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60)).toString().padStart(2, "0");
    const minutesRemaining = Math.floor( (timeRemaining - hoursRemaining * 60 * 60) / 60).toString().padStart(2, "0");
    const secondsRemaining = Math.floor(timeRemaining - hoursRemaining * 60 * 60 - minutesRemaining * 60).toString().padStart(2, "0");

    return (
      <div
      className="timer-display">
        <button
        onMouseDown={() => {
          setIsChangingTime("increasing hours");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining >= 60 * 60 * 99)}>
          +
        </button>
        <button
        onMouseDown={() => {
          setIsChangingTime("increasing minutes");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining >= 60 * 60 * 99 + 60 * 59)}>
          +
        </button>
        <button
        onMouseDown={() => {
          setIsChangingTime("increasing seconds");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining >= 60 * 60 * 99 + 60 * 59 + 59)}>
          +
        </button>
        <p><span className="timer-digits">{hoursRemaining}</span>:<span className="timer-digits">{minutesRemaining}</span>:<span className="timer-digits">{secondsRemaining}</span></p>
        <button
        onMouseDown={() => {
          setIsChangingTime("decreasing hours");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining <= minTimeRemaining + 60 * 60)}>
          -
        </button>
        <button
        onMouseDown={() => {
          setIsChangingTime("decreasing minutes");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining <= minTimeRemaining + 60)}>
          -
        </button>
        <button
        onMouseDown={() => {
          setIsChangingTime("decreasing seconds");
        }}
        onMouseUp={() => setIsChangingTime(false)}
        disabled={isCounting || (timeRemaining <= minTimeRemaining)}>
          -
        </button>
      </div>
    );
  };
  
  export default TimerDisplay;