import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TimerButton from './components/TimerButton';
import TimerDisplay from './components/TimerDisplay';
import PrayerSelector from './components/PrayerSelector';
import {canChangeTime} from './util/functions';

function App() {
  const synth = useRef(window.speechSynthesis);
  const maxTimeRemaining = useRef(99 * 60 * 60 + 59 * 60 + 59);
  const instructions = useRef({
      text: [
        "Press the + and - buttons to adjust the duration of your meditation by seconds, minutes, or hours."
      ],
      verse_duration: 99 * 60 * 60,
      utterances: []
    });

  const [prayer, setPrayer] = useState(instructions.current);
  const [isCounting, setIsCounting] = useState(false);
  const [isChangingTime, setIsChangingTime] = useState(false);
  const [begunChangingTime, setBegunChangingTime] = useState(false);
  const [minTimeRemaining, setMinTimeRemaining] = useState(prayer.verse_duration * (prayer.text.length));
  const [timeRemaining, setTimeRemaining] = useState(minTimeRemaining);
  const [verseIndex, setVerseIndex] = useState(0);
  const [nextVerseTimes, setNextVerseTimes] = useState([]);
  const [currentVerseUttered, setCurrentVerseUttered] = useState(false); 

  //stop timer when it has exhausted the allotted time
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsCounting(false);
    }
  },[timeRemaining]);
  
  //While isCounting is true, advance the timer one second at a time
  useEffect(() => {
    if (isCounting && timeRemaining - 1 >= 0) {
      const timeout = setTimeout(() => {
        setTimeRemaining(timeRemaining => timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  },[isCounting, timeRemaining]);

  //Advance minimum time remaining with each second that passes
  useEffect(() => {
    if (isCounting && minTimeRemaining > timeRemaining) {
      setMinTimeRemaining(timeRemaining);
    }
  },[isCounting, timeRemaining, minTimeRemaining]);

  //update minimum time when verse index advances or new prayer chosen
  useEffect(() => {
    if (verseIndex > prayer.text.length) {
      setMinTimeRemaining(0);
    }
    else {
      setMinTimeRemaining(prayer.verse_duration * (prayer.text.length - (verseIndex)));
    }
  }, [prayer, verseIndex]);

  //calculate times to advance verses
  useEffect(() => {
    if (!isCounting) {
      const versesRemaining = prayer.text.length - verseIndex;
      if (versesRemaining) {
        const versesRemaining = prayer.text.length - verseIndex;
        const newVerseDuration = timeRemaining / versesRemaining;
        const newNextVerseTimes = new Array(verseIndex).fill(-1);
        for (let i = 0; i <= versesRemaining; i++) {
          newNextVerseTimes[verseIndex + i] = timeRemaining - (i + 1) * newVerseDuration;
        }
        setNextVerseTimes(newNextVerseTimes);
      }
    }
  },[isCounting, timeRemaining, verseIndex, prayer]);

  //Advance to and utter next verse
  useEffect(() => {
    if (isCounting && verseIndex < nextVerseTimes.length && (timeRemaining <= nextVerseTimes[verseIndex])) {
      setVerseIndex(verseIndex => verseIndex + 1);
      setCurrentVerseUttered(false);
    }
  }, [isCounting, timeRemaining, nextVerseTimes, verseIndex, prayer]);

  //Utter new verse
  useEffect(() => {
    if (isCounting && !currentVerseUttered && prayer.utterances[verseIndex]) {
      synth.current.speak(prayer.utterances[verseIndex]);
      setCurrentVerseUttered(true);
    }
  }, [isCounting, currentVerseUttered, verseIndex, prayer]);

  //pause utterance when not counting
  useEffect(() => {
    if (isCounting) {
      if (synth.current.paused) {
        synth.current.resume();
      }
    }
    else {
      if (synth.current.speaking) {
        synth.current.pause();
      }
    }
  }, [isCounting]);
  
  //Reset verse index, speech synthesis, and time remaining when new prayer is chosen
  useEffect(() => {
    synth.current.cancel();
    setCurrentVerseUttered(false);
    setTimeRemaining(prayer.text.length * prayer.verse_duration);
    setVerseIndex(0);
  }, [prayer]);

  //Adjust the timer with the buttons, but ensure that there is enough time to complete the meditation
  useEffect(() => {
    if (isChangingTime && !isCounting) {
      const tryChangeTime = () => {
        const nextTimeRemaining = timeRemaining + isChangingTime;
        if (canChangeTime(minTimeRemaining, nextTimeRemaining, maxTimeRemaining.current)){
            setTimeRemaining(nextTimeRemaining);
        }
      }
      if (begunChangingTime) {
        setBegunChangingTime(false)
        tryChangeTime();
      }
      else {
        const timeout = setTimeout(tryChangeTime, 175);
        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [timeRemaining, isChangingTime, isCounting, minTimeRemaining, begunChangingTime]);
  

  return (
    <>
        <PrayerSelector
        setPrayer={setPrayer}
        isCounting={isCounting}
        instructions={instructions.current}>
        </PrayerSelector>
        <p className="text-area">{prayer.text[verseIndex] || ""}</p>
      <TimerDisplay
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        minTimeRemaining={minTimeRemaining}
        maxTimeRemaining={maxTimeRemaining.current}
        setIsChangingTime={setIsChangingTime}
        setBegunChangingTime={setBegunChangingTime}
        isCounting={isCounting}>
      </TimerDisplay>
      <TimerButton
        isCounting={isCounting}
        setIsCounting={setIsCounting}>
      </TimerButton>
    </>
  );
}

export default App;
