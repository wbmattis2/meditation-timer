import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TimerButton from './components/TimerButton';
import TimerDisplay from './components/TimerDisplay';
import PrayerSelector from './components/PrayerSelector';

function App() {
  
  const synth = useRef(window.speechSynthesis);
  const firstPsalm = {
      text: [
        "Blessed is the man who doesn’t walk in the counsel of the wicked,\nnor stand on the path of sinners,\nnor sit in the seat of scoffers;\n",
        "but his delight is in Yahweh’s law.\nOn his law he meditates day and night.\n",
        "He will be like a tree planted by the streams of water,\nthat produces its fruit in its season,\nwhose leaf also does not wither.\nWhatever he does shall prosper.\n",
        "The wicked are not so,\nbut are like the chaff which the wind drives away.\n",
        "Therefore the wicked shall not stand in the judgment,\nnor sinners in the congregation of the righteous.\n",
        "For Yahweh knows the way of the righteous,\nbut the way of the wicked shall perish.\n"
      ],
      verse_duration: 3,
      utterances: []
    };
  for (let index in firstPsalm.text) {
    firstPsalm.utterances.push(new SpeechSynthesisUtterance(firstPsalm.text[index]));
    const currentVerseDuration = firstPsalm.text[index].split(" ").length / 2;
            if (currentVerseDuration > firstPsalm.verse_duration) {
                firstPsalm.verse_duration = currentVerseDuration;
            }
  }
  const [prayer, setPrayer] = useState(firstPsalm);
  const [isCounting, setIsCounting] = useState(false);
  const [isChangingTime, setIsChangingTime] = useState(false);
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
    if (isCounting && !currentVerseUttered) {
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
    //setMinTimeRemaining(prayer.text.length * prayer.verse_duration);
    setVerseIndex(0);
  }, [prayer]);

  //Adjust the timer with the buttons, but ensure that there is enough time to complete the meditation
  useEffect(() => {
    if (isChangingTime && !isCounting) {
      const timeout = setTimeout(() => {
        switch(isChangingTime) {
          case "increasing hours":
            if (!(timeRemaining >= 60 * 60 * 99)) {
              setTimeRemaining(timeRemaining => timeRemaining + 60 * 60);
            }
            break;
          case "increasing minutes":
            if (!(timeRemaining >= 60 * 60 * 99 + 60 * 59)) {
              setTimeRemaining(timeRemaining => timeRemaining + 60);
            }
            break;
          case "increasing seconds":
            if (!(timeRemaining >= 60 * 60 * 99 + 60 * 59 + 59)) {
              setTimeRemaining(timeRemaining => timeRemaining + 1);
            }
            break;
          case "decreasing hours":
            if (!(timeRemaining <= minTimeRemaining + 60 * 60)) {
              setTimeRemaining(timeRemaining => timeRemaining - 60 * 60);
            }
            break;
          case "decreasing minutes":
            if (!(timeRemaining <= minTimeRemaining + 60)) {
              setTimeRemaining(timeRemaining => timeRemaining - 60);
            }
            break;
          case "decreasing seconds":
            if (!(timeRemaining <= minTimeRemaining)) {
              setTimeRemaining(timeRemaining => timeRemaining - 1);
            }
            break;
          default: 
            alert("An error has occurred:" + timeRemaining);
            return;
        }
      }, 100);
      return () => {
        clearTimeout(timeout);
      };
    }
  },[isCounting, isChangingTime, timeRemaining, minTimeRemaining]);

  return (
    <>
        <PrayerSelector
        setPrayer={setPrayer}
        isCounting={isCounting}>
        </PrayerSelector>
        <p className="text-area">{prayer.text[verseIndex] || ""}</p>
      <TimerDisplay
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        minTimeRemaining={minTimeRemaining}
        setIsChangingTime={setIsChangingTime}
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
