import * as _ntc from "./ntc.js";

var voices;

/** Changes the background color of the page body and all elements with class "auto-color" */
function ChangeBG(color) {
    document.body.style.backgroundColor = color;
    document.querySelectorAll(".auto-color").forEach(ele => ele.style.color = InvertColor(color));
}


/** Makes the Browser to say the name of the selected Color 
 * @param  {String} color The color to change to
 * @param  {Number} vol The volume of the voice
 * @param  {Selection} voiceList Select element which contains voices from the function PopulateVoices()
 * @param  {Element} output The element which the name of the color will be displayed
*/
function Say(color, vol, voiceList, output) {
    if (!_ntc.isInit) {
        _ntc.ntc.init();
    }

    var match = _ntc.ntc.name(color);
    var name = match[1]; // This is the text string for the name of the match
    //rgb = n_match[0]; // This is the RGB value of the closest matching color
    //exactmatch = n_match[2]; // True if exact color match, False if close-match

    ShowOutput(output, name, color);
    ChangeBG(color);

    let toSpeak = new SpeechSynthesisUtterance(name);
    toSpeak.volume = vol;
    if (voiceList.selectedOptions.length > 0) {
        let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
        voices.forEach((voice)=>{
            if(voice.name === selectedVoiceName){
                toSpeak.voice = voice;
            }
        });
        speechSynthesis.cancel();
        speechSynthesis.speak(toSpeak);
    }
    else {
        console.log("Your browser does not support our SpeechSynthesis");
    }
    console.log(`{${name}} : {${color}}`);
}


/** Returns the Hex code of the color or empty string if there isn't such color */
function IsValidColor(color) {
    if (!_ntc.isInit) {
        _ntc.ntc.init();
    }

    var isColor = _ntc.ntc.toRgb(color);

    if (isColor != "None") {
        return "#" + isColor;
    }
    else {
        return "";
    }
}


/**Generates all available voices which depends on the Browser and the OS to a Select element
 * in the HTML with id "voice-list"*/
function PopulateVoices() {
    voices = speechSynthesis.getVoices();
    
    if (!voices.length) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
        }
    }

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
/** Applies animation to the element and set's the color and the name */
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


/** Inverts the given color */
function InvertColor(color) {
    return '#' + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1),16)).toString(16)).slice(-6);
}


/** Just set's the color to the p element */
function ChangeOutput(p, color) {
    p.innerHTML = color;
}


/** Copy text from p element to the Clipboard */
function CopyOutputToClipboard(element) {
    var temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = element.innerText;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
}


/** Call this function and it will auto type any letter or number pressed into the inputElement */
function ActivateAutoTyping(inputElement, button) {
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
    
        switch (charCode) {
            case 8:
                inputElement.value = inputElement.value.slice(0, -1);
                break;
            case 13:
                button.dispatchEvent(new Event("click"));
                break;
            default:
                if (/[a-z0-9]/i.test(charStr) || charStr == " ") {
                    inputElement.value = inputElement.value + charStr.toLowerCase();
                    if (!evt.ctrlKey) {
                        evt.preventDefault();
                    }
                }
        }
     };
}



export {ChangeBG, Say, PopulateVoices, InvertColor, ChangeOutput, CopyOutputToClipboard, 
    IsValidColor, ActivateAutoTyping};