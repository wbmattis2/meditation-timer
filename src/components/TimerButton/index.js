import React from 'react';

const TimerButton = ({isCounting, setIsCounting}) => {

    const currentButtonSymbol = () => {
        if (isCounting) {
            return (<i className="fa fa-pause"></i>);
        } else {
            return (<i className="fa fa-play"></i>);
        }
    };
  
    return (
      <button
      onClick={() => setIsCounting(!isCounting)}>
        {currentButtonSymbol()}
      </button>
    );
  };
  
  export default TimerButton;