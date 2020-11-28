// ------------------------Name That Color script----------------------------
// Used for converting hash value color to the approximate name of that color
// ------------- All credits to http://chir.ag/projects/ntc -----------------



var names;

readJson("./data/colors.json");

export var ntc = {
    /**Call this everytime before using other methods*/
    init: function() {
      var color, rgb, hsl;
      for(var i = 0; i < names.length; i++)
      {
        color = "#" + names[i][0];
        rgb = ntc.rgb(color);
        hsl = ntc.hsl(color);
        names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
      }
    },
    
    /**
    * Converts hashcode color to name of that color
    * @param  {String} color Hash value of that color
    * @returns {String} Name of the color
    */
    name: function(color) {
      color = color.toUpperCase();
      if(color.length < 3 || color.length > 7)
        return ["#000000", "Invalid Color: " + color, false];
      if(color.length % 3 == 0)
        color = "#" + color;
      if(color.length == 4)
        color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);
  
      var rgb = ntc.rgb(color);
      var r = rgb[0], g = rgb[1], b = rgb[2];
      var hsl = ntc.hsl(color);
      var h = hsl[0], s = hsl[1], l = hsl[2];
      var ndf1 = 0; 
      var ndf2 = 0; 
      var ndf = 0;
      var cl = -1, df = -1;
  
      for(var i = 0; i < names.length; i++)
      {
        if(color == "#" + names[i][0])
          return ["#" + names[i][0], names[i][1], true];
  
        ndf1 = Math.pow(r - names[i][2], 2) + Math.pow(g - names[i][3], 2) + Math.pow(b - names[i][4], 2);
        ndf2 = Math.pow(h - names[i][5], 2) + Math.pow(s - names[i][6], 2) + Math.pow(l - names[i][7], 2);
        ndf = ndf1 + ndf2 * 2;
        if(df < 0 || df > ndf)
        {
          df = ndf;
          cl = i;
        }
      }
  
      return (cl < 0 ? ["#000000", "Invalid Color: " + color, false] : ["#" + names[cl][0], names[cl][1], false]);
    },
  
    hsl: function (color) {
  
      var rgb = [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
      var min, max, delta, h, s, l;
      var r = rgb[0], g = rgb[1], b = rgb[2];
  
      min = Math.min(r, Math.min(g, b));
      max = Math.max(r, Math.max(g, b));
      delta = max - min;
      l = (min + max) / 2;
  
      s = 0;
      if(l > 0 && l < 1)
        s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
  
      h = 0;
      if(delta > 0)
      {
        if (max == r && max != g) h += (g - b) / delta;
        if (max == g && max != b) h += (2 + (b - r) / delta);
        if (max == b && max != r) h += (4 + (r - g) / delta);
        h /= 6;
      }
      return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
    },
  
    rgb: function(color) {
      return [parseInt('0x' + color.substring(1, 3)), parseInt('0x' + color.substring(3, 5)),  parseInt('0x' + color.substring(5, 7))];
    }
}


/**
 * Reads Json file and apply the data to the 'names' variable
 * @param  {String} file The path of the file in the local system
 */
function readJson(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          names = JSON.parse(rawFile.responseText);
      }
  }
  rawFile.send(null);    
}
