import * as _ntc from "./ntc.js";

/** Changes the background color of the page body */
function ChangeBG(color) {
    document.body.style.backgroundColor = color;
    document.querySelectorAll(".auto-color").forEach(ele => ele.style.color = InvertColor(color));
}


/** Makes the Browser to say the name of the selected Color */
function Say(color, vol, voiceList, element) {
    _ntc.ntc.init();
    let match = _ntc.ntc.name(color);
    let name = match[1]; // This is the text string for the name of the match
    //rgb = n_match[0]; // This is the RGB value of the closest matching color
    //exactmatch = n_match[2]; // True if exact color match, False if close-match

    ShowOutput(element, name, color);

    let synth = window.speechSynthesis;
    let voices = synth.getVoices();

    let toSpeak = new SpeechSynthesisUtterance(name);
    toSpeak.volume = vol;
    let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
    voices.forEach((voice)=>{
        if(voice.name === selectedVoiceName){
            toSpeak.voice = voice;
        }
    });
    synth.speak(toSpeak);
    console.log(`{${name}} : {${color}}`);
}


/**Generates all available voices which depend on the Browser and the OS */
function PopulateVoices() {
    let synth = window.speechSynthesis;
    let voices = synth.getVoices();
    let voiceList = document.getElementById("voice-list");

    let selectedIndex = voices.findIndex(voice => voice.name.includes("English"));
    voiceList.innerHTML = '';
    voices.forEach((voice)=>{
        let listItem = document.createElement('option');
        listItem.textContent = voice.name;
        listItem.setAttribute('data-lang', voice.lang);
        listItem.setAttribute('data-name', voice.name);
        voiceList.appendChild(listItem);
    });

    voiceList.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
}

var isAnimationRunning = false;
function ShowOutput(element, name, color) {
    let aniOFF = "output-name-text-hide";
    let aniON = "output-name-text-show";
    element.classList.remove(aniON);
    element.classList.remove(aniOFF);
    element.innerHTML = name;
    element.style.color = color;
    if (isAnimationRunning) return;
    element.classList.add(aniON);
    setTimeout(() => { if (isAnimationRunning) { 
        element.classList.add(aniOFF); isAnimationRunning = false; } 
    }, 2000);
    isAnimationRunning = true;
}


function InvertColor(color) {
    return '#' + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1),16)).toString(16)).slice(-6);
}


function ChangeOutput(p, color) {
    p.innerHTML = color;
}

function CopyOutputToClipboard(element) {
    var temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = element.innerText;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
}

export {ChangeBG, Say, PopulateVoices, InvertColor, ChangeOutput, CopyOutputToClipboard};