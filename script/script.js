// ----------------All functions are defined in the "functions.js" file--------------------------

import * as functions from "./functions.js";
import KellyColorPicker from "./html5kellycolorpicker.js";


// Used objects from the HTML file
var hearButton = document.getElementById("hear-button");
var volumeRange = document.getElementById("volume-range");
var outputHex = document.getElementById("output-hex-text");
var outputName = document.getElementById("output-name-text");
var settingsButton = document.getElementById("settings-icon");
var settings = document.getElementById("settings-menu");
var voiceList = document.getElementById("voice-list");
var colorPicker = new KellyColorPicker({
    place: "picker",
    input: "output-hex-text",
    inputColor: false,
    size: 300,
    method: "triangle",
    colorSaver: true,
    userEvents: {
        change: (self) => {
            functions.ChangeBG(self.getCurColorHex());
            functions.ChangeOutput(outputHex, self.getCurColorHex());
        }
    }
});


// Functions called at runtime
functions.PopulateVoices();
setTimeout(() => functions.PopulateVoices(), 500)
functions.ChangeBG(colorPicker.getCurColorHex())


// Events added to the HTML elements
hearButton.onclick = () => functions.Say(colorPicker.getCurColorHex(), volumeRange.value/10, voiceList, outputName);
outputName.onclick = () => functions.CopyOutputToClipboard(outputName);
settingsButton.onclick = () => {
    if (settings.classList.contains("settings-show")) settings.classList.toggle("settings-hide");
    else settings.classList.toggle("settings-show");
}