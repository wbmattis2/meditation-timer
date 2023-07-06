import {React} from 'react';

const PrayerSelector = ({setPrayer, isCounting}) => {
    let options = [];
    for (let i = 1; i < 151; i++) {
        options.push(<option key={i.toString()} value={i}>{"Psalm " + i}</option>);
    }
    
const handleSelection = async (e) => {
    const result = {
        text: [],
        verse_duration: 1,
        utterances: []
    };
    const psalmNumber = e.target.value;
    console.log("psalm number: " + String(psalmNumber))
    const requestUrl = `https://bible-api.com/psalms%20` + String(psalmNumber);
    await fetch(requestUrl, {
      method: 'GET'
    })
    .then(httpResponse => httpResponse.json())
    .then(jsonResponse => jsonResponse.verses)
    .then(verseObjectArray => {
        for (let index in verseObjectArray) {
            const verse = verseObjectArray[index].text;
            result.text.push(verse);
            result.utterances.push(new SpeechSynthesisUtterance(verse));
            const currentVerseDuration = verse.split(" ").length / 2;
            if (currentVerseDuration > result.verse_duration) {
                result.verse_duration = currentVerseDuration;
            }
        }
    });
    setPrayer(result);
};

    return (
      <select 
      onChange={e => {handleSelection(e);}}
      disabled={isCounting}>
        {options}
      </select>
    );
  };
  
  export default PrayerSelector;