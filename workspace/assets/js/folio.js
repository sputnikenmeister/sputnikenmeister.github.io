require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],3:[function(require,module,exports){
var conversions = require("./conversions");

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"./conversions":2}],4:[function(require,module,exports){
/* MIT license */
var colorNames = require('color-name');

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\D+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"color-name":5}],5:[function(require,module,exports){
module.exports={
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
}
},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":7,"./handlebars/exception":10,"./handlebars/no-conflict":20,"./handlebars/runtime":21,"./handlebars/safe-string":22,"./handlebars/utils":23}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.5';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":8,"./exception":10,"./helpers":11,"./logger":19,"./utils":23}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":9}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":23}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":12,"./helpers/each":13,"./helpers/helper-missing":14,"./helpers/if":15,"./helpers/log":16,"./helpers/lookup":17,"./helpers/with":18}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":23}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":10,"../utils":23}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":10}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":23}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":23}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":23}],20:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context !== depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    options.data = _base.createFrame(options.data);
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":7,"./exception":10,"./utils":23}],22:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],24:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":6}],25:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":24}],26:[function(require,module,exports){
(function (process,global){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],27:[function(require,module,exports){
var trim = require('./trim');
var decap = require('./decapitalize');

module.exports = function camelize(str, decapitalize) {
  str = trim(str).replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : '';
  });

  if (decapitalize === true) {
    return decap(str);
  } else {
    return str;
  }
};

},{"./decapitalize":30,"./trim":38}],28:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function capitalize(str, lowercaseRest) {
  str = makeString(str);
  var remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();

  return str.charAt(0).toUpperCase() + remainingChars;
};

},{"./helper/makeString":33}],29:[function(require,module,exports){
var capitalize = require('./capitalize');
var camelize = require('./camelize');
var makeString = require('./helper/makeString');

module.exports = function classify(str) {
  str = makeString(str);
  return capitalize(camelize(str.replace(/[\W_]/g, ' ')).replace(/\s/g, ''));
};

},{"./camelize":27,"./capitalize":28,"./helper/makeString":33}],30:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function decapitalize(str) {
  str = makeString(str);
  return str.charAt(0).toLowerCase() + str.slice(1);
};

},{"./helper/makeString":33}],31:[function(require,module,exports){
var escapeRegExp = require('./escapeRegExp');

module.exports = function defaultToWhiteSpace(characters) {
  if (characters == null)
    return '\\s';
  else if (characters.source)
    return characters.source;
  else
    return '[' + escapeRegExp(characters) + ']';
};

},{"./escapeRegExp":32}],32:[function(require,module,exports){
var makeString = require('./makeString');

module.exports = function escapeRegExp(str) {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

},{"./makeString":33}],33:[function(require,module,exports){
/**
 * Ensure some object is a coerced to a string
 **/
module.exports = function makeString(object) {
  if (object == null) return '';
  return '' + object;
};

},{}],34:[function(require,module,exports){
module.exports = function strRepeat(str, qty){
  if (qty < 1) return '';
  var result = '';
  while (qty > 0) {
    if (qty & 1) result += str;
    qty >>= 1, str += str;
  }
  return result;
};

},{}],35:[function(require,module,exports){
var pad = require('./pad');

module.exports = function lpad(str, length, padStr) {
  return pad(str, length, padStr);
};

},{"./pad":36}],36:[function(require,module,exports){
var makeString = require('./helper/makeString');
var strRepeat = require('./helper/strRepeat');

module.exports = function pad(str, length, padStr, type) {
  str = makeString(str);
  length = ~~length;

  var padlen = 0;

  if (!padStr)
    padStr = ' ';
  else if (padStr.length > 1)
    padStr = padStr.charAt(0);

  switch (type) {
  case 'right':
    padlen = length - str.length;
    return str + strRepeat(padStr, padlen);
  case 'both':
    padlen = length - str.length;
    return strRepeat(padStr, Math.ceil(padlen / 2)) + str + strRepeat(padStr, Math.floor(padlen / 2));
  default: // 'left'
    padlen = length - str.length;
    return strRepeat(padStr, padlen) + str;
  }
};

},{"./helper/makeString":33,"./helper/strRepeat":34}],37:[function(require,module,exports){
var pad = require('./pad');

module.exports = function rpad(str, length, padStr) {
  return pad(str, length, padStr, 'right');
};

},{"./pad":36}],38:[function(require,module,exports){
var makeString = require('./helper/makeString');
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');
var nativeTrim = String.prototype.trim;

module.exports = function trim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrim) return nativeTrim.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

},{"./helper/defaultToWhiteSpace":31,"./helper/makeString":33}],39:[function(require,module,exports){
/**
/* @module app/App
/*/
"use strict";

/** @type {module:underscore} */
var _ = require("underscore");

if (DEBUG) {
	if (/Firefox/.test(window.navigator.userAgent)) {
		console.prefix = "# ";
		var shift = [].shift;
		var logWrapFn = function() {
			if (typeof arguments[1] == "string") arguments[1] = console.prefix + arguments[1];
			return shift.apply(arguments).apply(console, arguments);
		};
		console.group = _.wrap(console.group, logWrapFn);
		console.log = _.wrap(console.log, logWrapFn);
		console.info = _.wrap(console.info, logWrapFn);
		console.warn = _.wrap(console.warn, logWrapFn);
		console.error = _.wrap(console.error, logWrapFn);
	}
	// handle error events on some platforms and production
	if (/iPad|iPhone/.test(window.navigator.userAgent)) {
		window.addEventListener("error", function() {
			var args = Array.prototype.slice.apply(arguments),
				el = document.createElement("div"),
				html = "";
			_.extend(el.style, {
				fontfamily: "monospace",
				display: "block",
				position: "absolute",
				zIndex: "999",
				backgroundColor: "white",
				color: "black",
				width: "calc(100% - 3em)",
				bottom: "0",
				margin: "1em 1.5em",
				padding: "1em 1.5em",
				outline: "0.5em solid red",
				outlineOffset: "0.5em",
				boxSizing: "border-box",
				overflow: "hidden",
			});
			html += "<pre><b>location:<b> " + window.location + "</pre>";
			html += "<pre><b>event:<b> " + JSON.stringify(args.shift(), null, " ") + "</pre>";
			if (args.length) html += "<pre><b>rest:<b> " + JSON.stringify(args, null, " ") + "</pre>";
			el.innerHTML = html;
			document.body.appendChild(el);
		});
	} else {
		if (!DEBUG) {
			window.addEventListener("error", function(ev) {
				console.error("Uncaught Error", ev);
			});
		}
	}
}

console.log("App first statement (DEBUG: %s)", DEBUG);

require("Modernizr");

require("es6-promise").polyfill();
require("classlist-polyfill");
require("raf-polyfill");
require("matches-polyfill");
require("fullscreen-polyfill");
require("math-sign-polyfill");
require("setimmediate");

/** @type {module:backbone} */
var Backbone = require("backbone");
Backbone.$ = require("backbone.native");
require("backbone.babysitter");
require("Backbone.Mutators");
require("hammerjs");

// document.addEventListener('DOMContentLoaded', function() {
// });

window.addEventListener("load", function(ev) {
	try {
		// process bootstrap data, let errors go up the stack
		require("app/model/helper/bootstrap")(window.bootstrap);
		// } catch (err) {
		// 	// document.body.innerHTML = "<h1>Oops... </h1>";
		// 	// document.documentElement.classList.remove("app-initial");
		// 	// document.documentElement.classList.add("app-error");
		// 	throw new Error("bootstrap data is missing");
	} finally {
		// detele global var
		delete window.bootstrap;
	}

	require("app/view/template/_helpers");
	// require("app/view/template/_partials");
	/** @type {module:app/view/helper/createColorStyleSheet} */
	require("app/view/helper/createColorStyleSheet").call();

	/** @type {module:app/view/AppView} */
	var AppView = require("app/view/AppView");

	/** @type {module:webfontloader} */
	var WebFont = require("webfontloader");
	WebFont.load({
		classes: false,
		custom: {
			families: [
				"Franklin Gothic FS:n4,i4,n7,i7",
				"ITCFranklinGothicStd-Compressed",
				"FolioFigures-Regular",
			],
			testStrings: {
				"FolioFigures-Regular": "hms"
			},
		},
		active: function() {
			console.log("WebFont::active");
			AppView.getInstance();
		},
		fontactive: function(familyName, variantFvd) {
			console.log("WebFont::fontactive '%s' (%s)", familyName, variantFvd);
		},
		inactive: function() {
			console.log("WebFont::inactive");
			AppView.getInstance();
		},
		fontinactive: function(familyName, variantFvd) {
			console.log("WebFont::fontinactive '%s' (%s)", familyName, variantFvd);
		},
		// loading: function() {
		// 	console.log("WebFont::loading");
		// },
		// fontloading: function(familyName, variantDesc) {
		// 	console.log("WebFont::fontloading", familyName, JSON.stringify(variantDesc, null, " "));
		// },
	});
});

},{"Backbone.Mutators":"Backbone.Mutators","Modernizr":"Modernizr","app/model/helper/bootstrap":48,"app/view/AppView":54,"app/view/helper/createColorStyleSheet":74,"app/view/template/_helpers":101,"backbone":"backbone","backbone.babysitter":"backbone.babysitter","backbone.native":"backbone.native","classlist-polyfill":"classlist-polyfill","es6-promise":"es6-promise","fullscreen-polyfill":"fullscreen-polyfill","hammerjs":"hammerjs","matches-polyfill":"matches-polyfill","math-sign-polyfill":"math-sign-polyfill","raf-polyfill":"raf-polyfill","setimmediate":26,"underscore":"underscore","webfontloader":"webfontloader"}],40:[function(require,module,exports){
/**
/* @module app/control/Controller
/*/

// /** @type {module:underscore} */
// var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");

// /** @type {module:app/model/collection/TypeCollection} */
// var types = require("app/model/collection/TypeCollection");
// /** @type {module:app/model/collection/KeywordCollection} */
// var keywords = require("app/model/collection/KeywordCollection");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

/* --------------------------- *
/* Static private
/* --------------------------- */

/**
/* @constructor
/* @type {module:app/control/Controller}
/*/
var Controller = Backbone.Router.extend({

	/** @override */
	routes: {
		"bundles/:bundleHandle(/:mediaIndex)": "toBundleItem",
		"bundles": "toBundleCollection",
		"": function() {
			this.navigate("bundles", {
				trigger: true,
				replace: true
			});
		}
	},

	/** @override */
	initialize: function(options) {},

	/* ---------------------------
	/* Public command methods
	/* --------------------------- */

	selectMedia: function(media) {
		this._goToLocation(media.get("bundle"), media);
		// this._changeSelection(media.get("bundle"), media);
		// this._updateLocation();
	},

	selectBundle: function(bundle) {
		this._goToLocation(bundle);
		// this._changeSelection(bundle);
		// this._updateLocation();
	},

	deselectMedia: function() {
		this._goToLocation(bundles.selected);
		// this._changeSelection(bundles.selected);
		// this._updateLocation();
	},

	deselectBundle: function() {
		this._goToLocation();
		// this._changeSelection();
		// this._updateLocation();
	},

	/** Update location when navigation happens internally */
	_updateLocation: function() {
		var bundle, media;
		bundle = bundles.selected;
		if (bundle) {
			media = bundle.get("media").selected;
		}
		this.navigate(this._getLocation(bundle, media), {
			trigger: false
		});
	},

	_getLocation: function(bundle, media) {
		var mediaIndex, location = [];
		location.push("bundles");
		if (bundle) {
			location.push(bundle.get("handle"));
			if (media) {
				mediaIndex = bundle.get("media").indexOf(media);
				if (mediaIndex >= 0) {
					location.push(mediaIndex);
				}
			}
		}
		// location.push("");
		return location.join("/");
	},

	_goToLocation: function(bundle, media) {
		this.navigate(this._getLocation(bundle, media), {
			trigger: true
		});
	},

	/* --------------------------- *
	/* Router handlers (browser address changes)
	/* --------------------------- */

	toBundleItem: function(bundleHandle, mediaIndex) {
		var bundle, media;
		bundle = bundles.findWhere({
			handle: bundleHandle
		});
		if (!bundle) {
			throw new Error("Cannot find bundle with handle \"" + bundleHandle + "\"");
		}
		if (mediaIndex) {
			media = bundle.get("media").at(mediaIndex);
			if (!media) {
				throw new Error("No media at index " + mediaIndex + " bundle with handle \"" + bundleHandle + "\"");
			}
		}
		this._changeSelection(bundle, media);
	},

	toBundleCollection: function() {
		this._changeSelection();
	},

	/* -------------------------------
	/* Select Bundle/media
	/* ------------------------------- */

	/*
	/* NOTE: Selection order
	/* - Apply media selection to *incoming bundle*, as not to trigger
	/*	unneccesary events on an outgoing bundle. Outgoing bundle media selection
	/*	remains untouched.
	/* - Apply media selection *before* selecting the incoming bundle. Views
	/*	normally listen to the selected bundle only, so if the bundle is changing,
	/*	they will not be listening to media selection changes yet.
	/*/
	_changeSelection: function(bundle, media) {
		if (bundle === void 0) bundle = null;
		if (media === void 0) media = null;

		var lastBundle = bundles.selected;
		var lastMedia = lastBundle ? lastBundle.get("media").selected : null;

		console.log("controller::_changeSelection bundle:[%s => %s] media:[%s => %s]",
			(lastBundle ? lastBundle.cid : lastBundle), (bundle ? bundle.cid : bundle),
			(lastMedia ? lastMedia.cid : lastMedia), (media ? media.cid : bundle)
		);

		if (lastBundle === bundle && lastMedia === media) {
			return;
		}

		this.trigger("change:before", bundle, media);

		bundle && bundle.get("media").select(media);
		bundles.select(bundle);

		this.trigger("change:after", bundle, media);
	},
});

module.exports = new Controller();

},{"app/model/collection/BundleCollection":45,"backbone":"backbone"}],41:[function(require,module,exports){
/**
/* @module app/control/Globals
/*/
/** @type {module:underscore} */
var _ = require("underscore");

module.exports = (function() {
	// reusable vars
	var o, s, so;
	// global hash
	var g = {};
	// SASS <--> JS shared hash
	var sass = require("../../../sass/variables.json");

	// JUNK FIRST: Some app-wide defaults
	// - - - - - - - - - - - - - - - - -
	g.VPAN_DRAG = 0.95; // as factor of pointer delta
	g.HPAN_OUT_DRAG = 0.4; // factor
	g.VPAN_OUT_DRAG = 0.1; // factor
	g.PAN_THRESHOLD = 15; // px
	g.COLLAPSE_THRESHOLD = 75; // px
	g.COLLAPSE_OFFSET = parseInt(sass.temp["collapse_offset"]);

	// breakpoints
	// - - - - - - - - - - - - - - - - -
	g.BREAKPOINTS = {};
	for (s in sass.breakpoints) {
		g.BREAKPOINTS[s] = window.matchMedia(sass.breakpoints[s]);
	}

	// base colors, dimensions
	// - - - - - - - - - - - - - - - - -
	g.LAYOUT_NAMES = _.clone(sass.layout_names);
	g.DEFAULT_COLORS = _.clone(sass.default_colors);
	g.HORIZONTAL_STEP = parseFloat(sass.units["hu_px"]);
	g.VERTICAL_STEP = parseFloat(sass.units["vu_px"]);


	// paths, networking
	// - - - - - - - - - - - - - - - - -
	g.APP_ROOT = window.approot;
	g.MEDIA_DIR = window.mediadir;

	delete window.approot;
	delete window.mediadir;

	// hardcoded font data
	// - - - - - - - - - - - - - - - - -
	g.FONT_METRICS = {
		"Franklin Gothic FS": {
			"unitsPerEm": 1000,
			"ascent": 827,
			"descent": -173
		},
		"ITCFranklinGothicStd": {
			"unitsPerEm": 1000,
			"ascent": 686,
			"descent": -314
		},
		"FolioFigures": {
			"unitsPerEm": 1024,
			"ascent": 939,
			"descent": -256
		},
	};

	g.PAUSE_CHAR = String.fromCharCode(0x23F8);
	g.PLAY_CHAR = String.fromCharCode(0x23F5);
	g.STOP_CHAR = String.fromCharCode(0x23F9);

	// timing, easing
	// - - - - - - - - - - - - - - - - -
	g.TRANSITION_DELAY_INTERVAL = parseFloat(sass.transitions["delay_interval_ms"]);
	g.TRANSITION_DURATION = parseFloat(sass.transitions["duration_ms"]);
	g.TRANSITION_MIN_DELAY = parseFloat(sass.transitions["min_delay_ms"]);
	g.TRANSITION_EASE = sass.transitions["ease"];
	g.TRANSITION_DELAY = g.TRANSITION_DURATION + g.TRANSITION_DELAY_INTERVAL;

	// css transition presets
	// TODO: get rid of this
	// - - - - - - - - - - - - - - - - -
	var txDur = g.TRANSITION_DURATION,
		txDelay = g.TRANSITION_DELAY,
		txIntDelay = g.TRANSITION_DELAY_INTERVAL,
		txMinDelay = g.TRANSITION_MIN_DELAY;

	o = {};

	o.NONE = {
		delay: 0,
		duration: 0,
		easing: "step-start"
	};
	o.NOW = {
		delay: 0,
		duration: txDur,
		easing: g.TRANSITION_EASE
	};
	o.UNSET = _.defaults({
		cssText: ""
	}, o.NONE);

	var txAligned = _.defaults({
		duration: txDur - txMinDelay
	}, o.NOW);
	o.FIRST = _.defaults({
		delay: txDelay * 0.0 + txMinDelay
	}, txAligned);
	o.BETWEEN = _.defaults({
		delay: txDelay * 1.0 + txMinDelay
	}, txAligned);
	o.LAST = _.defaults({
		delay: txDelay * 2.0 + txMinDelay
	}, txAligned);
	o.AFTER = _.defaults({
		delay: txDelay * 2.0 + txMinDelay
	}, txAligned);

	o.BETWEEN_EARLY = _.defaults({
		delay: txDelay * 1 + txMinDelay - 60
	}, txAligned);
	o.BETWEEN_LATE = _.defaults({
		delay: txDelay * 1 + txMinDelay + 60
	}, txAligned);

	o.FIRST_LATE = _.defaults({
		delay: txDelay * 0.5 + txMinDelay
	}, txAligned);
	o.LAST_EARLY = _.defaults({
		delay: txDelay * 1.5 + txMinDelay
	}, txAligned);
	// o.FIRST_LATE = 		_.defaults({delay: txDelay*0.0 + txMinDelay*2}, txAligned);
	// o.LAST_EARLY = 		_.defaults({delay: txDelay*2.0 + txMinDelay*0}, txAligned);
	// o.AFTER = 			_.defaults({delay: txDelay*2.0 + txMinDelay}, txAligned);

	console.group("transitions");
	for (s in o) {
		so = o[s];
		so.name = s;
		so.className = "tx-" + s.replace("_", "-").toLowerCase();
		if (!so.hasOwnProperty("cssText")) {
			so.cssText = so.duration / 1000 + "s " + so.easing + " " + so.delay / 1000 + "s";
		}
		console.log("%s: %s", so.name, so.cssText);
	}
	console.groupEnd();
	g.transitions = o;

	return g;
}());

},{"../../../sass/variables.json":119,"underscore":"underscore"}],42:[function(require,module,exports){
/**
 * @module app/model/BaseItem
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Backbone = require("backbone");

var AppState = Backbone.Model.extend({
	defaults: {
		bundle: null,
		withBundle: false,
		media: null,
		withMedia: false,
		collapsed: false,
		layoutName: "default-layout"
	},

	// /** @type {module:app/model/collection/TypeCollection} */
	// types: require("app/model/collection/TypeCollection"),
	// /** @type {module:app/model/collection/KeywordCollection} */
	// keywords: require("app/model/collection/KeywordCollection"),
	// /** @type {module:app/model/collection/BundleCollection} */
	// bundles: require("app/model/collection/BundleCollection"),
});

// Object.defineProperties(AppState.prototype, {
// 	types: { value: require("app/model/collection/TypeCollection") },
// 	keywords: { value: require("app/model/collection/KeywordCollection") },
// 	bundles: { value: require("app/model/collection/BundleCollection") },
// })

// module.exports = new AppState();
module.exports = AppState;

},{"backbone":"backbone"}],43:[function(require,module,exports){
/**
 * @module app/model/BaseItem
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Model = require("backbone").Model;
/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/utils/strings/stripTags} */
var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/model/parseSymAttrs} */
//var parseSymAttrs = require("app/model/parseSymAttrs");

var parseSymAttrs = function(s) {
	return s.replace(/(\,|\;)/g, function(m) {
		return (m == ",") ? ";" : ",";
	});
};
var toAttrsHash = function(obj, attr) {
	if (_.isString(attr)) {
		var idx = attr.indexOf(":");
		if (idx > 0) {
			obj[attr.substring(0, idx)] = parseSymAttrs(attr.substring(idx + 1));
		} else {
			obj[attr] = attr; // to match HTML5<>XHTML valueless attributes
		}
	} // else ignore non-string values
	return obj;
};

var BaseItemProto = {

	_domPrefix: "_",

	/** @type {Object} */
	defaults: {
		// attrs: function() { return {}; },
		get attrs() {
			return {};
		},
	},

	getters: ["domid"],

	mutators: {
		domid: function() {
			return this._domId || (this._domId = this._domPrefix + this.id);
		},
		attrs: {
			set: function(key, value, options, set) {
				if (Array.isArray(value)) {
					value = value.reduce(toAttrsHash, {});
				}
				if (!_.isObject(value)) {
					console.error("%s::attrs value not an object or string array", this.cid, value);
					value = {};
				}
				set(key, value, options);
			}
		},
	},

	attr: function(attr) {
		return this.attrs()[attr];
	},

	attrs: function() {
		return this.get("attrs");
	},

	toString: function() {
		return this.get("domid");
	}
};

var BaseItem = {
	extend: function(proto, obj) {
		var constr, propName, propDef;
		for (propName in proto) {
			if (proto.hasOwnProperty(propName) && _.isObject(proto[propName])) { //(Object.getPrototypeOf(proto[propName]) === Object.prototype)) {
				_.defaults(proto[propName], BaseItemProto[propName]);
				// console.log("BaseItem::extend '%s:%s' is Object\n%s", proto._domPrefix, p, JSON.stringify(proto[p]));
			}
		}
		// if (proto.properties && this.prototype.properties) {
		// 	_.defaults(proto.properties, this.prototype.properties);
		// }
		constr = Model.extend.apply(this, arguments);

		if (Array.isArray(constr.prototype.getters)) {
			constr.prototype.getters.forEach(function(getterName) {
				Object.defineProperty(constr.prototype, getterName, {
					enumerable: true,
					get: function() {
						return this.get(getterName);
					}
				});
			});
		}
		// if (_.isObject(proto.properties)) {
		// 	for (propName in proto.properties) {
		// 		if (proto.properties.hasOwnProperty(propName)) {
		// 			propDef = proto.properties[propName];
		// 			if (_.isFunction(propDef)) {
		// 				proto.properties[propName] = {
		// 					enumerable: true, get: propDef
		// 				};
		// 			} else if (_.isObject(propDef)){
		// 				propDef.enumerable = true;
		// 			} else {
		// 				delete proto.properties[propName];
		// 			}
		// 		}
		// 	}
		// 	Object.defineProperties(proto, proto.properties);
		// 	delete proto.properties;
		// }
		return constr;
	}
};

/**
 * @constructor
 * @type {module:app/model/BaseItem}
 */
module.exports = BaseItem.extend.call(Model, BaseItemProto, BaseItem);
// module.exports = Model.extend(BaseItemProto, BaseItem);

},{"app/control/Globals":41,"backbone":"backbone","underscore":"underscore","utils/strings/stripTags":117}],44:[function(require,module,exports){
/**
 * @module app/model/SelectableCollection
 */

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");

/**
 * @constructor
 * @type {module:app/model/SelectableCollection}
 */
var SelectableCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		options = _.defaults({}, options, {
			initialSelection: "none",
			silentInitial: true
		});
		this.initialSelection = options.initialSelection;
		this.initialOptions = {
			silent: options.silentInitial
		};
	},

	reset: function(models, options) {
		this.deselect(this.initialOptions);
		Backbone.Collection.prototype.reset.apply(this, arguments);
		if (this.initialSelection === "first" && this.length) {
			this.select(this.at(0), this.initialOptions);
		}
	},

	select: function(newModel, options) {
		if (newModel === void 0) {
			newModel = null;
		}
		if (this.selected === newModel) {
			return;
		}
		var triggerEvents = !(options && options.silent);
		var oldModel = this.selected;

		this.lastSelected = this.selected;
		this.lastSelectedIndex = this.selectedIndex;
		this.selected = newModel;
		this.selectedIndex = this.indexOf(newModel);

		if (oldModel) {
			if (_.isFunction(oldModel.deselect)) {
				oldModel.deselect(options);
			} else if (triggerEvents) {
				oldModel.selected = void 0;
				oldModel.trigger("deselected", newModel, oldModel);
			}
			if (triggerEvents) this.trigger("deselect:one", oldModel);
		} else {
			if (triggerEvents) this.trigger("deselect:none", null);
		}

		if (newModel) {
			if (_.isFunction(newModel.select)) {
				newModel.select(options);
			} else if (triggerEvents) {
				newModel.selected = true;
				newModel.trigger("selected", newModel, oldModel);
			}
			if (triggerEvents) this.trigger("select:one", newModel);
		} else {
			if (triggerEvents) this.trigger("select:none", null);
		}
	},

	deselect: function(options) {
		this.select(null, options);
	},

	selectAt: function(index, options) {
		if (0 > index || index >= this.length) {
			new RangeError("index is out of bounds");
		}
		this.select(this.at(index), options);
	},

	distance: function(a, b) {
		var aIdx, bIdx;

		if (!a) return NaN;
		aIdx = this.indexOf(a);
		if (aIdx == -1) return NaN;

		if (arguments.length == 1) {
			bIdx = this.selectedIndex;
		} else {
			if (!b) return NaN;
			bIdx = this.indexOf(b);
			if (bIdx == -1) return NaN;
		}
		return Math.abs(bIdx - aIdx);
	},

	/* TODO: MOVE INTO MIXIN */

	/** @return boolean	/*/
	hasFollowing: function(model) {
		model || (model = this.selected);
		return this.indexOf(model) < (this.length - 1);
	},

	/** @return next model	*/
	following: function(model) {
		model || (model = this.selected);
		return this.hasFollowing(model) ? this.at(this.indexOf(model) + 1) : null;
	},

	/** @return next model or the beginning if at the end */
	followingOrFirst: function(model) {
		model || (model = this.selected);
		return this.at((this.indexOf(model) + 1) % this.length);
	},

	/** @return boolean	/*/
	hasPreceding: function(model) {
		model || (model = this.selected);
		return this.indexOf(model) > 0;
	},

	/** @return the previous model */
	preceding: function(model) {
		model || (model = this.selected);
		return this.hasPreceding(model) ? this.at(this.indexOf(model) - 1) : null;
	},

	/** @return the previous model or the end if at the beginning */
	precedingOrLast: function(model) {
		model || (model = this.selected);
		var index = this.indexOf(model) - 1;
		return this.at(index > -1 ? index : this.length - 1);
	},

});

module.exports = SelectableCollection;

},{"backbone":"backbone","underscore":"underscore"}],45:[function(require,module,exports){
/**
 * @module app/model/collection/BundleCollection
 * @requires module:backbone
 */

/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/model/item/BundleItem} */
var BundleItem = require("app/model/item/BundleItem");

/**
 * @constructor
 * @type {module:app/model/collection/List}
 */
var BundleCollection = SelectableCollection.extend({

	/** @type {Backbone.Model} */
	model: BundleItem,

	/** @type {Function} */
	comparator: function(oa, ob) {
		var a = oa.get("completed");
		var b = ob.get("completed");
		if (a > b) {
			return -1;
		} else if (a < b) {
			return 1;
		} else {
			return 0;
		}
	},

	/** @type {String} */
	url: "/json/bundles/",

});

module.exports = new BundleCollection();

},{"app/model/SelectableCollection":44,"app/model/item/BundleItem":49}],46:[function(require,module,exports){
/**
 * @module app/model/collection/KeywordCollection
 * @requires module:backbone
 */

/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/model/item/KeywordItem} */
var KeywordItem = require("app/model/item/KeywordItem");

/**
 * @constructor
 * @type {module:app/model/collection/KeywordCollection}
 */
var KeywordCollection = SelectableCollection.extend({

	/** @type {Backbone.Model} */
	model: KeywordItem

});

module.exports = new KeywordCollection();

},{"app/model/SelectableCollection":44,"app/model/item/KeywordItem":50}],47:[function(require,module,exports){
/**
 * @module app/model/collection/TypeCollection
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Backbone = require("backbone");

/** @type {module:app/model/item/TypeItem} */
var TypeItem = require("app/model/item/TypeItem");

/**
 * @constructor
 * @type {module:app/model/collection/TypeCollection}
 */
var TypeCollection = Backbone.Collection.extend({

	/** @type {Backbone.Model} */
	model: TypeItem

});

module.exports = new TypeCollection();

},{"app/model/item/TypeItem":53,"backbone":"backbone"}],48:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:app/model/collection/TypeCollection} */
var typeList = require("app/model/collection/TypeCollection");
/** @type {module:app/model/collection/KeywordCollection} */
var keywordList = require("app/model/collection/KeywordCollection");
/** @type {module:app/model/collection/BundleCollection} */
var bundleList = require("app/model/collection/BundleCollection");

module.exports = function(bootstrap) {
	// Fix-ups to bootstrap data.

	var types = bootstrap["types-all"];
	var keywords = bootstrap["keywords-all"];
	var bundles = bootstrap["bundles-all"];
	var media = bootstrap["media-all"];

	// Attach media to their bundles
	var mediaByBundle = _.groupBy(media, "bId");

	// Fill-in back-references:
	// Create Keyword.bundleIds from existing Bundle.keywordIds,
	// then Bundle.typeIds from unique Keyword.typeId

	// _.each(bundles, function (bo, bi, ba) {
	bundles.forEach(function(bo, bi, ba) {
		bo.tIds = [];
		bo.media = mediaByBundle[bo.id];
		// _.each(keywords, function (ko, ki, ka) {
		keywords.forEach(function(ko, ki, ka) {
			if (bi === 0) {
				ko.bIds = [];
			}
			// if (_.contains(bo.kIds, ko.id)) {
			if (bo.kIds.indexOf(ko.id) != -1) {
				ko.bIds.push(bo.id);
				// if (!_.contains(bo.tIds, ko.tId)) {
				if (bo.tIds.indexOf(ko.tId) == -1) {
					bo.tIds.push(ko.tId);
				}
			}
		});
	});

	// Fill collection singletons
	typeList.reset(types);
	keywordList.reset(keywords);
	bundleList.reset(bundles);
};

},{"app/model/collection/BundleCollection":45,"app/model/collection/KeywordCollection":46,"app/model/collection/TypeCollection":47,"underscore":"underscore"}],49:[function(require,module,exports){
/**
 * @module app/model/item/BundleItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");

/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");
/** @type {module:app/model/item/MediaItem} */
var MediaItem = require("app/model/item/MediaItem");
/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/utils/strings/stripTags} */
var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/utils/strings/parseTaglist} */
// var parseSymAttrs = require("app/model/parseSymAttrs");

// /** @type {module:app/model/collection/KeywordCollection} */
// var keywords = require("app/model/collection/KeywordCollection");

// Globals.DEFAULT_COLORS["color"];
// Globals.DEFAULT_COLORS["background-color"];
var attrsDefault = _.defaults({
	"has-colors": "defaults"
}, Globals.DEFAULT_COLORS);

/** @private */
var MediaCollection = SelectableCollection.extend({
	model: MediaItem,
	comparator: "o"
});

/**
 * @constructor
 * @type {module:app/model/item/BundleItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "b",

	/** @type {Object|Function} */
	// defaults: function() {
	// 	return {
	// 		name: "",
	// 		handle: "",
	// 		desc: "",
	// 		completed: 0,
	// 		kIds: [],
	// 	};
	// },
	defaults: {
		name: "",
		handle: "",
		desc: "",
		completed: 0,
		get kIds() {
			return [];
		},
		// get keywords() { return []; },
	},

	getters: ["name", "media"],

	mutators: {
		text: function() {
			return stripTags(this.get("desc"));
		},
		// kIds: {
		// 	set: function (key, value, options, set) {
		// 		if (Array.isArray(value)) {
		// 			set("keywords", value.map(function(id) {
		// 				var obj = keywords.get(id);
		// 				return obj;
		// 			}, this), options;
		// 		}
		// 		set(key, value, options);
		// 	},
		// },
		media: {
			transient: true,
			set: function(key, value, options, set) {
				if (Array.isArray(value)) {
					value.forEach(function(o) {
						o.bundle = this;
					}, this);
					value = new MediaCollection(value);
				}
				set(key, value, options);
			},
		},
	},

	initialize: function(attrs, options) {
		this.colors = {
			fgColor: new Color(this.attr("color")),
			bgColor: new Color(this.attr("background-color")),
			lnColor: new Color(this.attr("--link-color")),
		};
		this.colors.hasDarkBg = this.colors.fgColor.luminosity() > this.colors.bgColor.luminosity();
	},

	attrs: function() {
		return this._attrs || (this._attrs = _.defaults({}, this.get("attrs"), attrsDefault));
	},
});

},{"app/control/Globals":41,"app/model/BaseItem":43,"app/model/SelectableCollection":44,"app/model/item/MediaItem":51,"color":"color","underscore":"underscore","utils/strings/stripTags":117}],50:[function(require,module,exports){
/**
 * @module app/model/item/KeywordItem
 * @requires module:app/model/BaseItem
 */

/** @type {module:app/model/BaseItem} */
var BaseItem = require("app/model/BaseItem");

// /** @type {module:app/model/collection/TypeCollection} */
// var types = require("app/model/collection/TypeCollection");

/**
 * @constructor
 * @type {module:app/model/item/KeywordItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "k",

	/** @type {Object} */
	defaults: {
		name: "",
		handle: "",
		tId: -1,
	},

	// mutators: {
	// 	tId: {
	// 		set: function (key, value, options, set) {
	// 			var type = types.get(value);
	// 			if (type) {
	// 				type.get("keywords").push(this);
	// 				set("type", type, options);
	// 			}
	// 			set(key, value, options);
	// 		}
	// 	},
	// }
});

},{"app/model/BaseItem":43}],51:[function(require,module,exports){
/**
 * @module app/model/item/MediaItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");

/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");
/** @type {module:app/model/item/SourceItem} */
var SourceItem = require("app/model/item/SourceItem");
/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/utils/strings/stripTags} */
var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/model/parseSymAttrs} */
// var parseSymAttrs = require("app/model/parseSymAttrs");

var urlTemplates = {
	"original": _.template(Globals.MEDIA_DIR + "/<%= src %>"),
	"constrain-width": _.template(Globals.APP_ROOT + "image/1/<%= width %>/0/uploads/<%= src %>"),
	"constrain-height": _.template(Globals.APP_ROOT + "image/1/0/<%= height %>/uploads/<%= src %>"),
	"debug-bandwidth": _.template(Globals.MEDIA_DIR.replace(/(https?\:\/\/[^\/]+)/, "$1/slow/<%= kbps %>") + "/<%= src %>"),
};

/**
 * @constructor
 * @type {module:app/model/item/MediaItem.SourceCollection}
 */
var SourceCollection = SelectableCollection.extend({
	model: SourceItem
});

/**
 * @constructor
 * @type {module:app/model/item/MediaItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "m",

	/** @type {Object} */
	defaults: {
		name: "<p><em>Untitled</em></p>",
		o: 0,
		bId: -1,
		srcIdx: 0,
		get srcset() {
			return [];
		},
		get sources() {
			return new SourceCollection();
		},
	},

	getters: ["name", "bundle", "source", "sources"],

	mutators: {
		desc: function() {
			return this.get("name");
		},
		handle: function() {
			return this.get("src");
		},
		text: function() {
			return stripTags(this.get("name"));
		},
		attrs: {
			set: function(key, value, opts, set) {
				this._attrs = null;
				BaseItem.prototype.mutators.attrs.set.apply(this, arguments);
				this._updateSources();
			}
		},
		srcset: {
			set: function(key, value, opts, set) {
				set(key, value, opts);
				this.get("sources").reset(value, opts);
				this._updateSources();
			}
		},
		source: {
			transient: true,
			get: function() {
				return this.get("sources").at(this.get("srcIdx"));
			},
		},
	},

	initialize: function() {
		this._updateColors();
		this.listenTo(this, "change:attrs change:bundle", function() {
			this._attrs = null;
		});
	},

	attrs: function() {
		return this._attrs || (this._attrs = _.defaults({}, this.get("bundle").attrs(), this.get("attrs")));
	},

	_updateColors: function() {
		this.colors = {
			fgColor: new Color(this.attr("color")),
			bgColor: new Color(this.attr("background-color"))
		};
		this.colors.hasDarkBg = this.colors.fgColor.luminosity() > this.colors.bgColor.luminosity();
	},

	_updateSources: function() {
		var srcObj = {
			kbps: this.attr("@debug-bandwidth")
		};
		var srcTpl = urlTemplates[srcObj.kbps ? "debug-bandwidth" : "original"];
		this.get("sources").forEach(function(item) {
			srcObj.src = item.get("src");
			item.set("original", srcTpl(srcObj));
		});
	},

	// _updateSourcesArr: function() {
	// 	var srcset = this.get("srcset");
	// 	if (Array.isArray(srcset)) {
	// 		var srcObj = { kbps: this.attr("@debug-bandwidth") };
	// 		var srcTpl = Globals.MEDIA_SRC_TPL[srcObj.kbps? "debug-bandwidth" : "original"];
	// 		srcset.forEach(function(o) {
	// 			srcObj.src = o.src;
	// 			o.original = srcTpl(srcObj);
	// 		}, this);
	// 	}
	// 	this.get("sources").reset(srcset);
	// },

});

},{"app/control/Globals":41,"app/model/BaseItem":43,"app/model/SelectableCollection":44,"app/model/item/SourceItem":52,"color":"color","underscore":"underscore","utils/strings/stripTags":117}],52:[function(require,module,exports){
/**
 * @module app/model/item/SourceItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");

/** @type {String} */
var noCacheSuffix = "?" + Date.now();

/**
 * @constructor
 * @type {module:app/model/item/SourceItem}
 */
// module.exports = Backbone.Model.extend({
module.exports = BaseItem.extend({

	/** @type {Object} */
	defaults: {
		src: null,
		mime: null,
		w: null,
		h: null,
	},

	getters: ["src", "original"],

	mutators: {
		src: {
			set: function(key, value, options, set) {
				if (DEBUG) {
					value += noCacheSuffix;
				}
				set(key, value, options);
			}
		},
		// original: { 
		// 	transient: true,
		// 	get: function (key, value, options, set) {
		// 		return this.attributes.original || (this.attributes.original = this._composeOriginalSrc());
		// 	},
		// },
		// media: {
		// 	transient: true,
		// 	get: function () {
		// 		var retval;
		// 		if (this._noRecusion) {
		// 			console.log("%s::media returning null", this.cid);
		// 			retval = null;//this.id;
		// 		} else {
		// 			console.log("%s::media returning Object", this.cid);
		// 			this._noRecusion = true;
		// 			retval = this.attributes.media;
		// 			this._noRecusion = false;
		// 		}
		// 		return retval;
		// 	},
		// 	set: function (key, value, options, set) {
		// 		if (value instanceof BaseItem) {
		// 			set(key, value, options);
		// 		}
		// 	},
		// },
	},

	// initialize: function() {
	// 	if (DEBUG) {
	// 		var cb = function() {
	// 			// console.log("@debug-bandwidth:", JSON.stringify(this.get("media").attr("@debug-bandwidth")));
	// 			console.log("media:", JSON.stringify(this.toJSON()));
	// 			// if ((this.get("media") instanceof BaseItem) && this.get("media").attr("@debug-bandwidth")) {
	// 			// 	console.log("original", this.get("original"));
	// 			// 	console.log("media:", JSON.stringify(this.get("media").toJSON()));
	// 			// }
	// 		}.bind(this);
	// 		window.requestAnimationFrame(cb);
	// 	}
	// },
	// 
	// _composeOriginalSrc: function() {
	// 	var values = { src: this.get("src") };
	// 	if (this.has("media") && (values.kbps = this.get("media").attr("@debug-bandwidth"))) {
	// 	// if (this.has("media") && this.get("media").attrs().hasOwnProperty("@debug-bandwidth")) {
	// 	// 	values.kbps = this.get("media").attrs()["@debug-bandwidth"];
	// 		return Globals.MEDIA_SRC_TPL["debug-bandwidth"](values);
	// 	}
	// 	return Globals.MEDIA_SRC_TPL["original"](values);
	// },
});

},{"app/model/BaseItem":43}],53:[function(require,module,exports){
/**
 * @module app/model/item/TypeItem
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");

/**
 * @constructor
 * @type {module:app/model/item/TypeItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "t",

	/** @type {Object} */
	defaults: {
		name: "",
		handle: "",
		// get kIds() { return []; },
		// get keywords() { return []; },
	},

});

},{"app/model/BaseItem":43}],54:[function(require,module,exports){
/**
/* @module app/view/AppView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");
// /** @type {Function} */
// var Color = require("color");

/** @type {module:app/utils/debug/traceArgs} */
var stripTags = require("utils/strings/stripTags");
// /** @type {Function} */
// var prefixedProperty = require("utils/prefixedProperty");
// /** @type {Function} */
// var prefixedEvent = require("utils/prefixedEvent");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");
/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/AppState} */
var AppState = require("app/model/AppState");
// /** @type {module:app/model/collection/BundleCollection} */
// var bundles = require("app/model/collection/BundleCollection");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/NavigationView} */
var NavigationView = require("app/view/NavigationView");
/** @type {module:app/view/ContentView} */
var ContentView = require("app/view/ContentView");

var AppView = {
	getInstance: function() {
		if (!(window.app instanceof this)) {
			window.app = new(this)({
				model: new AppState()
			});
		}
		return window.app;
	}
};

var AppViewProto = {

	/** @override */
	cidPrefix: "app",
	/** @override */
	el: "body",
	/** @override */
	className: "without-bundle without-media",
	/** @override */
	model: AppState,

	/** @override */
	events: {
		"visibilitychange": function(ev) {
			console.log(ev.type);
		},
		"fullscreenchange": function(ev) {
			console.log(ev.type);
		},
	},

	/** @override */
	initialize: function(options) {
		// document.documentElement.classList.toggle("desktop-small", Globals.BREAKPOINTS["desktop-small"].matches);
		/* sync to docValue, so previous value is up-to-date on change */
		var docValue = _.find(Globals.LAYOUT_NAMES, function(s) {
			return document.body.classList.contains(s);
		});
		if (docValue && (docValue !== this.model.get("layoutName"))) {
			this.model.set("layoutName", docValue, { silent: true });
		}

		/* prevent touch overscroll on iOS */
		document.addEventListener("touchmove", function(ev) {
			ev.preventDefault();
		}, false);
		/* create single hammerjs manager */
		this.touch = TouchManager.init(this.el); //document.body);//document.querySelector("#container")

		/* render on resize, onorientationchange, visibilitychange */
		this._onResize = this._onResize.bind(this); // _.bindAll(this, "_onResize");
		window.addEventListener("orientationchange", this._onResize, false);
		window.addEventListener("resize", _.debounce(this._onResize, 100, false /* immediate? */ ), false);

		/* initialize controller/model listeners BEFORE views register their own */
		this.listenTo(controller, "change:after", this._afterControllerChanged);
		this.listenTo(this.model, "change", this._onModelChange); /* FIXME */

		/* initialize views */
		this.navigationView = new NavigationView({
			el: "#navigation",
			model: this.model
		});
		this.contentView = new ContentView({
			el: "#content",
			model: this.model
		});

		/* startup listener */
		this.listenToOnce(controller, "route", this._appStart);
		// start router, which will request appropiate state
		Backbone.history.start({
			pushState: false,
			hashChange: true
		});
	},

	/* -------------------------------
	/* _appStart
	/* ------------------------------- */

	_appStart: function() {
		console.log("%s::_appStart", this.cid, arguments[0]);
		this._appStartChanged = true;
		this.requestRender(View.MODEL_INVALID | View.SIZE_INVALID);
	},

	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_afterControllerChanged: function(bundle, media) {
		/* update model on controller event */
		console.log("%s::[controller change:after]", this.cid);
		this.model.set({
			bundle: bundle || null,
			withBundle: !!bundle,
			media: media || null,
			withMedia: !!media,
			collapsed: !!bundle // reset collapsed on bundle change
		});
	},

	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_onModelChange: function() {
		console.group(this.cid + "::_onModelChange changed:");
		Object.keys(this.model.changedAttributes()).forEach(function(key) {
			console.info("%s: %s -> %s", key, this.model.previous(key), this.model.get(key));
		}, this);
		console.groupEnd();

		// var changelog = Object.keys(this.model.changedAttributes()).reduce(
		// 	function(obj, key, idx, arr) {
		// 		obj[key] = [this.model.previous(key), this.model.get(key)].join(" -> ");
		// 		return obj;
		// 	}.bind(this), {});
		// var changelog = Object.keys(this.model.changedAttributes()).map(
		// 	function(key, idx, arr) {
		// 		return key + ": " + this.model.previous(key) + " -> " + this.model.get(key);
		// 	}, this);
		// console.info("%s::_onModelChange changed: %o", this.cid, changelog);

		if (this.model.hasChanged("bundle") || this.model.hasChanged("media")) {
			this.requestRender(View.MODEL_INVALID);
		}
	},

	/* -------------------------------
	/* resize
	/* ------------------------------- */

	_onResize: function() {
		console.log("%s::_onResize", this.cid);
		this.requestRender(View.SIZE_INVALID).renderNow();
	},

	/* -------------------------------
	/* render
	/* ------------------------------- */

	renderFrame: function(tstamp, flags) {
		if (flags & View.MODEL_INVALID) {
			this.renderModelChange();
		}
		if (flags & View.SIZE_INVALID) {
			this.renderResize();
		}
		if (this._appStartChanged) {
			this._appStartChanged = false;
			this.requestAnimationFrame(this.renderAppStart);
		}
	},

	renderAppStart: function() {
		console.log("%s::renderAppStart", this.cid);
		document.documentElement.classList.remove("app-initial");
		document.body.classList.remove("app-initial");
		// document.documentElement.classList.add("app-ready");
	},

	renderResize: function() {
		document.body.scrollTop = 0;
		_.each(Globals.BREAKPOINTS, function(o, s) {
			this.toggle(s, o.matches);
		}, document.body.classList);

		// var bb = _.filter(_.keys(Globals.BREAKPOINTS), function(s) {
		// 	return this.contains(s);
		// }, document.body.classList).join();
		// console.log("%s::renderResize matches: %s", this.cid, bb);

		// document.body.classList.toggle("tablet-portrait", Globals.BREAKPOINTS["tablet-portrait"].matches);
		// document.body.classList.toggle("desktop-small", Globals.BREAKPOINTS["desktop-small"].matches);

		this.requestChildrenRender(View.SIZE_INVALID, true);

		// var ccid, view;
		// for (ccid in this.childViews) {
		// 	view = this.childViews[ccid];
		// 	view.skipTransitions = true;
		// 	// view.invalidateSize();
		// 	// view.renderNow();
		// 	view.requestRender(View.SIZE_INVALID).renderNow();
		// }
	},

	/* -------------------------------
	/* body classes etc
	/* ------------------------------- */

	// _controllerChanged: true,

	renderModelChange: function() {
		console.log("%s::renderModelChange", this.cid);

		var bundle = this.model.get("bundle");
		var media = this.model.get("media");

		this.updateDocumentTitle(bundle, media);
		this.updateClassList(bundle, media);
	},

	updateDocumentTitle: function(bundle, media) {
		// Set browser title
		var docTitle = "Portfolio";
		if (bundle) {
			docTitle += " - " + stripTags(bundle.get("name"));
			if (media) {
				docTitle += ": " + stripTags(media.get("name"));
			}
		}
		document.title = docTitle;
	},

	updateClassList: function(bundle, media) {
		// classList target
		var cls = this.el.classList;
		var prevAttr = null;
		// var hasDarkBg = false;

		// Set state classes
		cls.toggle("with-bundle", !!bundle);
		cls.toggle("without-bundle", !bundle);
		cls.toggle("with-media", !!media);
		cls.toggle("without-media", !media);
		// if (this.model.hasChanged("withBundle")) {
		// 	cls.toggle("with-bundle", this.model.get("withBundle"));
		// 	cls.toggle("without-bundle", !this.model.get("withBundle"));
		// }
		// if (this.model.hasChanged("withMedia")) {
		// 	cls.toggle("with-media", this.model.get("withMedia"));
		// 	cls.toggle("without-media", !this.model.get("withMedia"));
		// }

		// Set bundle class
		if (this.model.hasChanged("bundle")) {
			prevAttr = this.model.previous("bundle");
			if (prevAttr) {
				cls.remove(prevAttr.get("domid"));
			}
			if (bundle) {
				cls.add(bundle.get("domid"));
				// hasDarkBg = hasDarkBg || bundle.colors.hasDarkBg;
			}
		}
		// Set media class
		if (this.model.hasChanged("media")) {
			prevAttr = this.model.previous("media");
			if (prevAttr) {
				cls.remove(prevAttr.get("domid"));
			}
			if (media) {
				cls.add(media.get("domid"));
				// hasDarkBg = hasDarkBg || media.colors.hasDarkBg;
			}
		}
		// Set color-dark class
		// cls.toggle("color-dark", hasDarkBg);
		cls.toggle("color-dark",
			(media && media.colors.hasDarkBg) ||
			(bundle && bundle.colors.hasDarkBg));
	},
};

if (DEBUG) {
	/** @type {module:app/view/DebugToolbar} */
	var DebugToolbar = require("app/view/DebugToolbar");

	AppViewProto.initialize = (function(fn) {
		return function() {
			// var ret = fn.apply(this, arguments);
			var view = new DebugToolbar({
				id: "debug-toolbar",
				model: this.model
			});
			this.el.appendChild(view.render().el);
			this.listenTo(this.model, "change:layoutName", function() {
				this.requestRender(View.SIZE_INVALID); //.renderNow();
			});
			// return ret;
			return fn.apply(this, arguments);
		};
	})(AppViewProto.initialize);
}

/**
/* @constructor
/* @type {module:app/view/AppView}
/*/
module.exports = View.extend(AppViewProto, AppView);

},{"app/control/Controller":40,"app/control/Globals":41,"app/model/AppState":42,"app/view/ContentView":55,"app/view/DebugToolbar":56,"app/view/NavigationView":57,"app/view/base/TouchManager":62,"app/view/base/View":63,"backbone":"backbone","underscore":"underscore","utils/strings/stripTags":117}],55:[function(require,module,exports){
/**
 * @module app/view/NavigationView
 */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:utils/TransformHelper} */
var TransformHelper = require("utils/TransformHelper");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");

/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/CollectionStack} */
var CollectionStack = require("app/view/component/CollectionStack");
/** @type {module:app/view/component/CollectionStack} */
var SelectableListView = require("app/view/component/SelectableListView");
/** @type {module:app/view/render/DotNavigationRenderer} */
var DotNavigationRenderer = require("app/view/render/DotNavigationRenderer");
/** @type {module:app/view/component/Carousel} */
var Carousel = require("app/view/component/Carousel");
/** @type {module:app/view/component/Carousel} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");
/** @type {module:app/view/render/ImageRenderer} */
var ImageRenderer = require("app/view/render/ImageRenderer");
/** @type {module:app/view/render/VideoRenderer} */
var VideoRenderer = require("app/view/render/VideoRenderer");
/** @type {module:app/view/render/SequenceRenderer} */
var SequenceRenderer = require("app/view/render/SequenceRenderer");
// /** @type {module:app/view/component/ProgressMeter} */
// var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {Function} */
var bundleStackTemplate = require("./template/CollectionStack.Bundle.hbs");
/** @type {Function} */
var mediaStackTemplate = require("./template/CollectionStack.Media.hbs");

var transitionEnd = View.prefixedEvent("transitionend");
var transformProp = View.prefixedProperty("transform");
var transitionProp = View.prefixedProperty("transition");

var tx = Globals.transitions;

/**
 * @constructor
 * @type {module:app/view/ContentView}
 */
var ContentView = View.extend({

	/** @override */
	cidPrefix: "contentView",

	/** @override */
	className: "container-x container-expanded",

	/** @override */
	events: {
		"transitionend .adding-child": "_onAddedTransitionEnd",
		"transitionend .removing-child": "_onRemovedTransitionEnd",
		// "transitionend": "_onTransitionEnd",
	},

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onVPanStart", "_onVPanMove", "_onVPanFinal", "_onCollapsedClick");

		this.transforms = new TransformHelper();
		this.touch = TouchManager.getInstance();

		this.listenTo(this.model, "change", this._onModelChange);

		// disconnect children before last change
		// this.listenTo(bundles, "deselect:one", this._onDeselectOneBundle);

		this.skipTransitions = true;
		this.itemViews = [];

		// this.progressWrapper = this.createProgressWrapper(),
		// this.el.appendChild(this.progressWrapper.el);
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		// values
		var collapsed = this.model.get("collapsed");
		var collapsedChanged = (flags & View.MODEL_INVALID) && this.model.hasChanged("collapsed");
		var childrenChanged = (flags & View.MODEL_INVALID) && this.model.hasChanged("bundle");

		// flags
		var sizeChanged = !!(flags & View.SIZE_INVALID);
		var transformsChanged = !!(flags & (View.MODEL_INVALID | View.SIZE_INVALID | View.LAYOUT_INVALID));
		transformsChanged = transformsChanged || this._transformsChanged || this.skipTransitions;

		// debug
		// if (flags & View.MODEL_INVALID) {
		// 	console.group(this.cid + "::renderFrame model changed:");
		// 	Object.keys(this.model.changed).forEach(function(key) {
		// 		console.log("\t%s: %s -> %s", key, this.model._previousAttributes[key], this.model.changed[key]);
		// 	}, this);
		// 	console.groupEnd();
		// }

		// model:children
		// - - - - - - - - - - - - - - - - -
		if (childrenChanged) {
			if (bundles.lastSelected) {
				this.removeChildren(bundles.lastSelected);
			}
			if (bundles.selected) {
				this.createChildren(bundles.selected);
			}
		}

		// model:collapsed
		// - - - - - - - - - - - - - - - - -
		if (collapsedChanged) {
			this.el.classList.toggle("container-collapsed", collapsed);
			this.el.classList.toggle("container-expanded", !collapsed);
		}

		// size
		// - - - - - - - - - - - - - - - - -
		if (sizeChanged) {
			this.transforms.clearAllCaptures();
		}

		// transforms
		// - - - - - - - - - - - - - - - - -
		if (transformsChanged) {
			this.el.classList.remove("container-changing");
			if (this.skipTransitions) {
				this.transforms.stopAllTransitions();
				this.el.classList.remove("container-changed");
				if (!childrenChanged) {
					// this.transforms.clearAllOffsets();
					if (collapsedChanged) {
						this._setChildrenEnabled(collapsed);
					}
				}
			} else {
				if (!childrenChanged) {
					if (collapsedChanged) {
						var afterTransitionsFn;
						this.el.classList.add("container-changed");
						// this.transforms.clearAllOffsets();
						if (collapsed) {
							// container-collapsed, enable last
							afterTransitionsFn = function() {
								this._setChildrenEnabled(true);
								this.el.classList.remove("container-changed");
							};
							this.transforms.runAllTransitions(tx.LAST);
						} else {
							// container-expanded, disable first
							afterTransitionsFn = function() {
								this.el.classList.remove("container-changed");
							};
							this._setChildrenEnabled(false);
							this.transforms.runAllTransitions(tx.FIRST);
						}
						afterTransitionsFn = afterTransitionsFn.bind(this);
						this.transforms.whenAllTransitionsEnd().then(afterTransitionsFn, afterTransitionsFn);
					} else {
						this.transforms.items.forEach(function(o) {
							if (o.hasOffset) {
								o.runTransition(tx.NOW);
								// o.clearOffset();
							}
						});
					}
				}
			}
			// console.group(this.cid + "::renderFrame transitions:");
			// if (!this.skipTransitions) {
			// 	console.log("[skipping]");
			// } else {
			// 	this.transforms.items.forEach(function(o) {
			// 		var args = [ "\t%s: %s", o.el.id || o.id, o.transition.name || o.transition ];
			// 		if (o.hasOffset) args.push("[hasOffset]", o.offsetX, o.offsetY);
			// 		console.log.apply(console, args);
			// 	}, this);
			// }
			// console.groupEnd();

			if (!childrenChanged) {
				this.transforms.clearAllOffsets();
			}
			this.transforms.validate();
		}
		if (sizeChanged) {
			this.itemViews.forEach(function(view) {
				view.skipTransitions = this.skipTransitions;
				// view.invalidateSize();
				// view.renderNow();
				view.requestRender(View.SIZE_INVALID).renderNow();
			}, this);
		}
		this.skipTransitions = this._transformsChanged = false;
	},

	_setChildrenEnabled: function(enabled) {
		if (enabled) {
			this.el.removeEventListener("click", this._onCollapsedClick, false);
		} else {
			this.el.addEventListener("click", this._onCollapsedClick, false);
		}
		this.itemViews.forEach(function(view) {
			view.setEnabled(enabled);
		});
	},

	_onCollapsedClick: function(ev) {
		console.log("%s:[%s] ev: %o", this.cid, ev.type, ev);
		if (!ev.defaultPrevented && this.model.get("withBundle")) {
			this.setImmediate(function() {
				// this.setImmediate(function() {
				this.model.set("collapsed", !this.model.get("collapsed"));
				// });
			});
		}
	},
	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_onModelChange: function() {
		if (this.model.hasChanged("withBundle")) {
			if (this.model.get("withBundle")) {
				this.touch.on("vpanstart", this._onVPanStart);
			} else {
				this.touch.off("vpanstart", this._onVPanStart);
			}
		}
		this.requestRender(View.MODEL_INVALID);
	},

	/* -------------------------------
	/* Vertical touch/move (_onVPan*)
	/* ------------------------------- */

	_collapsedOffsetY: Globals.COLLAPSE_OFFSET,

	_onVPanStart: function(ev) {
		this.touch.on("vpanmove", this._onVPanMove);
		this.touch.on("vpanend vpancancel", this._onVPanFinal);

		this.transforms.stopAllTransitions();
		// this.transforms.clearAllOffsets();
		// this.transforms.validate();
		this.transforms.clearAllCaptures();

		this.el.classList.add("container-changing");
		this._onVPanMove(ev);
	},

	_onVPanMove: function(ev) {
		var collapsed = this.model.get("collapsed");
		var delta = ev.thresholdDeltaY;
		var maxDelta = this._collapsedOffsetY + Math.abs(ev.thresholdOffsetY);
		// check if direction is aligned with collapsed/expand
		var isValidDir = collapsed ? (delta > 0) : (delta < 0);
		var moveFactor = collapsed ? Globals.VPAN_DRAG : 1 - Globals.VPAN_DRAG;

		delta = Math.abs(delta); // remove sign
		delta *= moveFactor;
		maxDelta *= moveFactor;

		if (isValidDir) {
			if (delta > maxDelta) { // overshooting
				delta = ((delta - maxDelta) * Globals.VPAN_OUT_DRAG) + maxDelta;
			} else { // no overshooting
				// delta = delta;
			}
		} else {
			delta = (-delta) * Globals.VPAN_OUT_DRAG; // delta is opposite
		}
		delta *= collapsed ? 1 : -1; // reapply sign

		this.transforms.offsetAll(0, delta);
		this.transforms.validate();
	},

	_onVPanFinal: function(ev) {
		this.touch.off("vpanmove", this._onVPanMove);
		this.touch.off("vpanend vpancancel", this._onVPanFinal);

		// FIXME: model.collapsed may have already changed, _onVPanMove would run with wrong values:
		// model.collapsed is changed in a setImmediate callback from NavigationView.

		this._onVPanMove(ev);
		this.setImmediate(function() {
			this._transformsChanged = true;
			this.requestRender();
		});
	},

	// willCollapsedChange: function(ev) {
	// 	var collapsed = this.model.get("collapsed");
	// 	return ev.type == "vpanend"? collapsed?
	// 		ev.thresholdDeltaY > Globals.COLLAPSE_THRESHOLD :
	// 		ev.thresholdDeltaY < -Globals.COLLAPSE_THRESHOLD :
	// 		false;
	// },

	/* -------------------------------
	/* create/remove children on bundle selection
	/* ------------------------------- */

	/** Create children on bundle select */
	createChildren: function(bundle) {
		// will be attached to dom in this order
		var stack = this.createMediaCaptionStack(bundle),
			carousel = this.createMediaCarousel(bundle),
			dotNav = this.createMediaDotNavigation(bundle);

		this.itemViews.push(stack, carousel, dotNav);
		this.transforms.add(carousel.el, stack.el);

		this.itemViews.forEach(function(view) {
			// view.listenToOnce(bundle, "deselect", function() {
			// 	this.stopListening(this.collection);
			// });
			if (!this.skipTransitions) {
				view.el.classList.add("adding-child");
				view.el.style.opacity = 0;
				// this.listenToOnce(view, "view:attached", function(view) {
				// 	// console.log("%s::[view:added] id:%s", this.cid, view.cid);
				// 	if (!this.skipTransitions) {
				// 		view.el.style[transitionProp] = "opacity " + tx.LAST.cssText;
				// 	}
				// 	view.el.style.removeProperty("opacity");
				// });
			}
			this.el.appendChild(view.el);
			view.render();
		}, this);

		if (!this.skipTransitions) {
			this.requestAnimationFrame(function() {
				console.log("%s::createChildren::[callback:requestAnimationFrame]", this.cid);
				this.itemViews.forEach(function(view) {
					if (!this.skipTransitions) {
						view.el.style[transitionProp] = "opacity " + tx.LAST.cssText;
					}
					view.el.style.removeProperty("opacity");
				}, this);
			});
		}
	},

	removeChildren: function(bundle) {
		// this.purgeChildren();
		// this.transforms.remove(this.carousel.el, this.captionStack.el);
		this.itemViews.forEach(function(view, i, a) {
			this.transforms.remove(view.el);
			if (this.skipTransitions) {
				view.remove();
			} else {
				var s = window.getComputedStyle(view.el);
				if (s.opacity == "0" || s.visibility == "hidden") {
					console.log("%s::removeChildren [view:%s] removed immediately (invisible)", this.cid, view.cid);
					view.remove();
				} else {
					view.el.classList.add("removing-child");
					if (s[transformProp]) view.el.style[transformProp] = s[transformProp];
					view.el.style[transitionProp] = "opacity " + tx.FIRST.cssText;
					view.el.style.opacity = 0;
				}
			}
			a[i] = null;
		}, this);
		this.itemViews.length = 0;
	},

	_onAddedTransitionEnd: function(ev) {
		if (ev.target.cid && this.childViews.hasOwnProperty(ev.target.cid)) {
			console.log("%s::_onAddedTransitionEnd [view:%s] [prop:%s] [ev:%s]", this.cid, ev.target.cid, ev.propertyName, ev.type);
			var view = this.childViews[ev.target.cid];
			view.el.classList.remove("adding-child");
			view.el.style.removeProperty(transitionProp);
		}
	},

	_onRemovedTransitionEnd: function(ev) {
		if (ev.target.cid && this.childViews.hasOwnProperty(ev.target.cid)) {
			console.log("%s::_onRemovedTransitionEnd [view:%s] [prop:%s] [ev:%s]", this.cid, ev.target.cid, ev.propertyName, ev.type);
			var view = this.childViews[ev.target.cid];
			view.el.classList.remove("removing-child");
			view.remove();
		}
	},

	// purgeChildren: function() {
	// 	var i, el, els = this.el.querySelectorAll(".removing-child");
	// 	for (i = 0; i < els.length; i++) {
	// 		el = els.item(i);
	// 		if (el.parentElement === this.el) {
	// 			try {
	// 				console.error("%s::purgeChildren", this.cid, el.getAttribute("data-cid"));
	// 				View.findByElement(el).remove();
	// 			} catch (err) {
	// 				console.error("s::purgeChildren", this.cid, "orphaned element", err);
	// 				this.el.removeChild(el);
	// 			}
	// 		}
	// 	}
	// },

	/* -------------------------------
	/* Components
	/* ------------------------------- */

	/**
	/* media-carousel
	/*/
	createMediaCarousel: function(bundle) {
		// Create carousel
		var classname = "media-carousel " + bundle.get("domid");
		var EmptyRenderer = CarouselRenderer.extend({
			className: "carousel-item empty-item",
			model: bundle,
			template: bundleStackTemplate,
		});
		var rendererFunction = function(item, index, arr) {
			if (index === -1) {
				return EmptyRenderer;
			}
			switch (item.attr("@renderer")) {
				case "video":
					return VideoRenderer;
				case "sequence":
					return SequenceRenderer;
					// case "image": return ImageRenderer;
				default:
					return ImageRenderer;
			}
		};
		var view = new Carousel({
			className: classname,
			collection: bundle.get("media"),
			rendererFunction: rendererFunction,
			requireSelection: false,
			direction: Carousel.DIRECTION_HORIZONTAL,
			touch: this.touch,
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectMedia,
			"view:select:none": controller.deselectMedia,
			// "view:removed": controller.stopListening
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
			controller.stopListening(this);
		});
		return view;
	},

	/**
	/* media-caption-stack
	/*/
	createMediaCaptionStack: function(bundle) {
		var view = new CollectionStack({
			className: "media-caption-stack",
			collection: bundle.get("media"),
			template: mediaStackTemplate
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
		});
		return view;
	},

	/**
	/* media-dotnav
	/*/
	createMediaDotNavigation: function(bundle) {
		var view = new SelectableListView({
			className: "media-dotnav dots-fontello color-fg05",
			collection: bundle.get("media"),
			renderer: DotNavigationRenderer
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectMedia,
			"view:select:none": controller.deselectMedia,
			// "view:removed": controller.stopListening
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
			controller.stopListening(this);
		});
		return view;
	},

	createProgressWrapper: function() {
		// var view = new ProgressMeter({
		// 	id: "media-progress-wrapper",
		// 	// className: "color-bg color-fg05",
		// 	useOpaque: false,
		// 	labelFn: function() { return "0%"; }
		// });
		// this.el.appendChild(this.progressWrapper.el);
		// return view;
		return null;
	},
});

module.exports = ContentView;

},{"./template/CollectionStack.Bundle.hbs":97,"./template/CollectionStack.Media.hbs":98,"app/control/Controller":40,"app/control/Globals":41,"app/model/collection/BundleCollection":45,"app/view/base/TouchManager":62,"app/view/base/View":63,"app/view/component/Carousel":65,"app/view/component/CollectionStack":67,"app/view/component/SelectableListView":72,"app/view/render/CarouselRenderer":82,"app/view/render/DotNavigationRenderer":87,"app/view/render/ImageRenderer":89,"app/view/render/SequenceRenderer":94,"app/view/render/VideoRenderer":96,"underscore":"underscore","utils/TransformHelper":103}],56:[function(require,module,exports){
/**
 * @module app/view/DebugToolbar
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:cookies-js} */
var Cookies = require("cookies-js");
// /** @type {module:modernizr} */
// var Modernizr = require("Modernizr");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
// /** @type {module:app/control/Controller} */
// var controller = require("app/control/Controller");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");

/** @type {Function} */
var viewTemplate = require("./template/DebugToolbar.hbs");

/** @type {Function} */
var sizeTemplate = _.template("<%= w %> \u00D7 <%= h %>");

// var appStateSymbols = { withBundle: "b", withMedia: "m", collapsed: "c"};
// var appStateKeys = Object.keys(appStateSymbols);

var DebugToolbar = View.extend({

	/** @override */
	cidPrefix: "debugToolbar",
	/** @override */
	tagName: "div",
	/** @override */
	className: "toolbar",
	/** @override */
	template: viewTemplate,

	initialize: function(options) {
		Cookies.defaults = {
			expires: new Date(0x7fffffff * 1e3),
			domain: String(window.location)
				.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1]
		};

		this.el.innerHTML = this.template({
			layouts: Globals.LAYOUT_NAMES,
			tests: Modernizr,
			navigator: window.navigator
		});

		/* toggle's target: container
		/* - - - - - - - - - - - - - - - - */
		var container = document.body.querySelector("#container");

		/* info elements
		/* - - - - - - - - - - - - - - - - */
		this.backendEl = this.el.querySelector("#edit-backend a");
		this.mediaInfoEl = this.el.querySelector("#media-info span");
		this.appStateEl = this.el.querySelector("#app-state");

		/* toggle visibility
				/* - - - - - - - - - - - - - - - - */
		this.initializeClassToggle("show-links", this.el.querySelector(".debug-links #links-toggle"), this.el);
		this.initializeClassToggle("show-tests", this.el.querySelector("#toggle-tests a"), this.el);
		this.initializeClassToggle("hide-passed", this.el.querySelector("#toggle-passed"), this.el);

		/* toggle container classes
		/* - - - - - - - - - - - - - - - - */
		this.initializeClassToggle("debug-grid-bg", this.el.querySelector("#toggle-grid-bg a"), container);
		this.initializeClassToggle("debug-blocks", this.el.querySelector("#toggle-blocks a"), container);
		this.initializeClassToggle("debug-logs", this.el.querySelector("#toggle-logs a"), container);
		this.initializeClassToggle("debug-tx", this.el.querySelector("#toggle-tx a"), container,
			function(key, value) {
				this.el.classList.toggle("show-tx", value);
			}
		);

		this.initializeViewportInfo();

		this.initializeLayoutSelect();

		this.listenTo(this.model, "change", this._onModelChange);
		this._onModelChange();
	},

	initializeLayoutSelect: function() {
		var layoutSelectEl = this.el.querySelector("#select-layout select");
		var cookieValue, cookieKey = "layout-name";
		var modelValue, modelKey = "layoutName";
		var urlValue, urlExpr = /[?&;]layout=([^&;]+)/;
		var docValue;
		var result;

		modelValue = this.model.get(modelKey);
		cookieValue = Cookies.get(cookieKey);
		urlValue = window.location.href.match(urlExpr);
		docValue = _.find(Globals.LAYOUT_NAMES, function(s) {
			return document.body.classList.contains(s);
		});
		result = (urlValue && urlValue[1]) || cookieValue || modelValue || docValue || Globals.LAYOUT_NAMES[0];

		Cookies.set(cookieKey, result);
		layoutSelectEl.value = result;
		if (docValue !== result) {
			if (docValue) document.body.classList.remove(docValue);
			document.body.classList.add(result);
		}
		this.model.set("layoutName", result, { silent: true });

		console.info("%s::init layout-name cookie:'%s' model:'%s' doc:'%s' url:'%s' -> '%s'", this.cid, cookieValue, modelValue, docValue, urlValue, result);

		/* setup listeners after values are sync'd */
		this.listenTo(this.model, "change:layoutName", function(model, value) {
			var previousValue = model.previous(modelKey);
			if (previousValue)
				document.body.classList.remove(previousValue);
			if (value)
				document.body.classList.add(value);
			Cookies.set(cookieKey, value);
			console.info("%s::[change:layoutName] layout-name value:'%s' previous:'%s'\n\tdoc:'%s'", this.cid, value, previousValue, document.body.className);
		});

		layoutSelectEl.addEventListener("change", function(ev) {
			console.info("%s:[change] value:'%s'", this.cid, ev.target.value, ev);
			this.model.set(modelKey, ev.target.value);
		}.bind(this), false);
	},

	initializeViewportInfo: function() {
		var viewportInfoEl = this.el.querySelector("#viewport-info span");
		var callback = function() {
			viewportInfoEl.textContent = sizeTemplate({ w: window.innerWidth, h: window.innerHeight });
		};
		callback.call();
		window.addEventListener("resize", _.debounce(callback, 100, false, false));
	},

	initializeToggle: function(key, toggleEl, callback) {
		var ctx = this;
		var toggleValue = Cookies.get(key) === "true";
		callback.call(ctx, key, toggleValue);

		toggleEl.addEventListener("click", function(ev) {
			if (ev.defaultPrevented) return;
			else ev.preventDefault();
			toggleValue = !toggleValue;
			Cookies.set(key, toggleValue ? "true" : "");
			callback.call(ctx, key, toggleValue);
		}, false);
	},

	initializeClassToggle: function(key, toggleEl, targetEl, callback) {
		var hasCallback = _.isFunction(callback);

		this.initializeToggle(key, toggleEl, function(key, toggleValue) {
			targetEl.classList.toggle(key, toggleValue);
			toggleEl.classList.toggle("toggle-enabled", toggleValue);
			toggleEl.classList.toggle("color-reverse", toggleValue);
			hasCallback && callback.apply(this, arguments);
		});
	},

	_onModelChange: function() {
		console.log("%s::_onModelChange changedAttributes: %o", this.cid, this.model.changedAttributes());
		var i, ii, prop, el, els = this.appStateEl.children;
		for (i = 0, ii = els.length; i < ii; i++) {
			el = els[i];
			prop = el.getAttribute("data-prop");
			el.classList.toggle("has-value", this.model.get(prop));
			el.classList.toggle("has-changed", this.model.hasChanged(prop));
			el.classList.toggle("color-reverse", this.model.hasChanged(prop));
		}
		if (this.model.hasChanged("bundle")) {
			var attrVal = Globals.APP_ROOT;
			if (this.model.has("media")) {
				attrVal += "symphony/publish/media/edit/" + this.model.get("media").id;
			} else if (this.model.has("bundle")) {
				attrVal += "symphony/publish/bundles/edit/" + this.model.get("bundle").id;
			} else {
				attrVal += "symphony/";
			}
			this.backendEl.setAttribute("href", attrVal);
		}
		if (this.model.hasChanged("media")) {
			if (this.model.has("media")) {
				this.mediaInfoEl.textContent = sizeTemplate(this.model.get("media").get("source").toJSON());
				this.mediaInfoEl.style.display = "";
			} else {
				this.mediaInfoEl.textContent = "";
				this.mediaInfoEl.style.display = "none";
			}
		}
	},
});

module.exports = DebugToolbar;

},{"./template/DebugToolbar.hbs":99,"app/control/Globals":41,"app/view/base/View":63,"cookies-js":"cookies-js","underscore":"underscore"}],57:[function(require,module,exports){
/* global MutationObserver */
/**
/* @module app/view/NavigationView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:utils/TransformHelper} */
var TransformHelper = require("utils/TransformHelper");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");

/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/collection/TypeCollection} */
var types = require("app/model/collection/TypeCollection");
/** @type {module:app/model/collection/KeywordCollection} */
var keywords = require("app/model/collection/KeywordCollection");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/FilterableListView} */
var FilterableListView = require("app/view/component/FilterableListView");
/** @type {module:app/view/component/GroupingListView} */
var GroupingListView = require("app/view/component/GroupingListView");
/** @type {module:app/view/component/CollectionPager} */
// var CollectionPager = require("app/view/component/CollectionPager");
/** @type {module:app/view/component/CollectionPager} */
var GraphView = require("app/view/component/GraphView");

// /** @type {module:utils/prefixedProperty} */
// var prefixedProperty = require("utils/prefixedProperty");

var tx = Globals.transitions;

/**
/* @constructor
/* @type {module:app/view/NavigationView}
/*/
var NavigationView = View.extend({

	/** @override */
	cidPrefix: "navigationView",

	/** @override */
	className: "container-expanded",

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onVPanStart", "_onVPanMove", "_onVPanFinal");
		_.bindAll(this, "_onHPanStart", "_onHPanMove", "_onHPanFinal");
		_.bindAll(this, "_whenTransitionsEnd", "_whenTransitionsAbort");

		this.itemViews = [];
		this.transforms = new TransformHelper();
		this.touch = TouchManager.getInstance();

		this.listenTo(this.model, "change", this._onModelChange);

		this.keywordList = this.createKeywordList();
		this.hGroupings = this.keywordList.el.querySelectorAll(".list-group .label");
		this.transforms.add(this.hGroupings, this.keywordList.el, this.keywordList.wrapper);
		this.itemViews.push(this.keywordList);

		this.bundleList = this.createBundleList();
		this.transforms.add(this.bundleList.el, this.bundleList.wrapper);
		this.itemViews.push(this.bundleList);

		this.sitename = this.createSitenameButton();
		this.transforms.add(this.sitename.wrapper, this.sitename.el);
		// this.transforms.add(this.sitename.el.firstElementChild, this.sitename.el);

		this.graph = this.createGraphView(this.bundleList, this.keywordList);
		// this.transforms.add(this.graph.el);
		// this.itemViews.push(this.graph);
		// this.listenTo(this.graph, {
		// 	"canvas:update": this._onGraphUpdate,
		// 	"canvas:redraw": this._onGraphRedraw,
		// });

		this.listenTo(this.graph, "view:render:before", function(view, flags) {
			// console.info("%s:[%s view:render:before]", this.cid, view.cid);
			if (flags & View.SIZE_INVALID) {
				// console.info("%s:[%s view:render:before] bundleList height", this.cid, view.cid, this.bundleList.el.style.height);
				this.graph.el.style.height = this.bundleList.el.style.height;
				// this.graph.el.style.opacity = this.bundleList.collapsed? "0": "1";
				// view.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
			}
		});
		// this.listenTo(this.bundleList, "view:render:after", function(view, flags) {
		// 	console.info("%s:[view:render:after %s]", this.cid, view.cid, View.flagsToString(flags & View.SIZE_INVALID));
		// 		if (flags & View.SIZE_INVALID) {
		// 			// console.info("%s:[%s view:render:after] bundleList height", this.cid, view.cid, this.bundleList.el.style.height);
		// 			// this.graph.el.style.height = this.bundleList.el.style.height;
		// 			this.graph.el.style.opacity = this.bundleList.collapsed? 0 : 1;
		// 			this.graph.requestRender(View.SIZE_INVALID).renderNow();
		// 	// 	}
		// });
		// this.listenTo(this.bundleList, "view:render:after", this._onListResize);
		// this.listenTo(this.keywordList, "view:render:after", this._onListResize);
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		if (flags & View.MODEL_INVALID) {
			if (this.model.hasChanged("collapsed")) {
				this.el.classList.toggle("container-collapsed", this.model.get("collapsed"));
				this.el.classList.toggle("container-expanded", !this.model.get("collapsed"));
			}
			if (this.model.hasChanged("collapsed") || this.model.hasChanged("withBundle")) {
				this.el.classList.add("container-changing");
			}
			if (this.model.hasChanged("bundle")) {
				this.bundleList.requestRender(View.SIZE_INVALID);
				this.keywordList.requestRender(View.SIZE_INVALID);
			}
		}

		// transforms
		// - - - - - - - - - - - - - - - - -
		if (this.skipTransitions ||
			(flags & (View.MODEL_INVALID | View.SIZE_INVALID | View.LAYOUT_INVALID))) {
			// if (transformsChanged) {
			if (this.skipTransitions) {
				this.transforms.stopAllTransitions();
				this.transforms.validate();
				this.transforms.clearAllOffsets();
			} else {
				this.renderTransitions(flags);
			}
			// console.group(this.cid + "::renderFrame transitions:");
			// if (this.skipTransitions) {
			// 	console.log("[skipping]");
			// } else {
			// 	this.transforms.items.forEach(function(o) {
			// 		console.log("\t%s: %s", o.el.id || o.id, o.transition.name || o.transition);
			// 	}, this);
			// }
			// console.groupEnd();
			// this.transforms.clearAllOffsets();

			// if (this.model.hasChanged("collapsed") || this.model.hasChanged("withBundle")) {
			// 	this.transforms.promise().then(this._whenTransitionsEnd, this._whenTransitionsAbort);
			// }
			this.transforms.validate();
		}

		if (flags & View.MODEL_INVALID) {
			if (this.model.hasChanged("collapsed") || this.model.hasChanged("withBundle")) {
				//if ((this.model.hasChanged("collapsed") && !this.model.get("collapsed")) || (this.model.hasChanged("withBundle") && !this.model.get("withBundle"))) {
				// this.el.classList.add("container-changing");
				this.transforms.promise().then(this._whenTransitionsEnd, this._whenTransitionsAbort);
			}
		}

		// children loop
		// - - - - - - - - - - - - - - - - -
		this.itemViews.forEach(function(view) {
			view.skipTransitions = view.skipTransitions || this.skipTransitions;
			if (flags & View.SIZE_INVALID) {
				view.requestRender(View.SIZE_INVALID);
			}
			if (!view.skipTransitions) {
				view.renderNow();
			}
		}, this);

		if ((flags & (View.SIZE_INVALID | ~View.MODEL_INVALID)) &&
			!this.model.hasChanged("collapsed") && !this.model.get("withBundle")) {
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
			if (!this.skipTransitions) {
				this.graph.renderNow();
			}
		} else if ((flags & View.SIZE_INVALID) && !this.model.get("collapsed")) {
			/* NavigationView has resized while uncollapsed,
			   but model is unchanged */
			// console.info("%s::renderFrame", this.cid, "NavigationView has resized");
			this.graph.requestRender(View.SIZE_INVALID);
		}

		this.skipTransitions = false;
	},

	_whenTransitionsEnd: function(result) {
		console.info("%s::_whenTransitionsEnd", this.cid);

		this.el.classList.remove("container-changing");
		if (!this.model.get("collapsed")) {
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
		}
	},

	_whenTransitionsAbort: function(reason) {
		console.warn("%s::_whenTransitionsAbort %o", this.cid, reason);
	},

	/* -------------------------------
	/* renderTransitions
	/* ------------------------------- */

	renderTransitions: function(flags) {
		var modelChanged = (flags & View.MODEL_INVALID);
		/* bundle */
		var withBundle = this.model.get("withBundle");
		var withBundleChanged = modelChanged && this.model.hasChanged("withBundle");
		var bundleChanged = modelChanged && this.model.hasChanged("bundle");
		/* media */
		var withMedia = this.model.get("withMedia");
		var withMediaChanged = modelChanged && this.model.hasChanged("withMedia");
		//var mediaChanged = modelChanged && this.model.hasChanged("media");
		/* collapsed */
		var collapsed = this.model.get("collapsed");
		var collapsedChanged = modelChanged && this.model.hasChanged("collapsed");
		/* layoutName */
		var layoutName = Globals.BREAKPOINTS["desktop-small"].matches ?
			this.model.get("layoutName") : "";

		var tf;
		/* this.bundleList.el */
		tf = this.transforms.get(this.bundleList.el);
		if (tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
		}
		/* this.keywordList.el */
		tf = this.transforms.get(this.keywordList.el);
		if (tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
		}
		/* this.graph.el */
		tf = this.transforms.get(this.graph.el);
		if (tf && tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
			tf.clearOffset();
		}

		switch (layoutName) {
			case "left-layout":
			case "default-layout":
				/* this.keywordList.wrapper */
				tf = this.transforms.get(this.keywordList.wrapper);
				if (collapsedChanged) {
					if (withBundleChanged) {
						if (withMediaChanged)
							tf.runTransition(withBundle ? tx.LAST : tx.FIRST);
					} else {
						if (withMedia)
							tf.runTransition(collapsed ? tx.LAST : tx.FIRST);
					}
				} else {
					if (!withBundleChanged && withMediaChanged)
						tf.runTransition(bundleChanged ? tx.BETWEEN : tx.NOW);
				}
				// continue
			case "right-layout":
				if (collapsedChanged) { /* this.hGroupings */
					this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.hGroupings);
				}
				break;
		}

		switch (layoutName) {
			case "left-layout":
				if (collapsedChanged) { /* this.bundleList.wrapper */
					this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.bundleList.wrapper);
				}
				if (collapsedChanged) { /* this.sitename.el */
					this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.sitename.el);
				}
				if (withBundleChanged) { /* this.sitename.wrapper */
					this.transforms.runTransition(tx.BETWEEN, this.sitename.wrapper);
					// NOTE: when changing to collapsed, tx tends to fire early, so use BETWEEN_LATE
					// this.transforms.runTransition(collapsed? tx.BETWEEN_LATE : tx.BETWEEN, this.sitename.el);
				}
				break;
			case "default-layout":
				if (collapsedChanged ^ withBundleChanged) { /* this.bundleList.wrapper */
					// if either but not both, then invert condition if collapsedChanged
					this.transforms.runTransition(collapsed ^ collapsedChanged ? tx.FIRST : tx.LAST, this.bundleList.wrapper);
				}
				// continue
			case "right-layout":
				if (withBundleChanged && collapsedChanged) { /* this.sitename.el */
					this.transforms.runTransition(tx.BETWEEN, this.sitename.el);
				} else if (collapsedChanged) {
					this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.sitename.el);
				}
				break;
			default:
				if (withBundleChanged) { /* this.sitename.el */
					this.transforms.runTransition(tx.BETWEEN, this.sitename.el);
				}
				break;
		}
		this.transforms.clearOffset(this.bundleList.el, this.keywordList.el, this.keywordList.wrapper);
	},

	/* --------------------------- *
	/* own model changed
	/* --------------------------- */

	_onModelChange: function() {
		if (this.model.hasChanged("collapsed")) {
			if (this.model.get("collapsed")) {
				// clear keyword selection
				keywords.deselect();
			}
			this.keywordList.collapsed = this.bundleList.collapsed = this.model.get("collapsed");
		}
		if (this.model.hasChanged("bundle")) {
			this.keywordList.refresh();
			// this.graph && this.graph.requestRender(View.SIZE_INVALID);
		}
		if (this.model.hasChanged("withBundle")) {
			if (this.model.get("withBundle")) {
				this.touch.on("vpanstart", this._onVPanStart);
				this.touch.on("panstart", this._onHPanStart);
				// this.touch.on("tap", this._onTap);
			} else {
				this.touch.off("vpanstart", this._onVPanStart);
				this.touch.off("panstart", this._onHPanStart);
				// this.touch.off("tap", this._onTap);
			}
			// this.graph.valueTo()
		}
		this.requestRender(View.MODEL_INVALID);
	},

	/*events: {
		"click": function(ev) {
			console.log("%s:[click] ev: %o", this.cid, ev);
			if (!ev.defaultPrevented && this.model.get("withBundle")) {
				this.setImmediate(function() {
					this.transforms.offset(0, 1, this.graph.el);
					this.transforms.validate();
					this.setImmediate(function() {
						this.model.set("collapsed", !this.model.get("collapsed"));
					});
				});
			}
		}
	},*/


	/* --------------------------- *
	/* bundleList event
	/* --------------------------- */

	_onBundleListSame: function(bundle) {
		this.transforms.offset(0, 1, this.graph.el);
		this.transforms.validate();
		this.setImmediate(function() {
			this.model.set("collapsed", !this.model.get("collapsed"));
		});

	},

	/* --------------------------- *
	/* keywordList event
	/* --------------------------- */

	_onKeywordListChange: function(keyword) {
		if (!this.model.get("collapsed")) {
			keywords.select(keyword);
		}
	},

	/* --------------------------- *
	/* keyword collection event
	/* --------------------------- */

	_onKeywordSelect: function(keyword) {
		// use collection listener to avoid redundant refresh calls
		this.bundleList.refresh();
		if (!this.model.get("collapsed") && this.graph) {
			this.graph.valueTo(0, 0, "amount");
			this.graph.renderNow();
			this.graph.valueTo(1, Globals.TRANSITION_DURATION, "amount");
		}
	},

	/* -------------------------------
	/* Horizontal touch/move (HammerJS)
	/* ------------------------------- */

	_onHPanStart: function(ev) {
		this.transforms.get(this.keywordList.wrapper)
			.stopTransition()
			.clearOffset()
			.validate();
		if (this.model.get("layoutName") != "left-layout"
			&& this.model.get("layoutName") != "default-layout") {
			return;
		}
		if (Globals.BREAKPOINTS["desktop-small"].matches
			&& this.model.get("bundle").get("media").selectedIndex <= 0
			&& this.model.get("collapsed")) {
			this.transforms.get(this.keywordList.wrapper).clearCapture();
			this._onHPanMove(ev);

			this.touch.on("panmove", this._onHPanMove);
			this.touch.on("panend pancancel", this._onHPanFinal);
		}
	},

	_onHPanMove: function(ev) {
		// var HPAN_DRAG = 1;
		// var HPAN_DRAG = 0.75;
		var HPAN_DRAG = 720 / 920;
		var delta = ev.thresholdDeltaX;
		// var mediaItems = this.model.get("bundle").get("media");

		if (this.model.get("withMedia")) {
			// if (this.model.get("withMedia") ^ (this._renderFlags & View.MODEL_INVALID)) {
			// if (mediaItems.selected !== null) {
			delta *= (ev.offsetDirection & Hammer.DIRECTION_LEFT) ? HPAN_DRAG : 0.0;
			// if (bundles.selected.get("media").selectedIndex == -1) {
		} else { //if (media.selectedIndex == 0) {
			delta *= (ev.offsetDirection & Hammer.DIRECTION_LEFT) ? Globals.HPAN_OUT_DRAG : HPAN_DRAG;
		}
		this.transforms.offset(delta, void 0, this.keywordList.wrapper);
		this.transforms.validate();
	},

	_onHPanFinal: function(ev) {
		this.touch.off("panmove", this._onHPanMove);
		this.touch.off("panend pancancel", this._onHPanFinal);

		/* NOTE: if there is no model change, set tx here. Otherwise just wait for render */
		var kTf = this.transforms.get(this.keywordList.wrapper);
		if (!(this._renderFlags & View.MODEL_INVALID) && kTf.hasOffset) {
			if (kTf.offsetX != 0) {
				kTf.runTransition(tx.NOW);
			}
			kTf.clearOffset().validate();
			// kTf.clearOffset().runTransition(tx.NOW).validate();
			// this.transforms.clearOffset(this.keywordList.wrapper);
			// this.transforms.runTransition(tx.NOW, this.keywordList.wrapper);
			// this.transforms.validate();
		}
	},

	/* -------------------------------
	/* Vertical touch/move (_onVPan*)
	/* ------------------------------- */

	_collapsedOffsetY: Globals.COLLAPSE_OFFSET,

	_onVPanStart: function(ev) {
		this.touch.on("vpanmove", this._onVPanMove);
		this.touch.on("vpanend vpancancel", this._onVPanFinal);

		this.transforms.stopTransition(this.bundleList.el, this.keywordList.el); //, this.graph.el);
		// this.transforms.clearOffset(this.bundleList.el, this.keywordList.el);
		// this.transforms.validate();
		this.transforms.clearCapture(this.bundleList.el, this.keywordList.el); //, this.graph.el);

		if (!this.model.get("collapsed")) {
			this.transforms.stopTransition(this.graph.el);
			this.transforms.clearCapture(this.graph.el);
		}
		// this.el.classList.add("container-changing");
		this._onVPanMove(ev);
	},

	_onVPanMove: function(ev) {
		var collapsed = this.model.get("collapsed");
		var delta = ev.thresholdDeltaY;
		var maxDelta = this._collapsedOffsetY + Math.abs(ev.thresholdOffsetY);
		// check if direction is aligned with collapsed/expand
		var isValidDir = collapsed ? (delta > 0) : (delta < 0);
		var moveFactor = collapsed ? 1 - Globals.VPAN_DRAG : Globals.VPAN_DRAG;

		delta = Math.abs(delta); // remove sign
		delta *= moveFactor;
		maxDelta *= moveFactor;

		if (isValidDir) {
			if (delta > maxDelta) { // overshooting
				delta = ((delta - maxDelta) * Globals.VPAN_OUT_DRAG) + maxDelta;
			} else { // no overshooting
				// delta = delta;
			}
		} else {
			delta = (-delta) * Globals.VPAN_OUT_DRAG; // delta is opposite
		}
		delta *= collapsed ? 0.5 : -1; // reapply sign

		this.transforms.offset(0, delta, this.bundleList.el, this.keywordList.el); //, this.graph.el);
		if (!collapsed)
			this.transforms.offset(0, delta, this.graph.el)
		this.transforms.validate();
	},

	_onVPanFinal: function(ev) {
		this.touch.off("vpanmove", this._onVPanMove);
		this.touch.off("vpanend vpancancel", this._onVPanFinal);

		this._onVPanMove(ev);
		this.setImmediate(function() {
			if (this.willCollapsedChange(ev)) {
				this.model.set("collapsed", !this.model.get("collapsed"));
			} else {
				this.requestRender(View.LAYOUT_INVALID);
			}
		});
	},

	willCollapsedChange: function(ev) {
		return ev.type == "vpanend" ? this.model.get("collapsed") ?
			ev.thresholdDeltaY > Globals.COLLAPSE_THRESHOLD :
			ev.thresholdDeltaY < -Globals.COLLAPSE_THRESHOLD :
			false;
	},

	/* -------------------------------
	/* Components
	/* ------------------------------- */

	createSitenameButton: function() {
		var view = new View({
			el: "#site-name",
			events: {
				"click a": function(domev) {
					domev.defaultPrevented || domev.preventDefault();
					controller.deselectBundle();
				}
			}
		});
		view.wrapper = view.el.parentElement;
		return view;
	},

	/**
	/* bundle-list
	/*/
	createBundleList: function() {
		var view = new FilterableListView({
			el: "#bundle-list",
			collection: bundles,
			collapsed: false,
			filterFn: function(bundle, index, arr) {
				return keywords.selected ? bundle.get("kIds").indexOf(keywords.selected.id) !== -1 : false;
			},
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectBundle,
			"view:select:none": controller.deselectBundle
		});
		this.listenTo(view, "view:select:same", this._onBundleListSame);
		this.listenTo(keywords, "select:one select:none", this._onKeywordSelect);
		view.wrapper = view.el.parentElement;
		return view;
	},

	/**
	/* keyword-list
	/*/
	createKeywordList: function() {
		var view = new GroupingListView({
			el: "#keyword-list",
			collection: keywords,
			collapsed: false,
			filterFn: function(item, idx, arr) {
				// return !!(item.get("bundle").selected);
				return bundles.selected ? (bundles.selected.get("kIds").indexOf(item.id) !== -1) : false;
			},
			groupingFn: function(item, idx, arr) {
				// return item.get("type");
				return types.get(item.get("tId"));
			},
		});
		this.listenTo(view, "view:select:one view:select:none", this._onKeywordListChange);
		view.wrapper = view.el.parentElement;

		return view;
	},

	createGraphView: function(listA, listB) {
		var view = new GraphView({
			id: "nav-graph",
			listA: listA,
			listB: listB,
			model: this.model,
			useOpaque: false
		});
		this.el.appendChild(view.el);
		return view;
	},

	/* -------------------------------
	/* Horizontal touch/move (MutationObserver)
	/* ------------------------------- */

	/*
	_beginTransformObserve: function() {
		if (!(Globals.BREAKPOINTS["desktop-small"].matches && this.model.get("bundle").get("media").selectedIndex <= 0 && this.model.get("collapsed"))) {
			return;
		}
		var target = document.querySelector(".carousel > .empty-item");
		if (target === null) {
			return;
		}
		if (!this._transformObserver) {
			this._transformObserver = new MutationObserver(this._onTransformMutation);
		}
		this._transformObserver.observe(target, { attributes: true, attributeFilter: ["style"] });
		this.touch.on("panend pancancel", this._endTransformObserve);
		this.transforms.get(this.keywordList.wrapper)
			.stopTransition()
			.clearOffset()
			.clearCapture()
			.validate();
	},

	_endTransformObserve: function() {
		this._transformObserver.disconnect();
		this.touch.off("panend pancancel", this._endTransformObserve);
		this.transforms.get(this.keywordList.wrapper)
			.clearOffset()
			.runTransition(tx.NOW)
			.validate();
	},

	_onTransformMutation: function(mutations) {
		var tView, tMetrics, tCss, dTxObj, pos;

		// this.keywordList.wrapper.style[prefixedProperty("transform")];
		// transform = mutations[0].target.style.getPropertyValue(prefixedProperty("transform"));

		tView = View.findByElement(mutations[0].target);
		if (tView) {
			tMetrics = tView.metrics;
			dTxObj = this.transforms.get(this.keywordList.wrapper);
			console.log("%s::_onTransformMutation [withMedia: %s] target: (%f\+%f) %f wrapper: (%f) %f", this.cid,
				this.model.has("media"),
				tMetrics.translateX, tMetrics.width, tMetrics.translateX + tMetrics.width,
				dTxObj.capturedX, tMetrics.translateX - dTxObj.capturedX,
				tMetrics
			);

			this.transforms.offset(tMetrics.translateX - dTxObj.capturedX, void 0, this.keywordList.wrapper);
			this.transforms.validate();
		}
	},
	*/
});

module.exports = NavigationView;

},{"app/control/Controller":40,"app/control/Globals":41,"app/model/collection/BundleCollection":45,"app/model/collection/KeywordCollection":46,"app/model/collection/TypeCollection":47,"app/view/base/TouchManager":62,"app/view/base/View":63,"app/view/component/FilterableListView":68,"app/view/component/GraphView":69,"app/view/component/GroupingListView":70,"hammerjs":"hammerjs","underscore":"underscore","utils/TransformHelper":103}],58:[function(require,module,exports){
/* global Path2D */
/**
 * @module app/view/component/progress/CanvasView
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:color} */
// var Color = require("color");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/Interpolator} */
var Interpolator = require("app/view/base/Interpolator");
/** @type {module:utils/css/getBoxEdgeStyles} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

var MIN_CANVAS_RATIO = 2; // /Firefox/.test(window.navigator.userAgent)? 2 : 1;

/**
 * @constructor
 * @type {module:app/view/component/progress/CanvasView}
 */
var CanvasView = View.extend({

	/** @type {string} */
	cidPrefix: "canvasView",
	/** @type {string} */
	tagName: "canvas",
	/** @type {string} */
	className: "canvas-view",

	properties: {
		context: {
			get: function() {
				return this._ctx;
			}
		},
		interpolator: {
			get: function() {
				return this._interpolator;
			}
		},
		canvasRatio: {
			get: function() {
				return this._canvasRatio;
			}
		},
	},

	/** @type {Object} */
	defaults: {
		values: {
			value: 0
		},
		maxValues: {
			value: 1
		},
		useOpaque: true,
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	initialize: function(options) {
		// TODO: cleanup this options mess
		options = _.defaults(options, this.defaults);
		options.values = _.defaults(options.values, this.defaults.values);
		options.maxValues = _.defaults(options.maxValues, this.defaults.maxValues);

		this._interpolator = new Interpolator(options.values, options.maxValues);

		// render props
		// this._color = options.color;
		// this._backgroundColor = options.backgroundColor;
		this._useOpaque = options.useOpaque;

		this._options = _.pick(options, "color", "backgroundColor");

		// mozOpaque
		// --------------------------------
		if (this._useOpaque) {
			this._opaqueProp = Modernizr.prefixed("opaque", this.el, false);
			if (this._opaqueProp) {
				this.el.classList.add("color-bg");
				// this.el[this._opaqueProp] = true;
			}
		}

		// canvas' context init
		// --------------------------------
		this._ctx = this.el.getContext("2d", { alpha: !this._useOpaque });

		// adjust canvas size to pixel ratio
		// upscale the canvas if the two ratios don't match
		// --------------------------------
		var ratio = MIN_CANVAS_RATIO;
		var ctxRatio = this._ctx.webkitBackingStorePixelRatio || 1;
		if (window.devicePixelRatio !== ctxRatio) {
			// ratio = Math.max(window.devicePixelRatio / ctxRatio, MIN_CANVAS_RATIO);
			ratio = window.devicePixelRatio / ctxRatio;
			ratio = Math.max(ratio, MIN_CANVAS_RATIO);
		}
		this._canvasRatio = ratio;
		// console.log("%s::init canvasRatio: %f", this.cid, this._canvasRatio);

		this.listenTo(this, "view:attached", function() {
			// this.invalidateSize();
			// this.renderNow();
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
		});
	},

	// _computeCanvasRatio: function() {
	// 	var ratio = MIN_CANVAS_RATIO;
	// 	var ctxRatio = this._ctx.webkitBackingStorePixelRatio || 1;
	// 	if (window.devicePixelRatio !== ctxRatio) {
	// 		// ratio = Math.max(window.devicePixelRatio / ctxRatio, MIN_CANVAS_RATIO);
	// 		ratio = window.devicePixelRatio / ctxRatio;
	// 		ratio = Math.max(ratio, MIN_CANVAS_RATIO);
	// 	}
	// 	this._canvasRatio = ratio;
	// },

	_updateCanvas: function() {
		// adjust canvas size to pixel ratio
		// upscale the canvas if the two ratios don't match
		// --------------------------------
		var s, m, w, h, edgeW, edgeH;

		s = getComputedStyle(this.el);
		m = getBoxEdgeStyles(s);
		edgeW = m.paddingLeft + m.paddingRight + m.borderLeftWidth + m.borderRightWidth;
		edgeH = m.paddingTop + m.paddingBottom + m.borderTopWidth + m.borderBottomWidth;
		w = this.el.offsetWidth;
		h = this.el.offsetHeight;

		this.el.width = this._canvasWidth = (w - edgeW) * this._canvasRatio;
		this.el.height = this._canvasHeight = (h - edgeH) * this._canvasRatio;
		// this.el.style.height = h + "px";
		// this.el.style.width = w + "px";

		// colors
		// --------------------------------
		this._color = s.color || this._options.color || Globals.DEFAULT_COLORS["color"];
		this._backgroundColor = s.backgroundColor || this._options.backgroundColor || Globals.DEFAULT_COLORS["background-color"];

		// mozOpaque
		// --------------------------------
		if (this._useOpaque && this._opaqueProp) {
			// this.el.style.backgroundColor = this._backgroundColor;
			this.el[this._opaqueProp] = true;
		}

		// fontSize
		// --------------------------------
		this._fontSize = parseFloat(s.fontSize) * this._canvasRatio;
		this._fontFamily = s.fontFamily;

		// prepare canvas context
		// --------------------------------
		this._ctx.restore();

		this._ctx.font = [s.fontWeight, s.fontStyle, this._fontSize + "px/1", s.fontFamily].join(" ");
		this._ctx.textAlign = "left";
		this._ctx.lineCap = "butt";
		this._ctx.lineJoin = "miter";
		this._ctx.strokeStyle = this._color;
		this._ctx.fillStyle = this._color;

		this.updateCanvas(this._ctx);
		this._ctx.save();

		// console.group(this.cid+"::_updateCanvas");
		// console.log("ratio:    %f (min: %f, device: %f, context: %s)", this._canvasRatio, MIN_CANVAS_RATIO, window.devicePixelRatio, this._ctx.webkitBackingStorePixelRatio || "(webkit-only)");
		// console.log("colors:   fg: %s bg: %s", this._color, this._backgroundColor);
		// console.log("style:    %s, %s, padding: %s (%s)", s.width, s.height, s.padding, s.boxSizing);
		// console.log("box:      %f x %f px", m.width, m.height);
		// console.log("measured: %f x %f px", w, h);
		// console.log("canvas:   %f x %f px", this._canvasWidth, this._canvasHeight);
		// console.groupEnd();
	},

	updateCanvas: function() {

	},

	_getFontMetrics: function(str) {
		var key, idx, mObj, mIdx = str.length;
		for (key in Globals.FONT_METRICS) {
			idx = str.indexOf(key);
			if (idx !== -1 && idx < mIdx) {
				mIdx = idx;
				mObj = Globals.FONT_METRICS[key];
			}
		}
		return mObj;
	},

	_clearCanvas: function(x, y, w, h) {
		this._ctx.clearRect(x, y, w, h);
		if (this._useOpaque) {
			this._ctx.save();
			this._ctx.fillStyle = this._backgroundColor;
			this._ctx.fillRect(x, y, w, h);
			this._ctx.restore();
		}
	},

	/* --------------------------- *
	/* render
	/* --------------------------- */

	/** @override */
	render: function() {
		if (this.attached) {
			return this.renderNow();
		}
		return this;
	},

	/** @override */
	renderFrame: function(tstamp, flags) {
		if (!this.attached) {
			return flags;
		}
		if (flags & View.SIZE_INVALID) {
			this._updateCanvas();
		}
		if (this._interpolator.valuesChanged) {
			flags |= View.LAYOUT_INVALID;
			this._interpolator.interpolate(tstamp);
		}
		if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
			this.redraw(this._ctx, this._interpolator);
			if (this._interpolator.valuesChanged) {
				this.requestRender();
			}
		}
	},

	/* --------------------------- *
	/* public
	/* --------------------------- */

	getValue: function(key) {
		return this._interpolator.getValue(key);
	},

	getRenderedValue: function(key) {
		return this._interpolator.getRenderedValue(key);
	},

	valueTo: function(value, duration, key) {
		this._interpolator.valueTo(value, duration, key);
		this.requestRender(View.MODEL_INVALID | View.LAYOUT_INVALID);
	},

	// updateValue: function(key) {
	// 	return this._interpolator.updateValue(key || this.defaultKey);
	// },

	/* --------------------------- *
	/* redraw
	/* --------------------------- */

	redraw: function(context, changed) {},

});

if (DEBUG) {
	CanvasView.prototype._skipLog = true;
}

module.exports = CanvasView;

},{"app/control/Globals":41,"app/view/base/Interpolator":60,"app/view/base/View":63,"underscore":"underscore","utils/css/getBoxEdgeStyles":107}],59:[function(require,module,exports){
// /** @type {module:utils/setImmediate} */
// var setImmediate = require("utils/setImmediate");

// function sortByPriority(a, b) {
// 	if (a.priority > b.priority)
// 		return 1;
// 	if (a.priority < b.priority)
// 		return -1;
// 	return 0;
// }

function RequestQueue(offset) {
	this._offset = offset | 0;
	this._items = [];
	this._priorities = [];
	this._numItems = 0;
}

RequestQueue.prototype = Object.create({
	enqueue: function(item, priority) {
		var i = this._items.length;
		this._items[i] = item;
		this._priorities[i] = {
			priority: (priority | 0),
			index: i
		};
		this._numItems++;
		// console.log("FrameQueue::RequestQueue::enqueue() [numItems:%i] ID:%i", this._numItems, this._offset + i);
		return this._offset + i;
	},

	contains: function(index) {
		index -= this.offset;
		return 0 <= index && index < this._items.length;
	},

	skip: function(index) {
		var i, item;
		i = index - this._offset;
		if (0 > i || i >= this._items.length) {
			// 	console.warn("FrameQueue::RequestQueue::skip(id:%i) out of range (%i-%i)", index, this._offset, this._offset + (this._numItems - 1));
			return void 0;
		}
		item = this._items[i];
		if (item !== null) {
			// if (item = this._items[i]) {
			this._items[i] = null;
			this._numItems--;

			// if (this._numItems == 0) {
			// 	this._empty(this._offset + this._items.length);
			// }
			// console.log("FrameQueue::RequestQueue::skip(id:%i) [numItems:%i] skipping", index, this._numItems);
		}
		// else {
		// 	console.warn("FrameQueue::RequestQueue::skip(id:%i) [numItems:%i] item is null", index, this._numItems);
		// }
		return item;
	},

	// forEach: function(fn, context) {
	// 	return this.items.forEach(fn, context);
	// },

	indexes: function() {
		// .map(function(o, i, a) {
		// 	return this[o.index];
		// }, this._items);
		var items = this._priorities.concat();
		items.sort(function(a, b) {
			if (a.priority > b.priority)
				return 1;
			if (a.priority < b.priority)
				return -1;
			return 0;
		});
		items.forEach(function(o, i, a) {
			a[i] = o.index;
		}, this);
		return items;
	},

	items: function() {
		// .map(function(o, i, a) {
		// 	return this[o.index];
		// }, this._items);
		var items = this._priorities.concat();
		items.sort(function(a, b) {
			if (a.priority > b.priority)
				return 1;
			if (a.priority < b.priority)
				return -1;
			return 0;
		});
		items.forEach(function(o, i, a) {
			a[i] = this._items[o.index];
		}, this);
		return items;
	},

	_empty: function(offset) {
		this._offset = offset;
		this._items.length = 0;
		this._priorities.length = 0;
		this._numItems = 0;
	}
}, {

	offset: {
		get: function() {
			return this._offset;
		}
	},

	length: {
		get: function() {
			return this._items.length;
		}
	},

	numItems: {
		get: function() {
			return this._numItems;
		}
	},
});

var _nextQueue = new RequestQueue(0);
var _currQueue = null;

var _pending = false;
var _running = false;
var _rafId = -1;

/**
/* @param tstamp {int}
/*/
var _runQueue = function(tstamp) {
	if (_running) throw new Error("wtf!!!");

	_rafId = -1;
	_running = true;
	_currQueue = _nextQueue;
	_nextQueue = new RequestQueue(_currQueue.offset + _currQueue.length);

	// _currQueue.items().forEach(function(fn, i, a) {
	// 	if (fn !== null) {
	// 		fn(tstamp);
	// 	}
	// });
	_currQueue.indexes().forEach(function(index, i, a) {
		var fn = _currQueue._items[index];
		if (fn !== null) {
			fn(tstamp);
		}
	});
	_running = false;
	_currQueue = null;

	if (_nextQueue.numItems > 0) {
		_rafId = window.requestAnimationFrame(_runQueue);
	}
};

var FrameQueue = Object.create({
	/**
	/* @param fn {Function}
	/* @param forceNext {int}
	/* @return {int}
	/*/
	request: function(fn, priority) {
		// if (!_running && !_pending) {
		// 	_pending = true;
		// 	console.warn("FrameQueue::request setImmediate: pending");
		// 	setImmediate(function() {
		// 		_pending = false;
		// 		if (_nextQueue.numItems > 0) {
		// 			_rafId = window.requestAnimationFrame(_runQueue);
		// 			console.warn("FrameQueue::request setImmediate: raf:%i for %i items", _rafId, _nextQueue.numItems);
		// 		} else {
		// 			console.warn("FrameQueue::request setImmediate: no items");
		// 		}
		// 	});
		// }
		if (!_running && _rafId === -1) {
			_rafId = window.requestAnimationFrame(_runQueue);
		}
		return _nextQueue.enqueue(fn, priority);
	},

	/**
	/* @param id {int}
	/* @return {Function?}
	/*/
	cancel: function(id) {
		var fn;
		if (_running) {
			fn = _currQueue.skip(id) || _nextQueue.skip(id);
		} else {
			fn = _nextQueue.skip(id);
			if ((_rafId !== -1) && (_nextQueue.numItems === 0)) {
				window.cancelAnimationFrame(_rafId);
				_rafId = -1;
			}
		}
		return fn;
	},
}, {
	running: {
		get: function() {
			return _running;
		}
	}
});

if (DEBUG) {
	/** @type {module:underscore} */
	var _ = require("underscore");

	// console.info("Using app/view/base/FrameQueue");

	// 	// // log frame exec time
	// 	// var _now = window.performance? 
	// 	// 	window.performance.now.bind(window.performance) :
	// 	// 	Date.now.bind(Date);
	// 	// _runQueue = _.wrap(_runQueue, function(fn, tstamp) {
	// 	// 	var retval, tframe;
	// 	// 	console.log("[FRAME BEGIN] [%ims] %i items [ids:%i-%i]", tstamp, _nextQueue.numItems, _nextQueue.offset, _nextQueue.offset + _nextQueue.length);
	// 	// 	tframe = _now();
	// 	// 	retval = fn(tstamp);
	// 	// 	tframe = _now() - tframe;
	// 	// 	console.log("[FRAME ENDED] [%ims] took %ims\n---\n", tstamp + tframe, tframe);
	// 	// 	if (_nextQueue.numItems != 0) console.info("[FRAME ENDED] %i items scheduled for [raf:%i]", _nextQueue.numItems, _rafId);
	// 	// 	return retval;
	// 	// });
	// 	
	// 	// log frame end
	// 	_runQueue = _.wrap(_runQueue, function(fn, tstamp) {
	// 		var retval;
	// 		console.log("FrameQueue::_runQueue %i items (ID range:%i-%i)", _nextQueue.numItems, _nextQueue.offset, _nextQueue.offset + _nextQueue.length - 1);
	// 		retval = fn(tstamp);
	// 		console.log("[Frame exit]\n---\n");
	// 		return retval;
	// 	});

	// use log prefix
	_runQueue = _.wrap(_runQueue, function(fn, tstamp) {
		var retval, logprefix;
		logprefix = console.prefix;
		console.prefix += "[raf:" + _rafId + "] ";
		retval = fn(tstamp);
		console.prefix = logprefix;
		return retval;
	});

	// FrameQueue.cancel = _.wrap(FrameQueue.cancel, function(fn, id) {
	// 	if ((_currQueue !== null) && (_currQueue.offset >= id) && (id < _nextQueue.offset)) {
	// 		console.info("FrameQueue::cancel ID:%i in running range (%i-%i)", id, _currQueue.offset, _nextQueue.offset - 1);
	// 	}
	// 	var rafId = _rafId;
	// 	var retval = fn(id);
	// 	if (retval === void 0) {
	// 		console.warn("FrameQueue::cancel ID:%i not found", id);
	// 	} else if (retval === null) {
	// 		console.warn("FrameQueue::cancel ID:%i already cancelled", id);
	// 	} else {
	// 		if (!_running && _nextQueue.numItems == 0) {
	// 			console.info("FrameQueue::cancel raf:%i cancelled (ID:%i cancelled, empty queue)", rafId, id);
	// 		}
	// 	}
	// 	return retval;
	// });
}


module.exports = FrameQueue;

},{"underscore":"underscore"}],60:[function(require,module,exports){
/**
 * @module app/view/base/Interpolator
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
/** @type {module:utils/ease/linear} */
var linear = require("utils/ease/linear");

/**
 * @constructor
 * @type {module:app/view/base/Interpolator}
 */
function Interpolator(values, maxValues) {
	this._valueData = {};
	this._maxValues = {};
	this._renderableKeys = [];

	var key, val, maxVal;
	for (key in values) {
		val = values[key];
		maxVal = maxValues[key] || null;
		// create value object and store it
		this._valueData[key] = this._initValue(val, 0, maxVal);
		// add maxValue to store
		this._maxValues[key] = maxVal;
		// add to next render list
		this._renderableKeys.push(key);
	}
	this._valuesChanged = this._renderableKeys.length > 0;
}

Interpolator.prototype = Object.create({

	/* --------------------------- *
	/* public interface
	/* --------------------------- */

	isAtTarget: function(key) {
		return this._renderableKeys.indexOf(key) === -1;
	},

	getValue: function(key) {
		return this._valueData[key]._value;
	},

	getRenderedValue: function(key) {
		return this._valueData[key]._renderedValue;
	},

	valueTo: function(value, duration, key) {
		var changed, dataObj = this._valueData[key];
		// console.log("%s::valueTo [%s]", "[interpolator]", key, value);
		if (Array.isArray(dataObj)) {
			changed = value.reduce(function(prevChanged, itemValue, i) {
				if (dataObj[i]) {
					dataObj[i] = this._initNumber(itemValue, duration, this._maxValues[key]);
					return true;
				} else {
					return this._setValue(itemValue, duration, dataObj[i]) || prevChanged;
				}
			}.bind(this), changed);
		} else {
			changed = this._setValue(value, duration, dataObj);
		}
		if (changed) {
			this._renderableKeys.indexOf(key) !== -1 || this._renderableKeys.push(key);
			this._valuesChanged = true;
			// this.render();
			// this.requestRender();
		}
		return this;
	},

	updateValue: function(key) {
		// Call _interpolateValue only if needed. _interpolateValue() returns false
		// once interpolation is done, in which case remove key from _renderableKeys.
		var kIndex = this._renderableKeys.indexOf(key);
		if (kIndex !== -1 && !this._interpolateValue(key)) {
			this._renderableKeys.splice(kIndex, 1);
			this._valuesChanged = this._renderableKeys.length > 0;
		}
		return this;
	},

	/* --------------------------- *
	/* private: valueData
	/* --------------------------- */

	_initValue: function(value, duration, maxVal) {
		if (Array.isArray(value)) {
			return value.map(function(val) {
				return this._initNumber(val, 0, maxVal);
			}, this);
		} else {
			return this._initNumber(value, 0, maxVal);
		}
	},

	// _initArray: function(value, duration, maxVal) {
	// 	return val.map(function(val) {
	// 		return this._initNumber(val, 0, maxVal);
	// 	}, this);
	// },

	_initNumber: function(value, duration, maxVal) {
		var o = {};
		o._value = value;
		o._startValue = value;
		o._valueDelta = 0;

		o._duration = duration || 0;
		o._startTime = -1;
		o._elapsedTime = 0;

		o._lastRenderedValue = o._renderedValue = null;

		o._maxVal = maxVal;
		// if (maxVal !== void 0) o._maxVal = maxVal;
		// o._maxVal = this._maxValues[key];
		// o._maxVal = this._maxVal;// FIXME
		return o;
	},

	_setValue: function(value, duration, o) {
		if (o._value != value) {
			o._startValue = o._value;
			o._valueDelta = value - o._value;
			o._value = value;

			o._duration = duration || 0;
			o._startTime = -1;
			o._elapsedTime = 0;

			o._lastRenderedValue = o._renderedValue;

			return true;
		}
		return false;
	},

	/* --------------------------- *
	/* private: interpolate
	/* --------------------------- */

	/** @override */
	interpolate: function(tstamp) {
		if (this._valuesChanged) {
			this._valuesChanged = false;

			var changedKeys = this._renderableKeys;
			this._tstamp = tstamp;
			this._renderableKeys = changedKeys.filter(this._interpolateValue, this);
			this._renderedKeys = changedKeys;

			if (this._renderableKeys.length !== 0) {
				this._valuesChanged = true;
				// 	// this.requestRender();
			}
		}
		// console.log("%s::interpolate valuesChanged:%s tstamp:%f", "[interpolator]", this._valuesChanged, tstamp);
		// return this._valuesChanged;
		// return this.valuesChanged;

		return this;
	},

	_interpolateValue: function(key) {
		var dataObj = this._valueData[key];
		if (Array.isArray(dataObj)) {
			return dataObj.reduce(function(continueNext, o, index, arr) {
				return this._interpolateNumber(this._tstamp, o) || continueNext;
			}.bind(this), false);
		} else {
			return this._interpolateNumber(this._tstamp, dataObj);
		}
	},

	_interpolateNumber: function(tstamp, o) {
		if (o._startTime < 0) {
			o._startTime = tstamp;
		}
		var elapsed = tstamp - o._startTime;
		o._elapsedTime = elapsed;
		o._lastRenderedValue = o._renderedValue;
		if (elapsed < o._duration) {
			if (o._maxVal && o._valueDelta < 0) {
				// upper-bound values
				o._renderedValue = linear(elapsed, o._startValue,
					o._valueDelta + o._maxVal, o._duration) - o._maxVal;
			} else {
				// unbound values
				o._renderedValue = linear(elapsed, o._startValue,
					o._valueDelta, o._duration);
			}
			return true;
		} else {
			o._renderedValue = o._value;
			return false;
		}
	},
}, {
	valuesChanged: {
		get: function() {
			return this._valuesChanged;
		}
	},
	renderableKeys: {
		get: function() {
			return this._renderableKeys;
		}
	},
	renderedKeys: {
		get: function() {
			return this._renderedKeys;
		}
	},
});

module.exports = Interpolator;

},{"utils/ease/linear":108}],61:[function(require,module,exports){
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

var eventMap = {
	"transitionend": prefixedEvent("transitionend"),
	"fullscreenchange": prefixedEvent("fullscreenchange", document),
	"fullscreenerror": prefixedEvent("fullscreenerror", document),
	"visibilitychange": prefixedEvent("visibilitychange", document, "hidden")
};

var eventNum = 0;
for (var eventName in eventMap) {
	if (eventName === eventMap[eventName]) {
		delete eventMap[eventName];
	} else {
		Object.defineProperty(eventMap, eventName, {
			value: eventMap[eventName],
			enumerable: true
		});
		Object.defineProperty(eventMap, eventNum, {
			value: eventName,
			enumerable: false
		});
		eventNum++;
	}
}
Object.defineProperty(eventMap, "length", {
	value: eventNum
});

if (DEBUG) {
	console.log("prefixes enabled for %i events", eventMap.length, Object.keys(eventMap));
}

module.exports = eventMap;

// module.exports = eventNum > 0? eventMap : null;

},{"utils/prefixedEvent":111}],62:[function(require,module,exports){
/**
 * @module app/view/base/TouchManager
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");
/** @type {module:utils/touch/SmoothPanRecognizer} */
var SmoothPan = require("utils/touch/SmoothPanRecognizer");
// var SmoothPan = Hammer.Pan;
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

/* -------------------------------
/* Static private
/* ------------------------------- */

/**
 * @type {Hammer.Manager}
 */
var instance = null;

function createInstance(el) {
	var recognizers = [];
	var manager = new Hammer.Manager(el);

	var hpan = new SmoothPan({
		// var hpan = new Hammer.Pan({
		threshold: Globals.THRESHOLD,
		direction: Hammer.DIRECTION_HORIZONTAL,
	});
	recognizers.push(hpan);

	var vpan = new SmoothPan({
		event: "vpan",
		threshold: Globals.THRESHOLD,
		direction: Hammer.DIRECTION_VERTICAL,
	});
	recognizers.push(vpan);
	vpan.requireFailure(hpan);

	var tap = new Hammer.Tap({
		// threshold: Globals.THRESHOLD - 1,
		// interval: 50,
		// time: 200,
	});
	recognizers.push(tap);
	tap.recognizeWith(hpan);

	manager.add(recognizers);
	// manager.set({ domevents: true});
	return manager;
}

/*https://gist.githubusercontent.com/jtangelder/361052976f044200ea17/raw/f54c2cef78d59da3f38286fad683471e1c976072/PreventGhostClick.js*/

// function	logEvent(message) {
// 	console.log(message, domev.type,
// 		"panSessionOpened: " + panSessionOpened,
// 		"defaultPrevented: " + domev.defaultPrevented
// 	);
// }

var lastTimeStamp = -1;
var panSessionOpened = false;

var touchHandlers = {
	"panstart panend pancancel vpanstart vpanend vpancancel": function(hev) {
		panSessionOpened = !hev.isFinal;
		if (hev.isFinal)
			lastTimeStamp = hev.srcEvent.timeStamp;
	}
};

var captureHandlers = {
	"click": function(domev) {
		if (lastTimeStamp == domev.timeStamp) {
			lastTimeStamp = -1;
			domev.defaultPrevented || domev.preventDefault();
			domev.stopPropagation();
		}
	},
	"dragstart": function(domev) {
		if (domev.target.nodeName == "IMG") {
			domev.defaultPrevented || domev.preventDefault();
		}
	},
	"mouseup": function(domev) {
		panSessionOpened && domev.preventDefault();
	}
};

var bubblingHandlers = {};

/* -------------------------------
/* Static public
/* ------------------------------- */
var TouchManager = {

	init: function(target) {
		if (instance === null) {
			instance = createInstance(target);

			var eventName, el = instance.element;
			for (eventName in touchHandlers) {
				if (touchHandlers.hasOwnProperty(eventName)) {
					instance.on(eventName, touchHandlers[eventName]);
				}
			}
			for (eventName in captureHandlers) {
				if (captureHandlers.hasOwnProperty(eventName)) {
					el.addEventListener(eventName, captureHandlers[eventName], true);
				}
			}
			for (eventName in bubblingHandlers) {
				if (bubblingHandlers.hasOwnProperty(eventName)) {
					el.addEventListener(eventName, bubblingHandlers[eventName], false);
				}
			}
		} else if (instance.element !== target) {
			console.warn("TouchManager already initialized with another element");
		}
		return instance;
	},

	destroy: function() {
		if (instance !== null) {
			var eventName, el = instance.element;
			for (eventName in captureHandlers) {
				if (captureHandlers.hasOwnProperty(eventName)) {
					el.removeEventListener(eventName, captureHandlers[eventName], true);
				}
			}
			for (eventName in bubblingHandlers) {
				if (captureHandlers.hasOwnProperty(eventName)) {
					el.removeEventListener(eventName, bubblingHandlers[eventName], true);
				}
			}
			instance.destroy();
			instance = null;
		} else {
			console.warn("no instance to destroy");
		}
	},

	getInstance: function() {
		if (instance === null) {
			console.error("TouchManager has not been initialized");
		}
		return instance;
	}
};

module.exports = TouchManager;

},{"app/control/Globals":41,"hammerjs":"hammerjs","utils/touch/SmoothPanRecognizer":118}],63:[function(require,module,exports){
/* global HTMLElement, MutationObserver */
/**
 * @module app/view/base/View
 */

/** @type {module:backbone} */
var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");

/* -------------------------------
/* MutationObserver
/* ------------------------------- */

var _cidSeed = 1;
var _viewsByCid = {};

function addChildViews(el) {
	var view, els = el.querySelectorAll("*[data-cid]");
	for (var i = 0, ii = els.length; i < ii; i++) {
		view = View.findByElement(els.item(i));
		if (view) {
			if (!view.attached) {
				// console.log("View::[attached (parent)] %s", view.cid);
				view._elementAttached();
				// } else {
				// 	console.warn("View::[attached (parent)] %s (ignored)", view.cid);
			}
		}
	}
}

function removeChildViews(el) {
	var view, els = el.querySelectorAll("*[data-cid]");
	for (var i = 0, ii = els.length; i < ii; i++) {
		view = View.findByElement(els.item(i));
		if (view) {
			if (view.attached) {
				console.log("View::[detached (parent)] %s", view.cid);
				view._elementDetached();
			} else {
				console.warn("View::[detached (parent)] %s (ignored)", view.cid);
			}
		}
	}
}

var observer = new MutationObserver(function(mm) {
	// console.log("View::mutations %s", JSON.stringify(mm, null, " "));
	var i, ii, m;
	var j, jj, e;
	var view;
	for (i = 0, ii = mm.length; i < ii; i++) {
		m = mm[i];
		if (m.type == "childList") {
			for (j = 0, jj = m.addedNodes.length; j < jj; j++) {
				e = m.addedNodes.item(j);
				view = View.findByElement(e);
				if (view) {
					if (!view.attached) {
						// console.log("View::[attached (childList)] %s", view.cid);
						view._elementAttached();
						// } else {
						// 	console.warn("View::[attached (childList)] %s (ignored)", view.cid);
					}
				}
				if (e instanceof HTMLElement) addChildViews(e);
			}
			for (j = 0, jj = m.removedNodes.length; j < jj; j++) {
				e = m.removedNodes.item(j);
				// console.log("View::[detached (childList)] %s", e.cid);
				view = View.findByElement(e);
				if (view) {
					if (view.attached) {
						console.log("View::[detached (childList)] %s", view.cid, view.attached);
						view._elementDetached();
					} else {
						console.warn("View::[detached (childList)] %s (ignored)", view.cid, view.attached);
					}
				}
				if (e instanceof HTMLElement) removeChildViews(e);
			}
		} else if (m.type == "attributes") {
			view = View.findByElement(m.target);
			if (view) {
				if (!view.attached) {
					// console.log("View::[attached (attribute)] %s", view.cid);
					view._elementAttached();
					// } else {
					// 	console.warn("View::[attached (attribute)] %s (ignored)", view.cid);
				}
			}
			// else {
			// 	console.warn("View::[attributes] target has no cid (%s='%s')", m.attributeName, m.target.getAttribute(m.attributeName), m);
			// }
		}
	}
});

observer.observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true,
	attributeFilter: ["data-cid"]
});

/* -------------------------------
/* static private
/* ------------------------------- */

/** @type {module:app/view/base/FrameQueue} */
var FrameQueue = require("app/view/base/FrameQueue");

/** @type {module:app/view/base/PrefixedEvents} */
var PrefixedEvents = require("app/view/base/PrefixedEvents");

var _now = window.performance ?
	window.performance.now.bind(window.performance) :
	Date.now.bind(Date);
// var _now = window.performance?
// 	function() { return window.performance.now(); }:
// 	function() { return Date.now(); };

var applyEventPrefixes = function(events) {
	var selector, unprefixed;
	for (selector in events) {
		unprefixed = selector.match(/^\w+/i)[0];
		if (PrefixedEvents.hasOwnProperty(unprefixed)) {
			events[selector.replace(unprefixed, PrefixedEvents[unprefixed])] = events[selector];
			// console.log("applyEventPrefixes", unprefixed, prefixedEvents[unprefixed]);
			delete events[selector];
		}
	}
	return events;
};

var getViewDepth = function(view) {
	if (!view) {
		return null;
	}
	if (!view.attached) {
		return NaN;
	}
	if (view.parentView === null) {
		return 0;
	}
	return view.parentView.viewDepth + 1;
};

function logAttachInfo(view, name, level) {
	if (["log", "info", "warn", "error"].indexOf(level) != -1) {
		level = "log";
	}
	console[level].call(console, "%s::%s [parent:%s %s %s depth:%s]", view.cid, name, view.parentView && view.parentView.cid, view.attached ? "attached" : "detached", view._viewPhase, view.viewDepth);
}

/* -------------------------------
/* static public
/* ------------------------------- */


var View = {

	/** @const */
	NONE_INVALID: 0,
	/** @const */
	CHILDREN_INVALID: 1,

	/** @const */
	MODEL_INVALID: 2,
	/** @const */
	STYLES_INVALID: 4,
	/** @const */
	SIZE_INVALID: 8,
	/** @const */
	LAYOUT_INVALID: 16,

	/** @const */
	// RENDER_INVALID: 8 | 16,

	/** @type {module:app/view/base/ViewError} */
	ViewError: require("app/view/base/ViewError"),

	/** @type {module:utils/prefixedProperty} */
	prefixedProperty: require("utils/prefixedProperty"),

	/** @type {module:utils/prefixedStyleName} */
	prefixedStyleName: require("utils/prefixedStyleName"),

	/** @type {module:utils/prefixedEvent} */
	prefixedEvent: require("utils/prefixedEvent"),

	// /** @type {module:utils/setImmediate} */
	// setImmediate: require("utils/setImmediate"),

	/** @type {module:app/view/promise/whenViewIsAttached} */
	whenViewIsAttached: require("app/view/promise/whenViewIsAttached"),

	/**
	/* @param el {HTMLElement}
	/* @return {module:app/view/base/View}
	/*/
	findByElement: function(el) {
		if (_viewsByCid[el.cid]) {
			return _viewsByCid[el.cid];
		}
		return null;
	},

	/**
	/* @param el {HTMLElement}
	/* @return {module:app/view/base/View}
	/*/
	findByDescendant: function(el) {
		do {
			if (_viewsByCid[el.cid]) {
				return _viewsByCid[el.cid];
			}
		} while ((el = el.parentElement || el.parentNode));
		return null;
	},

	/** @override */
	extend: function(proto, obj) {
		if (PrefixedEvents.length && proto.events) {
			if (_.isFunction(proto.events)) {
				proto.events = _.wrap(proto.events, function(fn) {
					return applyEventPrefixes(fn.apply(this));
				});
			} else
			if (_.isObject(proto.events)) {
				proto.events = applyEventPrefixes(proto.events);
			}
		}
		if (proto.properties && this.prototype.properties) {
			_.defaults(proto.properties, this.prototype.properties);
		}
		return Backbone.View.extend.apply(this, arguments);
	},

	_flagsToStrings: ["-"],

	flagsToString: function(flags) {
		var s = View._flagsToStrings[flags | 0];
		if (!s) {
			s = [];
			if (flags & View.CHILDREN_INVALID) s.push("children");
			if (flags & View.MODEL_INVALID) s.push("model");
			if (flags & View.STYLES_INVALID) s.push("styles");
			if (flags & View.SIZE_INVALID) s.push("size");
			if (flags & View.LAYOUT_INVALID) s.push("layout");
			View._flagsToStrings[flags] = s = s.join(" ");
		}
		return s;
		// return (flags | 0).toString(2);
	},
};

Object.defineProperty(View, "instances", {
	value: _viewsByCid,
	enumerable: true
});

/* -------------------------------
/* prototype
/* ------------------------------- */

var ViewProto = {

	/** @type {string} */
	cidPrefix: "view",
	/** @type {Boolean} */
	_attached: false,
	/** @type {HTMLElement|null} */
	_parentView: null,
	/** @type {int|null} */
	_viewDepth: null,
	/** @type {string} initializing > initialized > disposing > disposed */
	_viewPhase: "initializing",
	/** @type {int} */
	_frameQueueId: -1,
	/** @type {int} */
	_renderFlags: 0,

	/** @type {object} */
	properties: {
		cid: {
			get: function() {
				return this._cid || (this._cid = this.cidPrefix + _cidSeed++);
			}
		},
		attached: {
			get: function() {
				return this._attached;
			}
		},
		parentView: {
			get: function() {
				return this._parentView;
			}
		},
		viewDepth: {
			get: function() {
				return this._getViewDepth();
			}
		},
		invalidated: {
			get: function() {
				return this._frameQueueId !== -1;
			}
		},
		enabled: {
			get: function() {
				return this._enabled;
			},
			set: function(enabled) {
				this.setEnabled(enabled);
			}
		},
	},

	/**
	 * @constructor
	 * @type {module:app/view/base/View}
	 */
	constructor: function(options) {
		this.transform = {};
		this.childViews = {};
		this._applyRender = this._applyRender.bind(this);

		if (this.properties) {
			// Object.defineProperties(this, getPrototypeChainValue(this, "properties", Backbone.View));
			Object.defineProperties(this, this.properties);
		}
		if (options && options.className && this.className) {
			options.className += " " + _.result(this, "className");
		}
		if (options && options.parentView) {
			this._setParentView(options.parentView, true);
		}
		Backbone.View.apply(this, arguments);

		// console.log("%s::initialize viewPhase:[%s => initialized]", this.cid, this._viewPhase);
		this._viewPhase = "initialized";

		if (this.parentView !== null) {
			this.trigger("view:parentChange", this.parentView, null);
		}
		if (this.attached) {
			this.trigger("view:attached", this);
		}
	},

	/* -------------------------------
	/* remove
	/* ------------------------------- */

	/** @override */
	remove: function() {
		if (this._viewPhase == "disposing") {
			logAttachInfo(this, "remove", "warn");
		} else {
			// logAttachInfo(this, "remove", "log");
		}

		// before removal
		this._viewPhase = "disposing";
		this._cancelRender();

		// call Backbone impl
		// Backbone.View.prototype.remove.apply(this, arguments);

		// NOTE: from Backbone impl
		this.$el.remove(); // from Backbone impl

		this._attached = false;
		this.trigger("view:removed", this);

		// remove parent/child references
		this._setParentView(null);

		// NOTE: from Backbone impl. No more events after this
		this.stopListening();

		// check for invalidations that may have been triggered by "view:removed"
		if (this.invalidated) {
			console.warn("%s::remove invalidated after remove()", this.cid);
			this._cancelRender();
		}
		// // check for children still here
		// var ccids = Object.keys(this.childViews);
		// if (ccids.length) {
		// 	console.warn("%s::remove %i children not removed [%s]", this.cid, ccids.length, ccids.join(", "), this.childViews);
		// }
		// // remove childViews
		// for (var cid in this.childViews) {
		// 	this.childViews[cid].remove();
		// }
		// clear reference in view map
		delete _viewsByCid[this.cid];
		// delete this.el.cid;
		// update phase
		this._viewPhase = "disposed";
		return this;
	},

	/* -------------------------------
	/* _elementAttached _elementDetached
	/* ------------------------------- */

	_elementAttached: function() {
		// this._addToParentView();
		this._attached = true;
		this._viewDepth = null;
		this._setParentView(View.findByDescendant(this.el.parentElement));

		// if (this.parentView) {
		// 	console.log("[attach] [%i] %s > %s::_elementAttached", this.viewDepth, this.parentView.cid, this.cid);
		// } else {
		// 	console.log("[attach] [%i] %s::_elementAttached", this.viewDepth, this.cid);
		// }

		// if (this._viewPhase == "initializing") {
		// 	// this.trigger("view:attached", this);
		// } else
		if (this._viewPhase == "initialized") {
			this.trigger("view:attached", this);
		} else
		if (this._viewPhase == "replacing") {
			this._viewPhase = "initialized";
			this.trigger("view:replaced", this);
		}
	},

	_elementDetached: function() {
		if (!this.attached || (this._viewPhase == "disposing") || (this._viewPhase == "disposed")) {
			logAttachInfo(this, "_elementDetached", "error");
			// } else {
			// 	logAttachInfo(this, "_elementDetached", "log");
		}
		this._attached = false;
		this._viewDepth = null;

		if (this._viewPhase != "disposing" || this._viewPhase == "disposed") {
			this.remove();
		}
	},

	/* -------------------------------
	/* parentView
	/* ------------------------------- */

	_setParentView: function(newParent, silent) {
		if (newParent === void 0) {
			console.warn("$s::_setParentView invalid value '%s'", this.cid, newParent);
			newParent = null;
		}
		var oldParent = this._parentView;
		this._parentView = newParent;

		// force update of _viewDepth
		this._viewDepth = null; //getViewDepth(this);

		// skip the rest if arg is the same
		if (newParent === oldParent) {
			return;
		}
		if (oldParent !== null) {
			if (this.cid in oldParent.childViews) {
				delete oldParent.childViews[this.cid];
			}
		}
		if (newParent !== null) {
			newParent.childViews[this.cid] = this;
		}
		if (!silent)
			this.trigger("view:parentChange", this, newParent, oldParent);
	},

	whenAttached: function() {
		return View.whenViewIsAttached(this);
	},

	_getViewDepth: function() {
		if (this._viewDepth === null) {
			this._viewDepth = getViewDepth(this);
		}
		return this._viewDepth;
	},

	/* -------------------------------
	/* Backbone.View overrides
	/* ------------------------------- */

	/** @override */
	setElement: function(element, delegate) {
		// setElement always initializes this.el, so check it to be non-null before calling super
		if (this.el) {
			if (this.el !== element && this.el.parentElement) {
				// Element is being replaced
				if (this.attached) {
					// Since old element is attached to document tree, _elementAttached will be
					// triggered by replaceChild: set _viewPhase = "replacing" to flag this
					// change and trigger 'view:replaced' instead of 'view:added'.
					this._viewPhase = "replacing";
				}
				this.el.parentElement.replaceChild(element, this.el);
			}
			Backbone.View.prototype.setElement.apply(this, arguments);
			// Merge classes specified by this view with the ones already in the element,
			// as backbone will not:
			if (this.className) {
				_.result(this, "className").split(" ").forEach(function(item) {
					this.el.classList.add(item);
				}, this);
			}
		} else {
			Backbone.View.prototype.setElement.apply(this, arguments);
		}

		if (this.el === void 0) {
			throw new Error("Backbone view has no element");
		}
		_viewsByCid[this.cid] = this;
		this.el.cid = this.cid;
		this.el.setAttribute("data-cid", this.cid);

		return this;
	},

	/* -------------------------------
	/* requestAnimationFrame
	/* ------------------------------- */

	requestAnimationFrame: function(callback, priority, ctx) {
		return FrameQueue.request(callback.bind(ctx || this), priority);
	},

	cancelAnimationFrame: function(id) {
		return FrameQueue.cancel(id);
	},

	setImmediate: function(callback, ctx) {
		window.setImmediate(callback.bind(ctx || this));
	},

	/* -------------------------------
	/* deferred render: private methods
	/* ------------------------------- */

	/** @private */
	_applyRender: function(tstamp) {
		if (!this._skipLog) {
			console.log("%s::_applyRender [flags: %s] [%s, %s, %s]", this.cid,
				View.flagsToString(this._renderFlags),
				(this._frameQueueId != -1 ? "async #" + this._frameQueueId : "sync"),
				(this.attached ? "attached" : "detached"),
				(this.skipTransitions ? "skip" : "run") + " transitions"
			);
		}

		var flags = this._renderFlags;
		this.trigger("view:render:before", this, flags);
		this._renderFlags = 0;
		this._frameQueueId = -1;
		this._renderFlags |= this.renderFrame(tstamp, flags);
		this.trigger("view:render:after", this, flags);

		if (this._renderFlags != 0) {
			console.warn("%s::_applyRender [returned] flags: %s", this.cid, View.flagsToString(this._renderFlags), this._renderFlags);
		}
	},

	_cancelRender: function() {
		if (this._frameQueueId != -1) {
			var cancelId, cancelFn;

			cancelId = this._frameQueueId;
			this._frameQueueId = -1;
			cancelFn = FrameQueue.cancel(cancelId);

			if (cancelFn === void 0) {
				console.warn("%s::_cancelRender ID:%i not found", this.cid, cancelId);
			} else if (cancelFn === null) {
				console.warn("%s::_cancelRender ID:%i already cancelled", this.cid, cancelId);
				// } else {
				// 	if (!this._skipLog && !FrameQueue.running)
				// 		console.log("%s::_cancelRender ID:%i cancelled", this.cid, cancelId);
			}
		}
	},

	_requestRender: function() {
		if (this._frameQueueId == -1) {
			this._frameQueueId = FrameQueue.request(this._applyRender, isNaN(this.viewDepth) ? Number.MAX_VALUE : this.viewDepth);
			// this._frameQueueId = FrameQueue.request(this._applyRender, 10);
			// if (!this._skipLog && !FrameQueue.running)
			// 	console.log("%s::_requestRender ID:%i rescheduled", this.cid, this._frameQueueId);
		}
	},

	/* -------------------------------
	/* render: public / abstract methods
	/* ------------------------------- */

	requestRender: function(flags) {
		if (flags !== void 0) {
			this._renderFlags |= flags;
		}
		this._requestRender();
		return this;
	},

	/** @abstract */
	renderFrame: function(tstamp, flags) {
		// subclasses should override this method
		return View.NONE_INVALID;
	},

	renderNow: function(alwaysRun) {
		if (this._frameQueueId != -1) {
			var cancelId = this._cancelRender();
			alwaysRun = true;
		}
		// if (alwaysRun === true) {
		if (alwaysRun) {
			this._applyRender(_now());
		}
		return this;
	},

	/* -------------------------------
	/* render bitwise flags
	/* - check: this._renderFlags & flags
	/* - add: this._renderFlags |= flags
	/* - remove: this._renderFlags &= ~flags
	/* ------------------------------- */

	/* helpers ------------------ */

	requestChildrenRender: function(flags, now, force) {
		var ccid, view;
		for (ccid in this.childViews) {
			view = this.childViews[ccid];
			view.skipTransitions = !!(flags & View.SIZE_INVALID);
			view.requestRender(flags);
			if (now) {
				view.renderNow(force);
			}
		}
	},

	render: function() {
		return this.renderNow(true);
	},

	/* -------------------------------
	/* common abstract
	/* ------------------------------- */

	/** @private */
	_enabled: undefined,

	/**
	/* @param {Boolean}
	/*/
	setEnabled: function(enable) {
		this._enabled = enable;
	},
};

module.exports = Backbone.View.extend(ViewProto, View);

},{"app/view/base/FrameQueue":59,"app/view/base/PrefixedEvents":61,"app/view/base/ViewError":64,"app/view/promise/whenViewIsAttached":81,"backbone":"backbone","underscore":"underscore","utils/prefixedEvent":111,"utils/prefixedProperty":112,"utils/prefixedStyleName":113}],64:[function(require,module,exports){
function ViewError(view, err) {
	this.view = view;
	this.err = err;
	this.message = err.message;
}
ViewError.prototype = Object.create(Error.prototype);
ViewError.prototype.constructor = ViewError;
ViewError.prototype.name = "ViewError";

module.exports = ViewError;

},{}],65:[function(require,module,exports){
/**
/* @module app/view/component/Carousel
/*/

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
// /** @type {module:app/view/base/DeferredView} */
// var View = require("app/view/base/DeferredView");

/** @type {module:app/view/render/CarouselRenderer} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");

/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/prefixedStyleName} */
var prefixedStyleName = require("utils/prefixedStyleName");

var transformStyleName = prefixedStyleName("transform");
var transformProperty = prefixedProperty("transform");

// var cssToPx = function(cssVal, el) {
// 	return parseInt(cssVal);
// };

// var defaultRendererFunction = (function() {
// 	var defaultRenderer = CarouselRenderer.extend({ className: "carousel-item default-renderer"}),
// 		emptyRenderer = CarouselRenderer.extend({ className: "carousel-item empty-renderer"});
// 	return function(item, index, arr) {
// 		return (index === -1)? emptyRenderer: defaultRenderer;
// 	};
// })();

/** @const */
var MAX_SELECT_THRESHOLD = 20;

// /** @const */
// var CHILDREN_INVALID = View.CHILDREN_INVALID,
// 	STYLES_INVALID = View.STYLES_INVALID,
// 	MODEL_INVALID = View.MODEL_INVALID,
// 	SIZE_INVALID = View.SIZE_INVALID,
// 	LAYOUT_INVALID = View.LAYOUT_INVALID;

var VERTICAL = Hammer.DIRECTION_VERTICAL,
	HORIZONTAL = Hammer.DIRECTION_HORIZONTAL;

// x: ["x", "y"],
// y: ["y", "x"],
// offsetLeft: ["offsetLeft", "offsetTop"],
// offsetTop: ["offsetTop", "offsetLeft"],
// offsetWidth: ["offsetWidth", "offsetHeight"],
// offsetHeight: ["offsetHeight", "offsetWidth"],
// width: ["width","height"],
// height: ["height","width"],
// marginLeft: ["marginLeft","marginTop"],
// marginRight: ["marginRight","marginBottom"],

var HORIZONTAL_PROPS = {
	pos: "x",
	size: "width",
	offsetPos: "offsetLeft",
	offsetSize: "offsetWidth",
	marginBefore: "marginLeft",
	marginAfter: "marginRight",
};
var VERTICAL_PROPS = {
	pos: "y",
	size: "height",
	offsetPos: "offsetTop",
	offsetSize: "offsetHeight",
	marginBefore: "marginTop",
	marginAfter: "marginBottom",
};

var isValidTouchManager = function(touch, direction) {
	// var retval;
	try {
		return touch.get("pan").options.direction == direction;
	} catch (err) {
		return false;
	}
	// return retval;
};

// /** @type {int} In pixels */
// var panThreshold: 15;

var createTouchManager = function(el, dir, thres) {
	var touch = new Hammer.Manager(el);
	var pan = new Hammer.Pan({
		threshold: 15,
		direction: dir,
	});
	var tap = new Hammer.Tap({
		threshold: thres - 1,
		interval: 50,
		time: 200,
	});
	tap.recognizeWith(pan);
	touch.add([pan, tap]);
	return touch;
};


var Carousel = {
	/** const */
	ANIMATED: false,
	/** const */
	IMMEDIATE: true,

	/** copy of Hammer.DIRECTION_VERTICAL */
	DIRECTION_VERTICAL: VERTICAL,
	/** copy of Hammer.DIRECTION_HORIZONTAL */
	DIRECTION_HORIZONTAL: HORIZONTAL,
	/** @type {Object} */
	defaults: {
		/** @type {boolean} */
		selectOnScrollEnd: false,
		/** @type {boolean} */
		requireSelection: false,
		/** @type {int} */
		direction: HORIZONTAL,
		/** @type {int} In pixels */
		selectThreshold: 20,
		/** @type {Function} */
		rendererFunction: (function() {
			var defaultRenderer = CarouselRenderer.extend({
					className: "carousel-item default-renderer"
				}),
				emptyRenderer = CarouselRenderer.extend({
					className: "carousel-item empty-renderer"
				});
			return function(item, index, arr) {
				return (index === -1) ? emptyRenderer : defaultRenderer;
			};
		})(),
	},
};
Carousel.validOptions = _.keys(Carousel.defaults);

/**
/* @constructor
/* @type {module:app/view/component/Carousel}
/*/
var CarouselProto = {

	/** @override */
	cidPrefix: "carousel",
	/** @override */
	tagName: "div",
	/** @override */
	className: "carousel skip-transitions",

	/* --------------------------- *
	/* properties
	/* --------------------------- */

	properties: {
		scrolling: {
			get: function() {
				return this._scrolling;
			}
		},
	},

	events: {
		// "mousedown": "_onMouseDown", "mouseup": "_onMouseUp",
		"transitionend .carousel-item.selected": "_onScrollTransitionEnd",
	},

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onTouchEvent");

		this.itemViews = new Container();
		this.metrics = {};

		_.extend(this, _.defaults(_.pick(options, Carousel.validOptions), Carousel.defaults));

		this.childGap = this.dirProp(20, 18);
		this._precedingDir = (Hammer.DIRECTION_LEFT | Hammer.DIRECTION_UP) & this.direction;
		this._followingDir = (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_DOWN) & this.direction;

		// use supplied touch mgr or create private
		if (isValidTouchManager(options.touch, this.direction)) {
			this.touch = options.touch;
		} else {
			console.warn("%s::initializeHammer using private Hammer instance", this.cid);
			this.touch = createTouchManager(this.el, this.direction);
			// this.on("view:removed", this.touch.destroy, this.touch);
			this.listenTo(this, "view:removed", function() {
				this.touch.destroy();
			});
		}

		/* create children and props */
		this.setEnabled(true);
		this.skipTransitions = true;
		this._renderFlags = View.CHILDREN_INVALID;
		// this.invalidateChildren();

		this.listenTo(this, "view:attached", function() {
			this.skipTransitions = true;
			// this.invalidateSize();
			// this.renderNow();
			// this.requestRender();
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
		});

		/* collection listeners */
		this.listenTo(this.collection, {
			"reset": this._onReset,
			"select:one": this._onSelectOne,
			"select:none": this._onSelectNone,
			"deselect:one": this._onDeselectAny,
			"deselect:none": this._onDeselectAny,
		});
	},
	/* --------------------------- *
	/* Hammer init
	/* --------------------------- */

	// validateTouchManager: function(touch, direction) {
	// 	try {
	// 		return touch.get("pan").options.direction === direction);
	// 	} catch (err) {
	// 		return false;
	// 	}
	// },

	// initializeHammer: function(options) {
	// 	// direction from opts/defaults
	// 	if (options.direction === VERTICAL) {
	// 		this.direction = VERTICAL;
	// 	} // do nothing: the default is horizontal
	//
	// 	// validate hammer instance or create local
	// 	if ((touch = options.touch) && (pan = touch.get("pan"))) {
	// 		// Override direction only if specific
	// 		if (pan.options.direction !== Hammer.DIRECTION_ALL) {
	// 			this.direction = pan.options.direction;
	// 		}
	// 		this.panThreshold = pan.options.threshold;
	// 	} else {
	// 		console.warn("%s::initializeHammer using private Hammer instance", this.cid);
	// 		touch = createHammerInstance(this.el, this.panThreshold, this.direction);
	// 		this.on("view:removed", touch.destroy, touch);
	// 	}
	// 	this.touch = touch;
	// },


	remove: function() {
		// this._scrollPendingAction && this._scrollPendingAction(true);
		// if (this._enabled) {
		// 	this.touch.off("tap", this._onTap);
		// 	this.touch.off("panstart panmove panend pancancel", this._onPan);
		// }
		this._toggleTouchEvents(false);
		this.removeChildren();
		View.prototype.remove.apply(this, arguments);
		return this;
	},


	/* --------------------------- *
	/* helper functions
	/* --------------------------- */

	dirProp: function(hProp, vProp) {
		return (this.direction & HORIZONTAL) ? hProp : vProp;
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	// render: function() {
	// 	if (this.attached) {
	// 		this.skipTransitions = true;
	// 		// this.invalidateSize();
	// 		this.renderNow(true);
	// 	}
	// },

	// /** @override */
	// render: function () {
	// 	if (!this.attached) {
	// 		if (!this._renderPending) {
	// 			this._renderPending = true;
	// 			this.listenTo(this, "view:attached", this.render);
	// 		}
	// 	} else {
	// 		if (this._renderPending) {
	// 			this._renderPending = false;
	// 			this.stopListening(this, "view:attached", this.render);
	// 		}
	// 		this._delta = 0;
	// 		this.skipTransitions = true;
	// 		this.invalidateSize();
	// 		// this.invalidateLayout();
	// 		this.renderNow();
	// 	}
	// 	return this;
	// },

	// render: function () {
	// 	this.measureLater();
	// 	this.scrollBy(0, Carousel.IMMEDIATE);
	//
	// 	if (this.el.parentElement) {
	// 		this.renderNow();
	// 	}
	// 	return this;
	// },

	/** @override */
	renderFrame: function(tstamp, flags) {
		if (flags & View.CHILDREN_INVALID) {
			this._createChildren();
			// clear this flag now: render may be deferred until attached
			flags &= ~View.CHILDREN_INVALID;
		}
		if (this.attached) {
			if (flags & View.SIZE_INVALID) {
				this._measure();
			}
			if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
				this._scrollBy(this._delta, this.skipTransitions);
			}
		} else if (flags) {
			this.listenToOnce(this, "view:attached", function() {
				this.requestRender(flags);
			});
		}
	},

	/* --------------------------- *
	/* enabled
	/* --------------------------- */

	/** @override */
	_enabled: undefined,

	/** @override */
	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			// toggle events immediately
			this._toggleTouchEvents(enabled);
			// dom manipulation on render (_renderEnabled)
			// this._renderFlags |= View.STYLES_INVALID;
			// this.requestRender();

			this.el.classList.toggle("disabled", !this.enabled);
			this.itemViews.each(function(view) {
				view.setEnabled(this.enabled);
			}, this);
		}
	},

	_renderEnabled: function() {
		this.el.classList.toggle("disabled", !this.enabled);
		this.itemViews.each(function(view) {
			view.setEnabled(this.enabled);
		}, this);
	},

	/* --------------------------- *
	/* Create children
	/* --------------------------- */

	_createChildren: function() {
		// var sIndex;
		var buffer, renderer, view, viewOpts;

		this.removeChildren();

		if (this.collection.length) {
			viewOpts = {
				// viewDepth: this.viewDepth + 1,
				// parentView: this,
				enabled: this.enabled
			};
			buffer = document.createDocumentFragment();
			// buffer = this.el;

			if (!this.requireSelection) {
				renderer = this.rendererFunction(null, -1, this.collection);
				view = new renderer(viewOpts);
				this.itemViews.add(view);
				buffer.appendChild(view.el);
				this.emptyView = view;
			}

			this.collection.each(function(item, index, arr) {
				viewOpts.model = item;
				renderer = this.rendererFunction(item, index, arr);
				view = new renderer(viewOpts);
				this.itemViews.add(view);
				buffer.appendChild(view.el);
			}, this);

			// if (!this.requireSelection) {
			// 	buffer = this.appendItemView(buffer, this.model, -1, this.collection);
			// 	this.emptyView = this.itemViews.first();
			// }
			// buffer = this.collection.reduce(this.appendItemView, buffer, this);

			this.adjustToSelection();
			this._selectedView.el.classList.add("selected");

			this.el.appendChild(buffer);
		}
	},

	// appendItemView: function (parentEl, model, index, arr) {
	// 	var renderer = this.rendererFunction(model, index, arr);
	// 	var view = new renderer({
	// 		model: model,
	// 		parentView: this,
	// 		enabled: this.enabled
	// 	});
	// 	this.itemViews.add(view);
	// 	parentEl.appendChild(view.el);
	// 	return parentEl;
	// },

	// createItemView: function (renderer, opts) {
	// 	var view = new renderer(opts);
	// 	this.itemViews.add(view);
	// 	return view;
	// },

	removeChildren: function() {
		this.itemViews.each(this.removeItemView, this);
		this.emptyView = void 0;
	},

	removeItemView: function(view) {
		this.itemViews.remove(view);
		view.remove();
		return view;
	},

	/* --------------------------- *
	/* measure
	/* --------------------------- */

	_measure: function() {
		var m, mm;
		var pos = 0,
			posInner = 0;
		var maxAcross = 0,
			maxOuter = 0;
		var maxOuterView, maxAcrossView;

		maxOuterView = maxAcrossView = this.emptyView || this.itemViews.first();

		// chidren metrics
		this.itemViews.each(function(view) {
			view.render();
		});

		this.itemViews.each(function(view) {
			m = this.measureItemView(view);
			m.pos = pos;
			pos += m.outer + this.childGap;
			m.posInner = posInner;
			posInner += m.inner + this.childGap;
			if (view !== this.emptyView) {
				if (m.across > maxAcross) {
					maxAcross = m.across;
					maxAcrossView = view;
				}
				if (m.outer > maxOuter) {
					maxOuter = m.outer;
					maxOuterView = view;
				}
			}
		}, this);

		// measure self + max child metrics
		mm = this.metrics[this.cid] || (this.metrics[this.cid] = {});
		mm.outer = this.el[this.dirProp("offsetWidth", "offsetHeight")];
		mm.before = maxOuterView.el[this.dirProp("offsetLeft", "offsetTop")];
		mm.inner = maxOuterView.el[this.dirProp("offsetWidth", "offsetHeight")];
		mm.after = mm.outer - (mm.inner + mm.before);
		mm.across = maxAcross;

		// m = this.metrics[maxOuterView.cid];
		// mm.inner = m.inner;

		// tap area
		this._tapAcrossBefore = maxAcrossView.el[this.dirProp("offsetTop", "offsetLeft")];
		this._tapAcrossAfter = this._tapAcrossBefore + maxAcross;
		this._tapBefore = mm.before + this._tapGrow;
		this._tapAfter = mm.before + mm.inner - this._tapGrow;

		this.selectThreshold = Math.min(MAX_SELECT_THRESHOLD, mm.outer * 0.1);
	},

	measureItemView: function(view) {
		var m, s, viewEl, sizeEl;

		viewEl = view.el;
		m = this.metrics[view.cid] || (this.metrics[view.cid] = {});

		m.outer = viewEl[this.dirProp("offsetWidth", "offsetHeight")];
		m.across = viewEl[this.dirProp("offsetHeight", "offsetWidth")];

		if (view.metrics) {
			m.before = view.metrics[this.dirProp("marginLeft", "marginTop")];
			m.outer += m.before;
			m.outer += view.metrics[this.dirProp("marginRight", "marginBottom")];
			m.inner = view.metrics.content[this.dirProp("width", "height")];
			m.before += view.metrics.content[this.dirProp("x", "y")];
			m.after = m.outer - (m.inner + m.before);

			// var marginBefore = view.metrics[this.dirProp("marginLeft","marginTop")];
			// var marginAfter = view.metrics[this.dirProp("marginRight","marginBottom")];
			// var pos = view.metrics.content[this.dirProp("x","y")];
			//
			// m.inner = view.metrics.content[this.dirProp("width","height")];
			// m.before = marginBefore + pos;
			// m.outer += marginBefore + marginAfter;
			// m.after = m.outer - (m.inner + m.before);
		} else {
			// throw new Error("renderer has no metrics");
			console.warn("%s::measureItemView view '%s' has no metrics", this.cid, view.cid);
			m.inner = m.outer;
			m.after = m.before = 0;
		}

		return m;
	},

	/* --------------------------- *
	/* scrolling property
	/* --------------------------- */

	_delta: 0,

	_scrolling: false,

	_setScrolling: function(scrolling) {
		// console.warn("_setScrolling current/requested", this._scrolling, scrolling);
		if (this._scrolling != scrolling) {
			this._scrolling = scrolling;
			this.el.classList.toggle("scrolling", scrolling);
			this.trigger(scrolling ? "view:scrollstart" : "view:scrollend");
		}
	},

	/* --------------------------- *
	/* Scroll/layout
	/* --------------------------- */

	scrollBy: function(delta, skipTransitions) {
		this._delta = delta || 0;
		this.skipTransitions = !!skipTransitions;
		// this.invalidateLayout();
		this.requestRender(View.LAYOUT_INVALID);
	},

	_scrollBy: function(delta, skipTransitions) {
		var metrics, pos;
		var sMetrics = this.metrics[(this._scrollCandidateView || this._selectedView).cid];

		this.itemViews.each(function(view) {
			metrics = this.metrics[view.cid];
			pos = Math.floor(this._getScrollOffset(delta, metrics, sMetrics));
			view.metrics.translateX = (this.direction & HORIZONTAL) ? pos : 0;
			view.metrics.translateY = (this.direction & HORIZONTAL) ? 0 : pos;
			view.metrics._transform = "translate3d(" + view.metrics.translateX + "px," + view.metrics.translateY + "px,0)";
			view.el.style[transformProperty] = view.metrics._transform;
			// view.el.style[transformProperty] = (this.direction & HORIZONTAL)?
			// 	"translate3d(" + pos + "px,0,0)":
			// 	"translate3d(0," + pos + "px,0)";
		}, this);

		this.el.classList.toggle("skip-transitions", skipTransitions);
		this.selectFromView();
	},

	_getScrollOffset: function(delta, mCurr, mSel) {
		var pos = mCurr.pos - mSel.pos + delta;
		var offset = 0;

		if (pos < 0) {
			if (Math.abs(pos) < mCurr.outer) {
				offset += (-mCurr.after) / mCurr.outer * pos;
			} else {
				offset += mCurr.after;
			}
		} else
		if (0 <= pos) {
			if (Math.abs(pos) < mCurr.outer) {
				offset -= mCurr.before / mCurr.outer * pos;
			} else {
				offset -= mCurr.before;
			}
		}
		return pos + offset;
	},


	_onScrollTransitionEnd: function(ev) {
		if (ev.propertyName === transformStyleName && this.scrolling) {
			console.log("%s::_onScrollTransitionEnd selected: %s", this.cid, ev.target.cid);
			this._setScrolling(false);
		}
	},

	/* --------------------------- *
	/* toggle touch events
	/* --------------------------- */

	_toggleTouchEvents: function(enable) {
		// console.log("%s::_toggleTouchEvents", this.cid, enable);
		if (this._touchEventsEnabled !== enable) {
			this._touchEventsEnabled = enable;
			if (enable) {
				this.touch.on("tap panstart panmove panend pancancel", this._onTouchEvent);
			} else {
				this.touch.off("tap panstart panmove panend pancancel", this._onTouchEvent);
			}
		}
	},

	_onTouchEvent: function(ev) {
		switch (ev.type) {
			case "tap":
				return this._onTap(ev);
			case "panstart":
				return this._onPanStart(ev);
			case "panmove":
				return this._onPanMove(ev);
			case "panend":
				return this._onPanFinal(ev);
			case "pancancel":
				return this._onPanFinal(ev);
		}
	},

	/* --------------------------- *
	/* touch event: pan
	/* --------------------------- */

	// _panCapturedOffset: 0,

	/** @param {Object} ev */
	_onPanStart: function(ev) {
		this.selectFromView();
		this.el.classList.add("panning");
		this._setScrolling(true);
	},

	/** @param {Object} ev */
	_onPanMove: function(ev) {
		var view = (ev.offsetDirection & this._precedingDir) ? this._precedingView : this._followingView;
		var delta = (this.direction & HORIZONTAL) ? ev.thresholdDeltaX : ev.thresholdDeltaY;

		if (this._panCandidateView !== view) {
			this._panCandidateView && this._panCandidateView.el.classList.remove("candidate");
			this._panCandidateView = view;
			this._panCandidateView && this._panCandidateView.el.classList.add("candidate");
		}
		if (this._panCandidateView === void 0) {
			delta *= Globals.HPAN_OUT_DRAG;
		}

		if (this._renderRafId !== -1) {
			this.scrollBy(delta, Carousel.IMMEDIATE);
			this.renderNow();
		} else {
			this._scrollBy(delta, Carousel.IMMEDIATE);
		}
	},

	/** @param {Object} ev */
	_onPanFinal: function(ev) {
		var scrollCandidate;
		// NOTE: this delta is used for determining selection, NOT for layout
		var delta = (this.direction & HORIZONTAL) ? ev.thresholdDeltaX : ev.thresholdDeltaY;
		// var delta = (this.direction & HORIZONTAL)? ev.deltaX : ev.deltaY;

		if ((ev.type == "panend") &&
			// pan direction (last event) and offsetDirection (whole gesture) must match
			((ev.direction ^ ev.offsetDirection) & this.direction) &&
			// gesture must overshoot selectThreshold
			(Math.abs(delta) > this.selectThreshold)) {
			// choose next scroll target
			scrollCandidate = (ev.offsetDirection & this._precedingDir) ? this._precedingView : this._followingView;
		}
		this._scrollCandidateView = scrollCandidate || void 0;

		if (this._panCandidateView && (this._panCandidateView !== scrollCandidate)) {
			this._panCandidateView.el.classList.remove("candidate");
		}
		this._panCandidateView = void 0;
		this.el.classList.remove("panning");

		this.scrollBy(0, Carousel.ANIMATED);
		this.selectFromView();

		// if (this._renderRafId !== -1) {
		// 	this.scrollBy(0, Carousel.ANIMATED);
		// 	this.renderNow();
		// } else {
		// 	this._scrollBy(0, Carousel.ANIMATED);
		// }
	},

	/* --------------------------- *
	/* touch event: tap
	/* --------------------------- */

	/** @type {int} In pixels */
	_tapGrow: 10,

	getViewAtTapPos: function(pos, posAcross) {
		if (this._tapAcrossBefore < posAcross && posAcross < this._tapAcrossAfter) {
			if (pos < this._tapBefore) {
				return this._precedingView;
			} else if (pos > this._tapAfter) {
				return this._followingView;
			}
		}
		return void 0;
	},

	_onTap: function(ev) {
		var targetView = View.findByDescendant(ev.target);
		// if (!this.itemViews.contains(targetView)) {
		// 	return;
		// }
		do {
			if (this._selectedView === targetView) {
				// console.log("%s tap ocurred on selected: %o", this.cid, targetView);
				return;
			} else if (this === targetView) {
				// console.log("%s tap ocurred on carousel: %o", this.cid, targetView);
				break;
			}
		} while ((targetView = targetView.parentView))

		// this.selectFromView();

		var bounds = this.el.getBoundingClientRect();
		var tapX = ev.center.x - bounds.left;
		var tapY = ev.center.y - bounds.top;
		var tapCandidate = this.getViewAtTapPos(
			this.dirProp(tapX, tapY),
			this.dirProp(tapY, tapX)
		);

		if (tapCandidate) {
			console.log("%s::_onTap %o", this.cid, ev);
			ev.preventDefault();
			// ev.stopPropagation();

			// this._scrollCandidateView = tapCandidate;
			// this._setScrolling(true);
			// this.scrollBy(0, Carousel.ANIMATED);
			// this._scrollCandidateView.el.classList.add("candidate");
			// this.selectFromView();

			//// NOT using internalSelection
			// this.triggerSelectionEvents(tapCandidate, false);

			// using internalSelection
			this._scrollCandidateView = tapCandidate;
			this._setScrolling(true);
			this.scrollBy(0, Carousel.ANIMATED);

			this.triggerSelectionEvents(tapCandidate, true);
			// this.renderNow();
		}
	},

	/* --------------------------- *
	/* Private
	/* --------------------------- */

	triggerSelectionEvents: function(view, internal) {
		if (view === void 0 || this._internalSelection) {
			return;
		}

		this._internalSelection = !!internal;
		if (view === this.emptyView) {
			this.trigger("view:select:none");
		} else {
			this.trigger("view:select:one", view.model);
		}
		this._internalSelection = false;
	},

	selectFromView: function() {
		if (this._scrollCandidateView === void 0) {
			return;
		}
		var view = this._scrollCandidateView;
		this._scrollCandidateView = void 0;
		view.el.classList.remove("candidate");

		this.triggerSelectionEvents(view, true);
	},

	adjustToSelection: function() {
		var m, i = this.collection.selectedIndex;
		// assume -1 < index < this.collection.length
		if (this.requireSelection) {
			(i == -1) && i++; // if selection is null (index -1), set _selectedView to first item (index 0)
			this._selectedView = (m = this.collection.at(i)) && this.itemViews.findByModel(m);
			this._precedingView = (m = this.collection.at(i - 1)) && this.itemViews.findByModel(m);
			this._followingView = (m = this.collection.at(i + 1)) && this.itemViews.findByModel(m);
		} else {
			this._selectedView = (m = this.collection.at(i)) ? this.itemViews.findByModel(m) : this.emptyView;
			this._precedingView = m && ((m = this.collection.at(i - 1)) ? this.itemViews.findByModel(m) : this.emptyView);
			this._followingView = (m = this.collection.at(i + 1)) && this.itemViews.findByModel(m);
		}
	},

	/* --------------------------- *
	/* Model listeners
	/* --------------------------- */

	/** @private */
	_onSelectOne: function(model) {
		if (model === this._selectedView.model) {
			console.info("INTERNAL");
			return;
		}
		this._onSelectAny(model);
	},

	/** @private */
	_onSelectNone: function() {
		if ((this.requireSelection ? this.itemViews.first() : this.emptyView) === this._selectedView) {
			console.info("INTERNAL");
			return;
		}
		this._onSelectAny();
	},

	/** @private */
	_onSelectAny: function(model) {
		this._selectedView.el.classList.remove("selected");
		this.adjustToSelection();
		this._selectedView.el.classList.add("selected");

		if (!this._internalSelection) {
			this._setScrolling(true);
			this.scrollBy(0, Carousel.ANIMATED);
		}
	},

	// _onDeselectAny: function (model) {},

	/** @private */
	_onReset: function() {
		// this._createChildren();
		// this.invalidateChildren();
		this.requestRender(View.CHILDREN_INVALID | View.MODEL_INVALID);
	},


	/* --------------------------- *
	/* TEMP
	/* --------------------------- */

	// _scrollBy2: function (delta, skipTransitions) {
	// 	var metrics, pos;
	// 	var sMetrics = this.metrics[(this._scrollCandidateView || this._selectedView).cid];
	// 	var cMetrics = this.metrics[(this._panCandidateView || this._selectedView).cid];
	//
	// 	this.itemViews.each(function (view) {
	// 		metrics = this.metrics[view.cid];
	// 		pos = Math.floor(this._getScrollOffset(delta, metrics, sMetrics, cMetrics));
	// 		view.el.style[transformProperty] = (this.direction & HORIZONTAL)?
	// 				"translate3d(" + pos + "px,0,0)" : "translate3d(0," + pos + "px,0)";
	// 				// "translate(" + pos + "px,0)" : "translate(0," + pos + "px)";
	// 				// "translateX(" + pos + "px)" : "translateY(" + pos + "px)";
	// 	}, this);
	// 	this.el.classList.toggle("skip-transitions", skipTransitions);
	// 	this.selectFromView();
	// },

	// _getScrollOffset2: function (delta, mCurr, mSel, mCan) {
	// 	var offset = 0;
	// 	var posInner = mCurr.posInner - mSel.posInner + delta;
	//
	// 	if (posInner < -mSel.inner) {
	// 		offset = -(mCurr.before);
	// 	} else if (posInner > mSel.inner) {
	// 		offset = (mSel.after);
	// 	} else {
	// 		if (posInner < 0) {
	// 			offset = (mCurr.before) / (mCurr.inner) * posInner;
	// 		} else {
	// 			offset = (mSel.after) / (mCan.inner) * posInner;
	// 		}
	// 	}
	// 	return posInner + offset;
	// },

	// captureSelectedOffset: function() {
	// 	var val, view, cssval, m, mm;
	//
	// 	val = 0;
	// 	view = this._scrollCandidateView || this._selectedView;
	// 	cssval = getComputedStyle(view.el)[transformProperty];
	//
	// 	mm = cssval.match(/(matrix|matrix3d)\(([^\)]+)\)/);
	// 	if (mm) {
	// 		m = mm[2].split(",");
	// 		if (this.direction & HORIZONTAL) {
	// 			val = m[mm[1]=="matrix"? 4 : 12];
	// 		} else {
	// 			val = m[mm[1]=="matrix"? 5 : 13];
	// 		}
	// 		val = parseFloat(val);
	// 	}
	//
	// 	console.log("%s::captureSelectedOffset", this.cid, cssval, val, cssval.match(/matrix\((?:\d\,){3}(\d)\,(\d)|matrix3d\((?:\d\,){11}(\d)\,(\d)/));
	//
	// 	return val;
	// },

	// _onScrollEnd: function(exec) {
	// 	this._scrollEndCancellable = void 0;
	// 	// this.el.classList.remove("disabled-changing");
	// 	if (exec) {
	// 		this._setScrolling(false);
	// 		// this.el.classList.remove("scrolling");
	// 		// this.trigger("view:scrollend");
	// 		console.log("%s::_onScrollEnd", this.cid);
	// 	}
	// },
	// _onMouseDown: function(ev) {
	// 	if (this._scrolling) {
	// 		this._panCapturedOffset = this.captureSelectedOffset();
	// 		console.log("%s::events[mousedown] scrolling interrupted (pos %f)", this.cid, this._panCapturedOffset);
	// 	}
	// },
	// _onMouseUp:function(ev) {
	// 	this._panCapturedOffset = 0;
	// },

};

module.exports = Carousel = View.extend(CarouselProto, Carousel);

},{"app/control/Globals":41,"app/view/base/View":63,"app/view/render/CarouselRenderer":82,"backbone.babysitter":"backbone.babysitter","hammerjs":"hammerjs","underscore":"underscore","utils/prefixedProperty":112,"utils/prefixedStyleName":113}],66:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\n";
},"useData":true});

},{"hbsfy/runtime":25}],67:[function(require,module,exports){
/**
 * @module app/view/component/CollectionStack
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
// /** @type {Function} */
// var transitionEnd = require("utils/event/transitionEnd");
/** @type {Function} */
var setImmediate = require("utils/setImmediate");

/** @type {string} */
var viewTemplate = require("./CollectionStack.hbs");

/**
 * @constructor
 * @type {module:app/component/CollectionStack}
 */
module.exports = View.extend({

	/** @override */
	cidPrefix: "stack",
	/** @override */
	tagName: "div",
	/** @override */
	className: "stack",
	/** @override */
	template: viewTemplate,

	events: {
		"transitionend": function(ev) {
			// console.log("%s::transitionend [invalid: %s] [transition: %s]", this.cid, this._contentInvalid, (this._skipTransitions? "skip": "run"), ev.target.id, ev.target.className);
			this._renderContent();
		}
	},

	initialize: function(options) {
		this._enabled = true;
		this._skipTransitions = true;
		this._contentInvalid = true;

		options.template && (this.template = options.template);
		this.content = document.createElement("div");
		this.content.className = "stack-item";
		this.el.appendChild(this.content);

		this.listenTo(this.collection, "select:one select:none", this._onSelectChange);
	},

	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			this.el.classList.toggle("disabled", !this._enabled);
		}
	},

	_onSelectChange: function(item) {
		if (this._renderedItem === this.collection.selected) {
			throw new Error("change event received but item is identical");
		}
		this._renderedItem = this.collection.selected;

		this._contentInvalid = true;
		this.render();
	},

	/* --------------------------- *
	/* render
	/* --------------------------- */

	render: function() {
		if (this._skipTransitions) {
			// execute even if content has not changed to apply styles immediately
			this._skipTransitions = false;
			this.el.classList.add("skip-transitions");
			setImmediate(function() {
				this.el.classList.remove("skip-transitions");
			}.bind(this));

			// render changed content immediately
			if (this._contentInvalid) {
				this._renderContent();
			}
		} else {
			// else remove 'current' class and render on transitionend
			if (this._contentInvalid) {
				this.content.classList.remove("current");
				// this.content.className = "stack-item";
			}
		}
		return this;
	},

	_renderContent: function() {
		if (this._contentInvalid) {
			this._contentInvalid = false;
			var item = this.collection.selected;
			this.content.innerHTML = item ? this.template(item.toJSON()) : "";
			this.content.classList.add("current");
			// this.content.className = "stack-item current";
		}
	},
});

},{"./CollectionStack.hbs":66,"app/view/base/View":63,"utils/setImmediate":115}],68:[function(require,module,exports){
/**
/* @module app/view/component/FilterableListView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");
/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/css/getBoxEdgeStyles} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

var diff = function(a1, a2) {
	return a1.reduce(function(res, o, i, a) {
		if (a2.indexOf(o) == -1) res.push(o);
		return res;
	}, []);
};

var translateCssValue = function(x, y) {
	return "translate3d(" + x + "px, " + y + "px ,0px)";
};

/** @const */
var transformProp = prefixedProperty("transform");

/**
/* @constructor
/* @type {module:app/view/component/FilterableListView}
/*/
var FilterableListView = View.extend({

	/** @type {string} */
	cidPrefix: "filterableList",
	/** @override */
	tagName: "ul",
	/** @override */
	className: "list selectable filterable",

	/** @override */
	defaults: {
		collapsed: true,
		filterFn: function() {
			return true;
		},
		renderer: ClickableRenderer.extend({
			/** @override */
			cidPrefix: "listItem",
		}),
	},

	/** @override */
	properties: {
		collapsed: {
			get: function() {
				return this._collapsed;
			},
			set: function(value) {
				this._setCollapsed(value);
			}
		}
	},

	/** @override */
	events: {
		"transitionend .list-item": function(ev) {
			if (this._collapsedTransitioning && ev.propertyName === "visibility" /*&& this.el.classList.contains("collapsed-changed")*/ ) {
				this._collapsedTransitioning = false;
				this.el.classList.remove("collapsed-changed");
				// console.log("%s:::events[transitionend .list-item] collapsed-changed end", this.cid);
			}
		},
	},

	/** @override */
	initialize: function(options) {
		this._metrics = {};
		this._itemMetrics = [];
		this.itemViews = new Container();

		_.defaults(options, this.defaults);
		this.renderer = options.renderer;
		this._filterFn = options.filterFn;

		this.collection.each(this.createItemView, this);
		this.refresh();
		this._setSelection(this.collection.selected);
		this._setCollapsed(options.collapsed);

		// will trigger on return if this.el is already attached
		// this.skipTransitions = true;
		this.listenTo(this, "view:attached", function() {
			this.skipTransitions = true;
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID); //.renderNow();
		});

		this.listenTo(this.collection, "select:one select:none", this._setSelection);
		this.listenTo(this.collection, "reset", function() {
			this._allItems = null;
			throw new Error("not implemented");
		});
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	/** @override */
	renderFrame: function(tstamp, flags) {
		// collapsed transition flag
		if (this._collapsedTransitioning)
			console.warn("%s::renderFrame collapsed transition interrupted", this.cid);

		this._collapsedTransitioning = !this.skipTransitions && this._collapsedChanged;

		// this.el.classList.toggle("animate", !this.skipTransitions);
		this.el.classList.toggle("collapsed-changed", this._collapsedTransitioning);
		this.el.classList.toggle("skip-transitions", this.skipTransitions);
		if (this.skipTransitions) {
			this.skipTransitions = false;
			// Invalidate again after frame render loop to reapply transforms:
			// that should kill any running transitions.
			this.setImmediate(function() {
				this.requestRender(View.LAYOUT_INVALID);
			});
		}
		if (this._collapsedChanged) {
			flags |= View.SIZE_INVALID;
			this.el.classList.toggle("collapsed", this._collapsed);
		}
		if (this._selectionChanged) {
			flags |= View.LAYOUT_INVALID;
			this.renderSelection(this.collection.selected, this.collection.lastSelected);
		}
		if (this._filterChanged) {
			flags |= View.LAYOUT_INVALID;
			this.renderFilterFn();
		}
		if (flags & View.SIZE_INVALID) {
			this.measure();
		}
		if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
			this.renderLayout();
		}
		this._collapsedChanged = this._selectionChanged = this._filterChanged = false;
	},

	measure: function() {
		// var i, ii, el, els, m, mm;
		// els = this.el.children;
		// ii = els.length;
		// mm = this._itemMetrics;
		// for (i = 0; i < ii; i++) {
		// 	mm[i] = _.pick(els[i], "offsetTop", "offsetHeight");
		// }

		this._metrics = getBoxEdgeStyles(this.el, this._metrics);

		// var itemEl, itemView, baseline = 0;
		// if (itemEl = this.el.querySelector(".list-item:not(.excluded) .label")) {
		// 	// itemView = this.itemViews.findByCid(itemEl.cid);
		// 	var elA = itemEl, elB = itemEl.parentElement;
		// 	var yA = elA.offsetTop,
		// 		hA = elA.offsetHeight,
		// 		yB = elB.offsetTop,
		// 		hB = elB.offsetHeight;
		// 	baseline = ((yA + hA) - (yB + hB));
		// 	console.log("%s::measure fontSize: %spx (%s+%s)-(%s+%s)=%s", this.cid, this._metrics.fontSize,
		// 		yA, hA, yB, hB, baseline
		// 	);
		// }

		this.itemViews.forEach(function(view) {
			if (!view._metrics) view._metrics = {};
			// view._metrics.baseline = this._metrics.fontSize - baseline;
			view._metrics.offsetTop = view.el.offsetTop;
			view._metrics.offsetHeight = view.el.offsetHeight;
			view._metrics.offsetLeft = view.el.offsetLeft;
			view._metrics.offsetWidth = view.el.offsetWidth;
			if (!this._collapsed && view.label) {
				view._metrics.textLeft = view.label.offsetLeft;
				view._metrics.textWidth = view.label.offsetWidth;
			} else {
				view._metrics.textLeft = view._metrics.offsetLeft;
				view._metrics.textWidth = view._metrics.offsetWidth;
			}
		}, this);

		// this._metrics.baseline = this._metrics.fontSize - baseline;
	},

	renderLayout: function() {
		var posX, posY;
		posX = this._metrics.paddingLeft;
		posY = this._metrics.paddingTop;

		for (var i = 0, ii = this.el.children.length; i < ii; i++) {
			var view = this.itemViews.findByCid(this.el.children[i].cid);
			if (((this.collection.selected && !view.model.selected) ||
					view.el.classList.contains("excluded")) && this._collapsed) {
				view.transform.tx = posX;
				view.transform.ty = posY;
			} else {
				if (view._metrics.offsetHeight == 0)
					posY -= view._metrics.offsetTop;
				view.transform.tx = posX;
				view.transform.ty = posY;
				posY += view._metrics.offsetHeight + view._metrics.offsetTop;
			}
			view.el.style[transformProp] = translateCssValue(view.transform.tx, view.transform.ty);
		}

		posY += this._metrics.paddingBottom;
		this.el.style.height = (posY > 0) ? posY + "px" : "";
	},

	/* --------------------------- *
	/* Child views
	/* --------------------------- */

	/** @private */
	createItemView: function(item, index) {
		var view = new this.renderer({
			model: item,
			el: this.el.querySelector(".list-item[data-id=\"" + item.id + "\"]")
		});
		this.itemViews.add(view);
		this.listenTo(view, "renderer:click", this._onRendererClick);
		return view;
	},

	/** @private */
	_onRendererClick: function(item, ev) {
		if (this.collection.selected !== item) {
			this.trigger("view:select:one", item);
		} else {
			if (ev.altKey) {
				this.trigger("view:select:none");
			} else {
				this.trigger("view:select:same", item);
			}
			// this.trigger("view:select:none");
		}
	},

	/* --------------------------- *
	/* Collapsed
	/* --------------------------- */

	/** @private */
	_collapsed: undefined,

	/**
	/* @param {Boolean}
	/*/
	_setCollapsed: function(collapsed) {
		if (collapsed !== this._collapsed) {
			this._collapsed = collapsed;
			this._collapsedChanged = true;
			this.requestRender();
		}
	},

	/* --------------------------- *
	/* Selection
	/* --------------------------- */

	/** @private */
	_selectedItem: undefined,

	/** @param {Backbone.Model|null} */
	_setSelection: function(item) {
		this._selectedItem = item;
		this._selectionChanged = true;
		this._requestRender();
	},

	/** @private */
	renderSelection: function(newItem, oldItem) {
		var view;
		if (oldItem) {
			view = this.itemViews.findByModel(oldItem);
			view.el.classList.remove("selected");
			// view.label.classList.remove("color-fg");
			// view.label.classList.remove("color-reverse");
		}
		if (newItem) {
			view = this.itemViews.findByModel(newItem);
			view.el.classList.add("selected");
			// view.label.classList.add("color-fg");
			// view.label.classList.add("color-reverse");
		}
	},

	/* --------------------------- *
	/* Filter
	/* --------------------------- */

	refresh: function() {
		if (this._filterFn) {
			this._filterChanged = true;
			this.requestRender();
		}
	},

	renderFilterFn: function() {
		var items = this._filterFn ? this.collection.filter(this._filterFn, this) : this._getAllItems();
		this.renderFilters(items, this._filteredItems);
		this._filteredItems = items;
	},

	renderFilters: function(newItems, oldItems) {
		var hasNew = !!(newItems && newItems.length);
		var hasOld = !!(oldItems && oldItems.length);

		console.log("%s::renderFilterFn", this.cid, newItems);

		if (hasNew) {
			diff((hasOld ? oldItems : this._getAllItems()), newItems).forEach(function(item) {
				this.itemViews.findByModel(item).el.classList.add("excluded");
			}, this);
		}
		if (hasOld) {
			diff((hasNew ? newItems : this._getAllItems()), oldItems).forEach(function(item) {
				this.itemViews.findByModel(item).el.classList.remove("excluded");
			}, this);
		}
		this.el.classList.toggle("has-excluded", hasNew);
	},

	_getAllItems: function() {
		return this._allItems || (this._allItems = this.collection.slice());
	},

	/* --------------------------- *
	/* Filter 2
	/* --------------------------- */

	// computeFiltered: function() {
	// 	this._filterResult = this.collection.map(this._filterFn, this);
	// },
	//
	// renderFiltered: function() {
	// 	this.collection.forEach(function(item, index) {
	// 		this.itemViews.findByModel(item).el.classList.toggle("excluded", !this._filterResult[index]);
	// 	}, this);
	// },

});

module.exports = FilterableListView;

},{"app/view/base/View":63,"app/view/render/ClickableRenderer":83,"backbone.babysitter":"backbone.babysitter","underscore":"underscore","utils/css/getBoxEdgeStyles":107,"utils/prefixedProperty":112}],69:[function(require,module,exports){
/**
 * @module app/view/component/GraphView
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");

/** @type {Function} */
var Color = require("color");

/** @type {module:app/view/base/View} */
var CanvasView = require("app/view/base/CanvasView");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

// /** @type {module:app/model/collection/TypeCollection} */
// var types = require("app/model/collection/TypeCollection");
// /** @type {module:app/model/collection/BundleCollection} */
// var bundles = require("app/model/collection/BundleCollection");
// /** @type {module:app/model/collection/KeywordCollection} */
// var keywords = require("app/model/collection/KeywordCollection");

/** @type {module:utils/canvas/calcArcHConnector} */
var calcArcHConnector = require("utils/canvas/calcArcHConnector");

/** @type {module:utils/geom/inflateRect} */
var inflateRect = require("utils/geom/inflateRect");

/** @type {module:utils/canvas/calcArcHConnector} */
var CanvasHelper = require("utils/canvas/CanvasHelper");

// var BEZIER_CIRCLE = 0.551915024494;
// var MIN_CANVAS_RATIO = 2;
// var PI2 = Math.PI * 2;

var styleBase = {
	lineCap: "butt", // round, butt, square
	lineWidth: 0.75,
	lineDashOffset: 0,
	setLineDash: [[]],
	radiusBase: 14, //6,
	radiusIncrement: 3, //4,
	outlineWidth: 4.5,
	// margin: 20,
};

var _dStyles = {
	red: {
		lineWidth: 1,
		fillStyle: "rgba(255,127,127,0.75)",
		strokeStyle: "rgba(255,127,127,0.75)",
		lineDashOffset: 0,
		setLineDash: [[]]
	},
	blue: {
		lineWidth: 1,
		fillStyle: "rgba(127,127,255,0.75)",
		strokeStyle: "rgba(127,127,255,0.75)",
		lineDashOffset: 0,
		setLineDash: [[]]
	}
};

function setStyle(ctx, s) {
	if (typeof s != "object") return;
	for (var p in s) {
		switch (typeof ctx[p]) {
			case "undefined":
				break;
			case "function":
				if (Array.isArray(s[p])) ctx[p].apply(ctx, s[p]);
				else ctx[p].call(ctx, s[p]);
				break;
			default:
				ctx[p] = s[p];
		}
	}
}

/**
 * @constructor
 * @type {module:app/view/component/GraphView}
 */
var GraphView = CanvasView.extend({

	/** @type {string} */
	cidPrefix: "graph",
	/** @override */
	tagName: "canvas",
	/** @override */
	className: "graph",
	// /** @override */
	// model: Backbone.Model,

	defaultKey: "amount",

	defaults: {
		values: {
			amount: 0,
			// available: 0,
			// _loop: 0,
		},
		maxValues: {
			amount: 1,
			// available: 1,
		},
		// useOpaque: true,
		// labelFn: function(value, max) {
		// 	return ((value / max) * 100) | 0;
		// },
	},

	/** @override */
	initialize: function(options) {
		CanvasView.prototype.initialize.apply(this, arguments);

		this._styleData = {};
		this._listMetrics = {};

		this._listA = options.listA;
		this._listB = options.listB;
		this._a2b = {
			s: _.defaults({
				lineWidth: 1.5
			}, styleBase),
			strokeStyleFn: function(fg, bg, ln) {
				return Color(ln).mix(bg, 0.9).hexString();
				// return Color(fg).mix(bg, 0.9).hexString();
			}
		};
		this._b2a = {
			s: _.defaults({
				lineWidth: 0.7,
				// radiusIncrement: 1,
				// outlineWidth: 6,
			}, styleBase),
			strokeStyleFn: function(fg, bg, ln) {
				return Color(fg).mix(bg, 0.8).hexString();
			}
		};
		this.listenTo(this, "view:render:before", this._beforeViewRender);

	},

	/** @override */
	updateCanvas: function(ctx) {
		this._updateMetrics();
		this._updateStyles();
	},

	/* --------------------------- *
	/* styles
	/* --------------------------- */

	_updateStyles: function() {
		var b, bgColor, lnColor; //, altBgColor;
		if (this.model.get("withBundle")) {
			b = this.model.get("bundle");
			lnColor = b.colors.lnColor;
			bgColor = b.colors.bgColor;
			// altBgColor = b.attrs["--alt-background-color"];
		} else {
			bgColor = Color(Globals.DEFAULT_COLORS["background-color"]);
			lnColor = Color(Globals.DEFAULT_COLORS["--link-color"]);
		}
		// bgColor = Color(window.getComputedStyle(this.el).getPropertyValue("background-color"));
		// console.log("%s::_updateStyles bg: %s", this.cid, window.getComputedStyle(this.el).getPropertyValue("background-color"));
		// var bgColor = this.model.get("withBundle") ? this.model.get("bundle").colors.bgColor : Color(Globals.DEFAULT_COLORS["background-color"]);
		// var lnColor = this.model.get("withBundle") ? this.model.get("bundle").colors.lnColor : Color(Globals.DEFAULT_COLORS["--link-color"]);
		// var altBgColor = this.model.get("bundle").attrs["--alt-background-color"];

		this._a2b.s.strokeStyle = this._a2b.s.fillStyle =
			this._a2b.strokeStyleFn(this._color, bgColor, lnColor);
		this._b2a.s.strokeStyle = this._b2a.s.fillStyle =
			this._b2a.strokeStyleFn(this._color, bgColor, lnColor)
	},

	_setStyle: function(s) {
		// var ctx = this._ctx;
		if (typeof s == "string") {
			s = this._styleData[s];
		}
		setStyle(this._ctx, s);
	},

	/* --------------------------- *
	/* metrics
	/* --------------------------- */

	_updateMetrics: function() {
		var bounds = this.el.getBoundingClientRect();
		this._ctx.setTransform(this._canvasRatio, 0, 0, this._canvasRatio, -bounds.left * this._canvasRatio - 0.5, -bounds.top * this._canvasRatio - 0.5);

		// var i, ii, itemView, itemRect, listView, els;
		var i, ii, els;
		// var aRect, bRect;
		// var aMin, bMin;
		// var c, qx;

		this._a2b.rect = this._listA.el.getBoundingClientRect();
		this._a2b.xMin = this._a2b.rect.left;
		els = this._listA.el.querySelectorAll(".label");
		for (i = 0, ii = els.length; i < ii; i++) {
			this._a2b.xMin = Math.max(this._a2b.xMin,
				els[i].getBoundingClientRect().right);
		}

		this._b2a.rect = this._listB.el.getBoundingClientRect();
		this._b2a.xMin = this._b2a.rect.left;
		els = this._listB.el.querySelectorAll(".label");
		for (i = 0, ii = els.length; i < ii; i++) {
			this._b2a.xMin = Math.min(this._b2a.xMin,
				els[i].getBoundingClientRect().left);
		}

		// var c = Math.abs(sData.xMin - dData.xMin) / 6;
		// sMin = sData.xMin + c * qx;
		// dMin = dData.xMin - c * qx;

		// this._a2b.targets = this._measureListItems(listView);
		// this._b2a.targets = this._measureListItems(listView);

		// // connector minimum branch x2
		// listView = this._listB;
		// for (i = 0, ii = listView.groups.length; i < ii; i++) {
		// 	itemView = listView.itemViews.findByModel(listView.groups[i]);
		// 	itemRect = (itemView.label || itemView.el).getBoundingClientRect();
		// 	this._b2a.xMin = Math.min(this._b2a.xMin, itemRect.left);
		// 	// if (itemView._metrics) this._b2a.rect.left + itemView.transform.tx + itemView._metrics.textLeft;
		// }
	},

	/* --------------------------- *
	/* redraw
	/* --------------------------- */

	_beforeViewRender: function(view, flags) {
		if (flags & (CanvasView.SIZE_INVALID | CanvasView.MODEL_INVALID)) {
			console.log("%s::_beforeViewRender [flags: %s]", this.cid, CanvasView.flagsToString(flags));

			this._a2b.pointsOut = this._a2b.points;
			this._a2b.maxLengthOut = this._a2b.maxLength;
			this._a2b.points = null;
			this._a2b.maxLength = null;

			this._b2a.pointsOut = this._b2a.points;
			this._b2a.maxLengthOut = this._b2a.maxLength;
			this._b2a.points = null;
			this._b2a.maxLength = null;

			this._groupRects = null;
		}
	},

	redraw: function(ctx, interpolator) {
		// console.log("%s::redraw [valuesChanged: %s]", this.cid, interpolator.valuesChanged);
		this._clearCanvas(0, 0, this._canvasWidth, this._canvasHeight);
		ctx.save();
		this._redraw_fromElements(ctx, interpolator);
		// this._redraw_fromViews(ctx, interpolator);
		ctx.restore();
	},

	_drawConnectors: function(pp, s, lMax, lVal, dir) {
		var i, ii;
		if (pp && (ii = pp.length) && (lVal > 0)) {
			var ra1 = s.radiusIncrement + s.lineWidth;
			var ra2 = ra1 + (s.outlineWidth - s.lineWidth);
			this._setStyle(s);
			if (lVal < 1) {
				this._ctx.lineDashOffset = lMax * (1 + lVal);
				this._ctx.setLineDash([lMax, lMax]);
			}
			for (i = 0; i < ii; i++) {
				this._ctx.save();
				this._ctx.globalCompositeOperation = "destination-out";
				this._ctx.lineWidth = s.outlineWidth;
				// for (i = 0; i < ii; i++) {
				this._drawConnector(pp[i]);
				if (lVal == 1) {
					CanvasHelper.arrowhead(this._ctx, pp[i].x2, pp[i].y2, ra2, Math.PI * dir, true, s);
					// CanvasHelper.circle(this._ctx, pp[i].x2, pp[i].y2, 2.5, true, s);
				}
				// }
				this._ctx.restore();
				// for (i = 0; i < ii; i++) {
				this._drawConnector(pp[i]);
				if (lVal == 1) {
					CanvasHelper.arrowhead(this._ctx, pp[i].x2, pp[i].y2, ra1, Math.PI * dir, true, s);
					// CanvasHelper.circle(this._ctx, pp[i].x2, pp[i].y2, 1.5, true, s);
				}
				// }
			}
		}
	},

	_redraw_fromElements: function(ctx, interpolator) {
		// b2a: keyword to bundles, right to left
		// a2b: bundle to keywords, left to right
		if (this._b2a.points === null) {
			this._computeConnectors(this._listB, this._b2a, this._listA, this._a2b);
		}
		if (this._a2b.points === null) {
			this._computeConnectors(this._listA, this._a2b, this._listB, this._b2a);
		}

		/* line dash value interpolation */
		var lVal = interpolator._valueData["amount"]._renderedValue / interpolator._valueData["amount"]._maxVal;

		/* draw */
		this._drawConnectors(this._b2a.points, this._b2a.s,
			this._b2a.maxLength, lVal, 1);
		this._drawConnectors(this._b2a.pointsOut, this._b2a.s,
			this._b2a.maxLengthOut, 1 - lVal, 1);
		this._drawConnectors(this._a2b.points, this._a2b.s,
			this._a2b.maxLength, 1, 2);

		// clear some label backgrounds
		if (this._groupRects === null) {
			this._groupRects = [];
			var els = this._listB.el.querySelectorAll(".list-group .label span");
			for (var i = 0, ii = els.length; i < ii; i++) {
				this._groupRects[i] = inflateRect(els[i].getBoundingClientRect(), -8.5, -4.5);
			}
		}
		this._groupRects.forEach(function(r) {
			// TODO: implement DOMRect.inflate()
			this._ctx.clearRect(r.left, r.top, r.width - 1, r.height - 1);
			// this._ctx.strokeRect(r.left, r.top, r.width, r.height);
			// var ro = r.original;
			// this._ctx.strokeRect(ro.left, ro.top, ro.width, ro.height);
		}, this);

		// var i, ii, r;
		// if (this._a2b.points || this._b2a.points || this._a2b.pointsOut || this._b2a.pointsOut) {
		// 	ii = this._groupRects.length;
		// 	for (i = 0; i < ii; i++) {
		// 		r = this._groupRects[i];
		// 		ctx.clearRect(r.left, r.top, r.width, r.height);
		// 	}
		// }

		// if (DEBUG) {
		// 	if (!interpolator._valuesChanged) {
		// 		var p;
		// 		for (i = 0; i < ii; i++) {
		// 			p = this._b2a.points[i];
		// 			CanvasHelper.crosshair(ctx, p.cx2, p.cy2, 5, _dStyles.red);
		// 			CanvasHelper.circle(ctx, p.cx1, p.cy1, 1, true, _dStyles.blue);
		// 		}
		// 	}
		// 	CanvasHelper.vGuide(ctx, this._a2b.xMin, _dStyles.red);
		// 	CanvasHelper.vGuide(ctx, this._b2a.xMin, _dStyles.blue);
		// }
	},

	_computeConnectors: function(sList, sData, dList, dData) {
		var sRect, dRect;
		var qx, after, before;

		sRect = sData.rect; //sList.el.getBoundingClientRect();
		dRect = dData.rect; //dList.el.getBoundingClientRect();

		if (sRect.right < dRect.left) {
			qx = 1;
			after = "right";
			before = "left";
		} else if (dRect.right < sRect.left) {
			qx = -1;
			after = "left";
			before = "right";
		} else {
			return;
		}

		var lMax = 0;
		var p, points = [];
		var rBase = sData.s.radiusBase;
		var rInc = sData.s.radiusIncrement;

		// var c = Math.abs(sData.xMin - dData.xMin) / 4;
		var sMin = sData.xMin; // + c * qx;
		var dMin = dData.xMin; // - c * qx;

		var ssEl, ddEls, ddNum, i;
		var ssRect, ddRect;
		var x1, y1, tx;
		var si; // ssEl's number of items above in the Y axis

		ssEl = sList.el.querySelector(".list-item.selected .label");

		if (ssEl) {
			ssRect = ssEl.getBoundingClientRect();
			x1 = ssRect[after] // - xMargin;
			y1 = ssRect.top + ssRect.height / 2;
			// r2 = rBase;
			// cx1 = sData.xMin;

			si = 0;
			ddEls = dList.el.querySelectorAll(".list-item:not(.excluded) .label");
			ddNum = ddEls.length;
			// dx = Math.abs(sData.xMin - dData.xMin);

			for (i = 0; i < ddNum; i++) {
				p = {};
				ddRect = ddEls[i].getBoundingClientRect();
				p.x1 = x1;
				p.y1 = y1;
				p.x2 = ddRect[before];
				p.y2 = ddRect.top + ddRect.height / 2;
				p.dx = p.x1 - p.x2;
				p.dy = p.y1 - p.y2;
				p.qx = qx;
				p.qy = Math.sign(p.dy);
				// p.dLength = Math.abs(p.x) + Math.abs(p.y);
				p.di = p.dy > 0 ? i : ddNum - (i + 1);
				si = Math.max(si, p.di);
				points[i] = p;
			}

			var a, rMax0 = ddNum * 0.5 * rInc;
			for (i = 0; i < ddNum; i++) {
				p = points[i];
				p.r1 = p.di * rInc + rBase;
				p.r2 = rBase;
				// p.r2 = (si - p.di) * rInc + rBase;

				p.cx1 = sMin;
				p.cx2 = dMin - ((si - p.di) * rInc) * qx;
				// p.cx2 = dData.xMin;

				a = (i - (ddNum - 1) / 2) * rInc
				p.cy1 = p.y1 + a;
				p.cy2 = p.y2;

				a = Math.abs(a);
				p.r0 = a;
				p.cx0 = p.x1 + (rMax0 - a) * qx;

				tx = calcArcHConnector(p.cx1, p.cy1, p.r1, p.cx2, p.cy2, p.r2, 0.75);
				p.tx1 = tx[0];
				p.tx2 = tx[1];

				// Find out longest node connection for setLineDash
				lMax = Math.max(lMax, Math.abs(p.x1 - p.x2) + Math.abs(p.cy1 - p.cy2));
			}
			// Sort by distance y1 (original) > cy1 (rInc offset) distance
			points.sort(function(a, b) {
				// return Math.abs(b.y1 - b.cy1) - Math.abs(a.y1 - a.cy1);
				// return a.r0 - b.r0;
				return b.di - a.di;
			});
		}
		sData.points = points;
		sData.maxLength = lMax;
		sData.xDir = qx;
	},

	_drawConnector: function(p) {
		this._ctx.beginPath();
		this._ctx.moveTo(p.x2, p.cy2);
		this._ctx.arcTo(p.tx2, p.cy2, p.tx1, p.cy1, p.r2);
		this._ctx.arcTo(p.tx1, p.cy1, p.cx1, p.cy1, p.r1);
		// this._ctx.quadraticCurveTo(p.cx0, p.cy1, p.cx0, p.y1)
		this._ctx.arcTo(p.cx0, p.cy1, p.cx0, p.y1, p.r0);
		// this._ctx.lineTo(p.cx0, p.y1);
		this._ctx.stroke();

		// CanvasHelper.circle(this._ctx, p.cx0, p.cy1, 1, true, _dStyles["blue"]);
		// CanvasHelper.circle(this._ctx, p.cx1, p.cy1, 1, true, _dStyles["blue"]);
		// CanvasHelper.circle(this._ctx, p.cx2, p.cy2, 2, true, _dStyles["red"]);
		// CanvasHelper.circle(this._ctx, p.x1 - (p.r3 * p.qx * 2), p.cy1, 2, true, _dStyles["blue"]);
	},

	/*_redraw_fromMetrics: function(ctx, interpolator) {
		var i, ii, model, mCids;

		var idx, metrics;
		var x1, y1, x2, y2, xMin1, xMin2;
		var cx1, cy1, r1;
		var cx2, cy2, r2;
		var s, rInc, rBase, xMargin; // connector-to-element margin in px

		// keyword to bundles, left to right
		if (model = this._listB.collection.selected) {
			mCids = model.get("bIds");
			ii = mCids.length;
		}
		// bundle to keywords, right to left
		if (model = this.model.get("bundle")) {
			mCids = model.get("bIds");
			ii = mCids.length;

			s = this._b2a.s;
			rInc = s.radiusIncrement;
			rBase = s.radiusBase;
			xMargin = s.margin;

			xMin1 = this._a2b.xMin;
			xMin2 = this._b2a.xMin;
			idx = _.findIndex(this._targetsA, { mId: model.id });
			metrics = this._targetsA[idx];
			x1 = metrics.after - xMargin;
			y1 = metrics.y;
			r2 = rBase;
			cx1 = Math.min(x1, xMin1);

			ii = this._targetsB.length;
			for (i = 0; i < ii; i++); {}
		}
	},*/

	/*_redraw_fromViews: function(ctx, interpolator) {
		var i, numItems, view, rect, model, mCids;
		var yMin, yMax, dx;
		var s, roInc, m;

		// var xMid = (this._a2b.xMin + this._b2a.xMin) / 2;
		yMin = Math.min(this._a2b.rect.top, this._b2a.rect.top);
		yMax = Math.max(this._a2b.rect.bottom, this._b2a.rect.bottom);
		dx = Math.abs(this._a2b.xMin - this._b2a.xMin);

		s = this._b2a.s;
		roInc = s.radiusIncrement;
		m = s.margin; // connector-to-element margin in px

		var rr = 0.6; // r1 to r2 ratio
		var r1, r2;
		r1 = (dx / 4) * rr;
		r2 = (dx / 4) * (1 / rr);
		r1 = Math.floor(r1);
		r2 = Math.floor(r2);

		var x1, y1, x2, y2; // connector start/end
		var cx1, cy1, cx2, cy2; // connector anchors
		var xMin1, xMin2;
		var ro; // radius offset

		xMin1 = this._a2b.xMin;
		xMin2 = this._b2a.xMin;

		this._setStyle(s);

		// bundle to keywords
		if (model = this.model.get("bundle")) {
			view = this._listA.itemViews.findByModel(model);
			if (view._metrics) {
				mCids = model.get("kIds");
				numItems = mCids.length;

				x1 = this._a2b.rect.left + view.transform.tx + view._metrics.textLeft + view._metrics.textWidth;
				y1 = this._a2b.rect.top + view.transform.ty + view._metrics.offsetHeight / 2;
				cx1 = Math.max(x1, xMin1);
				ro = mCids.length * roInc * 0.5;

				for (i = 0; i < numItems; i++) {
					view = this._listB.itemViews.findByModel(keywords.get(mCids[i]));
					if (view._metrics) {
						x2 = this._b2a.rect.left + view.transform.tx + view._metrics.textLeft;
						y2 = this._b2a.rect.top + view.transform.ty + view._metrics.offsetHeight / 2;
						cx2 = Math.min(x2, xMin2);
						cy1 = y1 + i * roInc;
						cy2 = y2; // - i*roInc;
						ro += y1 > y2 ? roInc : -roInc;

						ctx.beginPath();
						ctx.moveTo(x1, cy1);
						drawArcHConnector(ctx, cx1, cy1, cx2, cy2, r1 + ro, r2 - ro);
						ctx.lineTo(x2, cy2);
						ctx.stroke();
					}
				}
			}
		}

		xMin1 = this._b2a.xMin;
		xMin2 = this._a2b.xMin;

		// keyword to bundles
		if (model = this._listB.collection.selected) {
			view = this._listB.itemViews.findByModel(model);
			if (view._metrics) {
				mCids = model.get("bIds");
				numItems = mCids.length;

				x1 = this._b2a.rect.left + view.transform.tx + view._metrics.textLeft;
				y1 = this._b2a.rect.top + view.transform.ty + view._metrics.offsetHeight / 2;
				cx1 = Math.min(x1, xMin1);
				ro = mCids.length * roInc * 0.5;

				// ctx.setLineDash([]);
				for (i = 0; i < numItems; i++) {
					view = this._listA.itemViews.findByModel(this._listA.collection.get(mCids[i]));
					if (view._metrics) {
						x2 = this._a2b.rect.left + view.transform.tx + view._metrics.textLeft + view._metrics.textWidth;
						y2 = this._a2b.rect.top + view.transform.ty + view._metrics.offsetHeight / 2;
						cx2 = Math.max(x2, xMin2);
						cy1 = y1 + i * roInc;
						cy2 = y2; // + i*roInc;
						ro += y1 > y2 ? roInc : -roInc;

						ctx.beginPath();
						ctx.moveTo(x1, cy1);
						drawArcHConnector(ctx, cx1, cy1, cx2, cy2, r1 + ro, r2 - ro);
						ctx.lineTo(x2, cy2);
						ctx.stroke();
					}
				}
			}
		}
	},*/

	/*_measureListItems: function(listView) {
		var listRect, retval;

		listRect = listView.el.getBoundingClientRect();
		retval = listView.itemViews.map(function(view, i) {
			return {
				vId: view.id,
				mId: view.model.id,
				before: listRect.left + view.transform.tx + view._metrics.textLeft,
				after: listRect.left + view.transform.tx + view._metrics.textLeft + view._metrics.textWidth,
				y: listRect.top + view.transform.ty + view._metrics.offsetHeight / 2,
			};
		}, this);
		retval.sort(function(a, b) {
			if (a.y > b.y) return 1;
			if (a.y < b.y) return -1;
			return 0;
		});
		retval.before = listRect.left;
		retval.after = listRect.left + listRect.width;
		return retval;
	},*/
});

module.exports = GraphView;

},{"app/control/Globals":41,"app/view/base/CanvasView":58,"color":"color","underscore":"underscore","utils/canvas/CanvasHelper":105,"utils/canvas/calcArcHConnector":106,"utils/geom/inflateRect":110}],70:[function(require,module,exports){
/**
 * @module app/view/component/GroupingListView
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
// /** @type {module:backbone.babysitter} */
// var Container = require("backbone.babysitter");
// /** @type {module:app/view/base/View} */
// var View = require("app/view/base/View");
/** @type {module:app/view/component/FilterableListView} */
var FilterableListView = require("app/view/component/FilterableListView");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");
/** @type {module:app/view/render/LabelRenderer} */
var LabelRenderer = require("app/view/render/LabelRenderer");

/**
 * @constructor
 * @type {module:app/view/component/GroupingListView}
 */
var GroupingListView = FilterableListView.extend({

	/** @type {string} */
	cidPrefix: "groupingList",

	/** @override */
	tagName: "dl",

	/** @override */
	className: "grouped",

	/** @type {Function|null} empty array */
	_groupingFn: null, //function() { return null; },

	/** @override */
	defaults: _.defaults({
		// defaults: {
		renderer: ClickableRenderer.extend({
			/** @override */
			cidPrefix: "groupingListItem",
			/** @override */
			tagName: "dl",
			/** @override */
			className: "list-item list-label",
		}),
		groupingRenderer: LabelRenderer.extend({
			/** @override */
			cidPrefix: "groupingListGroup",
			/** @override */
			tagName: "dt",
			/** @override */
			className: "list-group list-label",
		}),
		groupingFn: null,
		// },
	}, FilterableListView.prototype.defaults),

	properties: {
		groups: {
			get: function() {
				return this._groups;
			}
		}
	},

	/** @override */
	initialize: function(options) {
		FilterableListView.prototype.initialize.apply(this, arguments);

		this._groups = [];
		// this._groupItems = [];
		this._groupsByItemCid = {};

		this._groupingFn = options.groupingFn;
		this.groupingRenderer = options.groupingRenderer;

		this._refreshGroups();
		if (this._groupingFn) {
			this._groups.forEach(this.createGroupingView, this);
		}
	},

	_refreshGroups: function() {
		// this._groups = _.uniq(this.collection.map(this._groupingFn, this));
		this._groups.length = 0;
		// this._groupItems.length = 0;
		if (this._groupingFn) {
			this.collection.forEach(function(item) {
				var gIdx, gObj = this._groupingFn.apply(null, arguments);
				if (gObj) {
					gIdx = this._groups.indexOf(gObj);
					if (gIdx == -1) {
						gIdx = this._groups.length;
						this._groups[gIdx] = gObj;
						// this._groupItems[gIdx] = [];
					}
					// this._groupItems[gIdx].push(item);
				}
				this._groupsByItemCid[item.cid] = gObj;
			}, this);
		} else {
			this.collection.forEach(function(item) {
				this._groupsByItemCid[item.cid] = null;
			}, this);
		}
	},

	renderFilterFn: function() {
		FilterableListView.prototype.renderFilterFn.apply(this, arguments);

		if (this._groupingFn) {
			if (this._filteredItems.length == 0) {
				this._groups.forEach(function(group) {
					this.itemViews.findByModel(group).el.classList.remove("excluded");
				}, this);
			} else {
				var filteredGroups = this._filteredItems.map(function(item) {
					return this._groupsByItemCid[item.cid];
				}, this);
				this._groups.forEach(function(group) {
					this.itemViews.findByModel(group).el.classList.toggle("excluded", filteredGroups.indexOf(group) == -1);
				}, this);
			}
			// this._groupsExclusionIndex = this._groups.map(function (group) {
			// 	return groups.indexOf(group) == -1);
			// }, this);
		}
	},

	/** @private Create children views */
	createGroupingView: function(item) {
		var view = new this.groupingRenderer({
			model: item,
			el: this.el.querySelector(".list-group[data-id=\"" + item.id + "\"]")
		});
		this.itemViews.add(view);
		return view;
	},

	/* --------------------------- *
	/* Filter 2
	/* --------------------------- */

	// computeFiltered: function() {
	// 	FilterableListView.prototype.computeFiltered.apply(this, arguments);
	// },
	//
	// renderFiltered: function() {
	// 	FilterableListView.prototype.renderFiltered.apply(this, arguments);
	// },

});

module.exports = GroupingListView;

},{"app/view/component/FilterableListView":68,"app/view/render/ClickableRenderer":83,"app/view/render/LabelRenderer":90,"underscore":"underscore"}],71:[function(require,module,exports){
/** @type {module:app/view/component/progress/CanvasProgressMeter} */
module.exports = require("app/view/component/progress/CanvasProgressMeter3");
/** @type {module:app/view/component/progress/SVGPathProgressMeter} */
// module.exports = require("app/view/component/progress/SVGPathProgressMeter");
/** @type {module:app/view/component/progress/SVGCircleProgressMeter} */
// module.exports = require("app/view/component/progress/SVGCircleProgressMeter");

},{"app/view/component/progress/CanvasProgressMeter3":73}],72:[function(require,module,exports){
/**
 * @module app/view/component/SelectableListView
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/DefaultSelectableRenderer} */
var DefaultSelectableRenderer = require("app/view/render/DefaultSelectableRenderer");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

var SelectableListView = View.extend({

	/** @type {string} */
	cidPrefix: "selectableList",

	/** @override */
	tagName: "ul",

	/** @override */
	className: "list selectable",

	/** @type {module:app/view/component/DefaultSelectableRenderer} */
	renderer: DefaultSelectableRenderer,

	/** @override */
	initialize: function(options) {
		this._enabled = true;
		this._childrenInvalid = true;

		options.renderer && (this.renderer = options.renderer);
		this.showEmpty = !!options.showEmpty;
		this.itemViews = new Container();

		this.listenTo(this.collection, "add remove reset", this._onCollectionChange);
	},

	/** @override */
	remove: function() {
		this.removeChildren();
		View.prototype.remove.apply(this, arguments);
		return this;
	},

	_onCollectionChange: function(ev) {
		this._childrenInvalid = true;
		this.render();
	},

	/** @override */
	render: function() {
		if (this._childrenInvalid) {
			this._childrenInvalid = false;
			this.createChildren();
		}
		return this;
	},

	/** @override */
	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			this.el.classList.toggle("disabled", !this._enabled);
		}
	},

	/* --------------------------- *
	/* Child views
	/* --------------------------- */

	createChildren: function() {
		var eltBuffer, view;

		this.removeChildren();
		this.el.innerHTML = "";

		if (this.collection.length) {
			eltBuffer = document.createDocumentFragment();
			if (this.showEmpty) {
				view = this.createEmptyView();
				eltBuffer.appendChild(view.render().el);
			}
			this.collection.each(function(model, index, arr) {
				view = this.createItemView(model, index);
				eltBuffer.appendChild(view.render().el);
			}, this);
			this.el.appendChild(eltBuffer);
		}
	},

	createItemView: function(model, index) {
		var view = new(this.renderer)({
			model: model
		});
		this.itemViews.add(view);
		this.listenTo(view, "renderer:click", this.onItemViewClick);
		return view;
	},

	removeChildren: function() {
		this.itemViews.each(this.removeItemView, this);
	},

	removeItemView: function(view) {
		this.stopListening(view);
		this.itemViews.remove(view);
		view.remove();
		return view;
	},

	/* --------------------------- *
	/* Child event handlers
	/* --------------------------- */

	/** @private */
	onItemViewClick: function(item) {
		if (this.collection.selected !== item && this._enabled) {
			this.trigger("view:select:one", item);
		}
	},

	/* --------------------------- *
	/* Empty view
	/* --------------------------- */

	createEmptyView: function() {
		var view = new SelectableListView.EmptyRenderer({
			model: this.collection
		});
		this.itemViews.add(view);
		this.listenTo(view, "renderer:click", function() {
			this._enabled && this.trigger("view:select:none");
		});
		return view;
	},
}, {
	EmptyRenderer: ClickableRenderer.extend({

		/** @override */
		tagName: "li",
		/** @override */
		className: "list-item empty-item",

		/** @override */
		initialize: function(options) {
			this.listenTo(this.model, "selected deselected", this.renderClassList);
			this.renderClassList();
		},

		/** @override */
		render: function() {
			this.el.innerHTML = "<a href=\"#clear\"><b> </b></a>";
			this.renderClassList();
			return this;
		},

		renderClassList: function() {
			this.el.classList.toggle("selected", this.model.selectedIndex === -1);
		},
	})
});

module.exports = SelectableListView;

},{"app/view/base/View":63,"app/view/render/ClickableRenderer":83,"app/view/render/DefaultSelectableRenderer":85,"backbone.babysitter":"backbone.babysitter"}],73:[function(require,module,exports){
/**
 * @module app/view/component/progress/CanvasProgressMeter
 */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/CanvasView} */
var CanvasView = require("app/view/base/CanvasView");
// /** @type {module:app/view/base/Interpolator} */
// var Interpolator = require("app/view/base/Interpolator");

var ARC_ERR = 0.00001;
// var ARC_ERR = 0.0;
var PI = Math.PI;
var PI2 = Math.PI * 2;

var GAP_ARC = PI2 / 48;
var CAP_SCALE = 2; // cap arc = GAP_ARC * CAP_SCALE
var WAIT_CYCLE_VALUE = 1;
var WAIT_CYCLE_MS = 300; // milliseconds per interpolation loop 

var ARC_DEFAULTS = {
	"amount": {
		lineWidth: 0.8,
		radiusOffset: 0
	},
	"not-available": {
		lineWidth: 1.0,
		lineDash: [0.3, 0.7]
	},
	"available": {
		lineWidth: 0.8,
		inverse: "not-available"
	},
};

/**
 * @constructor
 * @type {module:app/view/component/progress/CanvasProgressMeter}
 */
var CanvasProgressMeter = CanvasView.extend({

	/** @type {string} */
	cidPrefix: "canvasProgressMeter",
	/** @type {string} */
	className: "progress-meter canvas-progress-meter",

	defaultKey: "amount",

	defaults: {
		values: {
			amount: 0,
			available: 0,
			_loop: 0,
		},
		maxValues: {
			amount: 1,
			available: 1,
		},
		useOpaque: true,
		labelFn: function(value, max) {
			return ((value / max) * 100) | 0;
		},
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	initialize: function(options) {
		// TODO: cleanup options mess in CanvasView
		CanvasView.prototype.initialize.apply(this, arguments);
		// options = _.defaults(options, this.defaults);

		this._labelFn = options.labelFn;
		this._valueStyles = {};
		this._canvasSize = null;
		this._canvasOrigin = null;
	},

	_updateCanvas: function() {
		CanvasView.prototype._updateCanvas.apply(this, arguments);

		// size, lines, gaps, dashes (this._valueStyles, GAP_ARC, this._arcRadius)
		// --------------------------------
		var arcName, arcObj, arcDefault;
		var mapLineDash = function(n) {
			return n * this.radius * GAP_ARC;
		};
		var sumFn = function(s, n) {
			return s + n;
		};

		this._canvasSize = Math.min(this._canvasWidth, this._canvasWidth); // / this._canvasRatio;
		this._maxDashArc = 0;

		for (arcName in ARC_DEFAULTS) {
			arcDefault = ARC_DEFAULTS[arcName];
			arcObj = this._valueStyles[arcName] = {};
			arcObj.inverse = arcDefault.inverse; // copy inverse key
			// arcObj.inverse2 = arcDefault.inverse2;
			arcObj.lineWidth = arcDefault.lineWidth * this._canvasRatio;
			arcObj.radius = (this._canvasSize - arcObj.lineWidth) / 2;
			if (arcDefault.radiusOffset) {
				arcObj.radius += arcDefault.radiusOffset * this._canvasRatio;
			}
			if (arcDefault.lineDash && arcDefault.lineDash.length) {
				arcObj.lineDash = arcDefault.lineDash.map(mapLineDash, arcObj);
				arcObj.lineDashArc = arcDefault.lineDash[0] * GAP_ARC;
				arcObj.lineDashLength = arcObj.lineDash.reduce(sumFn);
				this._maxDashArc = Math.max(this._maxDashArc, arcObj.lineDashArc);
			} else {
				arcObj.lineDashArc = 0;
			}
		}

		// baselineShift
		// --------------------------------
		// NOTE: Center baseline: use ascent data to center to x-height, or sort-of.
		// with ascent/descent values (0.7, -0.3), x-height is 0.4
		var mObj = this._getFontMetrics(this._fontFamily);
		this._baselineShift = mObj ? (mObj.ascent + mObj.descent) / mObj.unitsPerEm : 0.7; // default value
		this._baselineShift *= this._fontSize * 0.5; // apply to font-size, halve it
		this._baselineShift = Math.round(this._baselineShift);

		// save canvas context
		// --------------------------------
		// reset matrix and translate 0,0 to center
		this._ctx.restore();
		this._ctx.setTransform(1, 0, 0, 1, this._canvasWidth / 2, this._canvasHeight / 2);
		this._ctx.save();
	},

	/* --------------------------- *
	/* private
	/* --------------------------- */

	/** @override */
	redraw: function(context, interpolator) {
		this._clearCanvas(-this._canvasWidth / 2, -this._canvasHeight / 2, this._canvasWidth, this._canvasHeight);

		var loopValue = interpolator._valueData["_loop"]._renderedValue || 0;
		var amountData = interpolator._valueData["amount"];
		var availableData = interpolator._valueData["available"];

		var amountStyle = this._valueStyles["amount"];
		var availableStyle = this._valueStyles["available"];

		// amount label
		// --------------------------------
		this.drawLabel(this._labelFn(amountData._renderedValue, amountData._maxVal));

		// save ctx before drawing arcs
		this._ctx.save();

		// loop rotation
		// --------------------------------
		// if (interpolator.renderedKeys && (interpolator.renderedKeys.indexOf("amount") !== -1)) {
		// 	console.log("%s::redraw (_loop) max: %s last: %s curr: %s", this.cid,
		// 		amountData._maxVal,
		// 		amountData._lastRenderedValue,
		// 		amountData._renderedValue
		// 	);
		// }
		if (interpolator.renderedKeys && (interpolator.renderedKeys.indexOf("amount") !== -1) && (amountData._lastRenderedValue > amountData._renderedValue)) {
			// trigger loop
			interpolator.valueTo(1, 0, "_loop");
			interpolator.valueTo(0, 750, "_loop");
			interpolator.updateValue("_loop");
		}
		this._ctx.rotate(PI2 * ((1 - loopValue) - 0.25));

		// amount arc
		// --------------------------------
		var amountGapArc = GAP_ARC;
		var amountEndArc = 0;
		var amountValue = loopValue + amountData._renderedValue / amountData._maxVal;

		if (amountValue > 0) {
			amountEndArc = this.drawArc(amountStyle, amountValue, amountGapArc, PI2 - amountGapArc);
			this.drawEndCap(amountStyle, amountEndArc);
			amountEndArc = amountEndArc + amountGapArc * 2;
		}

		// available arc
		// --------------------------------
		var stepsNum = availableData.length || 1;
		var stepBaseArc = PI2 / stepsNum;
		var stepAdjustArc = stepBaseArc % GAP_ARC;
		var stepGapArc = GAP_ARC + (stepAdjustArc - availableStyle.lineDashArc) / 2;

		if (Array.isArray(availableData)) {
			for (var o, i = 0; i < stepsNum; i++) {
				o = availableData[i];
				this.drawArc(availableStyle, o._renderedValue / (o._maxVal / stepsNum), (i * stepBaseArc) + stepGapArc, ((i + 1) * stepBaseArc) - stepGapArc, amountEndArc);
			}
		} else {
			this.drawArc(availableStyle, availableData._renderedValue / availableData._maxVal, stepGapArc, PI2 - stepGapArc, amountEndArc);
		}
		// restore ctx after drawing arcs
		this._ctx.restore();
	},

	drawArc: function(valueStyle, value, startArc, endArc, prevArc) {
		var valArc, invStyle,
			valStartArc, valEndArc,
			invStartArc, invEndArc;
		prevArc || (prevArc = 0);

		valArc = endArc - startArc;
		valEndArc = startArc + (valArc * value);
		valStartArc = Math.max(startArc, prevArc);
		if (valEndArc > valStartArc) {
			this._ctx.save();
			this.applyValueStyle(valueStyle);
			this._ctx.beginPath();
			this._ctx.arc(0, 0, valueStyle.radius, valEndArc, valStartArc, true);
			this._ctx.stroke();
			this._ctx.restore();
		}
		// if there's valueStyle, draw rest of span, minus prevArc overlap too
		if (valueStyle.inverse !== void 0) {
			invStyle = this._valueStyles[valueStyle.inverse];
			invEndArc = valEndArc + (valArc * (1 - value));
			invStartArc = Math.max(valEndArc, prevArc);
			if (invEndArc > invStartArc) {
				this._ctx.save();
				this.applyValueStyle(invStyle);
				this._ctx.beginPath();
				this._ctx.arc(0, 0, invStyle.radius, invEndArc, invStartArc, true);
				this._ctx.stroke();
				this._ctx.restore();
			}
		}
		return valEndArc;
	},

	applyValueStyle: function(styleObj) {
		this._ctx.lineWidth = styleObj.lineWidth;
		if (styleObj.lineDash) {
			this._ctx.setLineDash(styleObj.lineDash);
		}
		if (styleObj.lineDashOffset) {
			this._ctx.lineDashOffset = styleObj.lineDashOffset;
		}
	},

	drawLabel: function(labelString) {
		var labelWidth = this._ctx.measureText(labelString).width;
		this._ctx.fillText(labelString,
			labelWidth * -0.5,
			this._baselineShift, labelWidth);
	},

	drawEndCap: function(valueStyle, arcPos) {
		var radius = valueStyle.radius;
		this._ctx.save();
		this._ctx.lineWidth = valueStyle.lineWidth;

		this._ctx.rotate(arcPos - GAP_ARC * 1.5);
		this._ctx.beginPath();
		this._ctx.arc(0, 0, radius, GAP_ARC * 0.5, GAP_ARC * 2, false);
		this._ctx.lineTo(radius - (GAP_ARC * radius), 0);
		this._ctx.closePath();

		this._ctx.fill();
		this._ctx.stroke();
		this._ctx.restore();
	},
});

if (DEBUG) {
	CanvasProgressMeter.prototype._skipLog = true;
}

module.exports = CanvasProgressMeter;

},{"app/control/Globals":41,"app/view/base/CanvasView":58,"underscore":"underscore"}],74:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

// - - - - - - - - - - - - - - - -
//  utils
// - - - - - - - - - - - - - - - -

function insertCSSRule(sheet, selector, style) {
	var cssText = "";
	for (var prop in style) {
		cssText += prop + ":" + style[prop] + ";";
	}
	sheet.insertRule(selector + "{" + cssText + "}", sheet.cssRules.length);
}

// - - - - - - - - - - - - - - - -
//  body rules
// - - - - - - - - - - - - - - - -

var bodyStyles = ["background", "background-color", "color", "--link-color", "--alt-background-color"];

function initBodyStyles(sheet, bodySelector, attrs, fgColor, bgColor, hasDarkBg) {
	var s, revSelector, fgColorVal, bgColorVal;
	// var revFgColorVal, revBgColorVal;

	s = _.pick(attrs, bodyStyles);
	s["-webkit-font-smoothing"] = (hasDarkBg ? "antialiased" : "auto");
	/* NOTE: In Firefox 'body { -moz-osx-font-smoothing: grayscale; }'
	/* works both in light over dark and dark over light, hardcoded in _base.scss */
	//s["-moz-osx-font-smoothing"] = (hasDarkBg? "grayscale" : "auto");
	insertCSSRule(sheet, bodySelector, s);

	s = {};
	s["color"] = fgColor.clone().mix(bgColor, 0.5).rgbString();
	s["border-color"] = fgColor.clone().mix(bgColor, 0.7).rgbString();
	insertCSSRule(sheet, bodySelector + " .color-fg05", s);

	fgColorVal = fgColor.rgbString();
	bgColorVal = bgColor.rgbString();
	// revFgColorVal = bgColor.clone().mix(fgColor, 0.9).rgbString();
	// revBgColorVal = fgColor.clone().mix(bgColor, 0.6).rgbString();
	revSelector = bodySelector + " .color-reverse";

	// .color-fg .color-bg
	// - - - - - - - - - - - - - - - -
	s = {
		"color": fgColorVal
	};
	insertCSSRule(sheet, bodySelector + " .color-fg", s);
	s = {
		"background-color": bgColorVal
	};
	insertCSSRule(sheet, bodySelector + " .color-bg", s);
	// html inverted text/background
	s = {
		"color": bgColorVal
	}; // s = { "color" : revFgColorVal };
	s["-webkit-font-smoothing"] = (hasDarkBg ? "auto" : "antialiased");
	insertCSSRule(sheet, revSelector + " .color-fg", s);
	insertCSSRule(sheet, revSelector + ".color-fg", s);

	s = {
		"background-color": fgColorVal
	}; // s = { "background-color" : revBgColorVal };
	insertCSSRule(sheet, revSelector + " .color-bg", s);
	insertCSSRule(sheet, revSelector + ".color-bg", s);

	// .color-stroke .color-fill (SVG)
	// - - - - - - - - - - - - - - - -
	s = {
		"stroke": fgColorVal
	};
	insertCSSRule(sheet, bodySelector + " .color-stroke", s);
	s = {
		"fill": bgColorVal
	};
	insertCSSRule(sheet, bodySelector + " .color-fill", s);
	// svg inverted fill/stroke
	s = {
		"stroke": bgColorVal
	};
	insertCSSRule(sheet, revSelector + " .color-stroke", s);
	insertCSSRule(sheet, revSelector + ".color-stroke", s);
	s = {
		"fill": fgColorVal
	};
	insertCSSRule(sheet, revSelector + " .color-fill", s);
	insertCSSRule(sheet, revSelector + ".color-fill", s);

	// .text-outline
	// - - - - - - - - - - - - - - - -
	// s = {
	// 	"text-shadow": "-1px -1px 0 " + bgColorVal +
	// 		", 1px -1px 0 " + bgColorVal +
	// 		", -1px 1px 0 " + bgColorVal +
	// 		", 1px 1px 0 " + bgColorVal
	// };
	// insertCSSRule(sheet, bodySelector + " :not(.collapsed-changed) .text-outline-bg", s);

}

// - - - - - - - - - - - - - - - -
// carousel styles
// - - - - - - - - - - - - - - - -

var carouselStyles = ["box-shadow", "border", "border-radius"];

function initCarouselStyles(sheet, carouselSelector, attrs, fgColor, bgColor, hasDarkBg) {
	var s = _.pick(attrs, carouselStyles); //, "background-color"]);
	insertCSSRule(sheet, carouselSelector + " .media-item .content", s);

	// .media-item .color-bg09
	// - - - - - - - - - - - - - - - -
	s = {};
	s["background-color"] = bgColor.clone().mix(fgColor, 0.95).rgbString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "darken" : "lighten"](0.045).rgbString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "lighten" : "darken"](0.03).rgbString();
	insertCSSRule(sheet, carouselSelector + " .media-item .color-bg09", s);

	// .media-item .placeholder
	// - - - - - - - - - - - - - - - -
	s = {};
	s["-webkit-font-smoothing"] = (hasDarkBg ? "auto" : "antialiased");
	// text color luminosity is inverse from body, apply oposite rendering mode
	s["color"] = bgColor.rgbString();
	// s["color"] = bgColor.clone()[hasDarkBg ? "darken" : "lighten"](0.045).rgbString();
	s["background-color"] = bgColor.clone().mix(fgColor, 0.95).rgbString();
	// s["background-color"] = bgColor.clone().mix(fgColor, 0.8).alpha(0.3).rgbaString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "lighten" : "darken"](0.03).rgbString();
	("border-radius" in attrs) && (s["border-radius"] = attrs["border-radius"]);
	insertCSSRule(sheet, carouselSelector + " .media-item .placeholder", s);

	// // .color-gradient
	// // - - - - - - - - - - - - - - - -
	// s = {};
	// s["background-color"] = "transparent";
	// s["background"] = "linear-gradient(to bottom, " +
	// 		bgColor.clone().alpha(0.00).rgbaString() + " 0%, " +
	// 		bgColor.clone().alpha(0.11).rgbaString() + " 100%)";
	// insertCSSRule(sheet, bodySelector + " .color-gradient", s);
	// s = {};
	// s["background-color"] = "transparent";
	// s["background"] = "linear-gradient(to bottom, " +
	// 		fgColor.clone().alpha(0.00).rgbaString() + " 0%, " +
	// 		fgColor.clone().alpha(0.11).rgbaString() + " 100%)";
	// insertCSSRule(sheet, revSelector + " .color-gradient", s);
	// insertCSSRule(sheet, revSelector + ".color-gradient", s);
}

module.exports = function() {
	var attrs, fgColor, bgColor, hasDarkBg;

	attrs = Globals.DEFAULT_COLORS;
	fgColor = new Color(Globals.DEFAULT_COLORS["color"]);
	bgColor = new Color(Globals.DEFAULT_COLORS["background-color"]);
	hasDarkBg = fgColor.luminosity() > bgColor.luminosity();

	var colorStyle = document.createElement("style");
	colorStyle.id = "colors";
	colorStyle.type = "text/css";
	document.head.appendChild(colorStyle);

	initBodyStyles(colorStyle.sheet, "body", attrs, fgColor, bgColor, hasDarkBg);
	initCarouselStyles(colorStyle.sheet, ".carousel", attrs, fgColor, bgColor, hasDarkBg);

	// - - - - - - - - - - - - - - - -
	// per-bundle rules
	// - - - - - - - - - - - - - - - -
	bundles.each(function(bundle) {
		attrs = bundle.attrs(); //get("attrs");
		fgColor = bundle.colors.fgColor;
		bgColor = bundle.colors.bgColor;
		hasDarkBg = bundle.colors.hasDarkBg;

		initBodyStyles(colorStyle.sheet, "body." + bundle.get("domid"), attrs, fgColor, bgColor, hasDarkBg);
		initCarouselStyles(colorStyle.sheet, ".carousel." + bundle.get("domid"), attrs, fgColor, bgColor, hasDarkBg);
	});

};

},{"app/control/Globals":41,"app/model/collection/BundleCollection":45,"color":"color","underscore":"underscore"}],75:[function(require,module,exports){
/*global XMLHttpRequest */
var _ = require("underscore");
/** @type {module:underscore.string/lpad} */
var classify = require("underscore.string/classify");

// var statusMsg = _.template("<%= status %> received from <%= url %> (<%= statusText %>)");
// var errMsg = _.template("'<%= errName %>' ocurred during request <%= url %>");

if (window.XMLHttpRequest && window.URL && window.Blob) {
	module.exports = function(url, progressFn) {
		return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			// request.timeout = 10000; // in milliseconds
			request.responseType = "blob";

			// if progressFn is supplied
			// - - - - - - - - - - - - - - - - - -
			if (progressFn) {
				request.onprogress = function(ev) {
					progressFn(ev.loaded / ev.total);
				};
			}
			// resolved/success
			// - - - - - - - - - - - - - - - - - -
			request.onload = function(ev) {
				// When the request loads, check whether it was successful
				if (request.status == 200) {
					// If successful, resolve the promise by passing back a reference url
					resolve(URL.createObjectURL(request.response));
				} else {
					var err = new Error(("http_" + request.statusText.replace(/\s/g, "_")).toUpperCase());
					err.infoCode = request.status;
					err.infoSrc = url;
					err.logEvent = ev;
					err.logMessage = "_loadImageAsObjectURL::" + ev.type + " [reject]";
					reject(err);
				}
			};
			// reject/failure
			// - - - - - - - - - - - - - - - - - -
			request.onerror = function(ev) {
				var err = new Error((ev.type + "_event").toUpperCase());
				err.infoCode = -1;
				err.infoSrc = url;
				err.logEvent = ev;
				err.logMessage = "_loadImageAsObjectURL::" + ev.type + " [reject]";
				reject(err);
			};
			request.onabort = request.ontimeout = request.onerror;
			// finally
			// - - - - - - - - - - - - - - - - - -
			request.onloadend = function() {
				request.onabort = request.ontimeout = request.onerror = void 0;
				request.onload = request.onloadend = void 0;
				if (progressFn) {
					request.onprogress = void 0;
				}
			};

			request.send();
		});
	};
} else {
	module.exports = function(url) {
		return Promise.resolve(url);
	};
}

},{"underscore":"underscore","underscore.string/classify":29}],76:[function(require,module,exports){
module.exports = function(image, resolveEmpty) {
	return new Promise(function(resolve, reject) {
		if (!(image instanceof window.HTMLImageElement)) {
			reject(new Error("not an HTMLImageElement"));
		} else if (image.complete && (image.src.length > 0 || resolveEmpty)) {
			// if (image.src === "") console.warn("_whenImageLoads resolved with empty src");
			// else console.log("_whenImageLoads resolve-sync", image.src);
			resolve(image);
		} else {
			var handlers = {
				load: function(ev) {
					// console.log("_whenImageLoads_dom resolve-async", ev.type, image.src);
					removeEventListeners();
					resolve(image);
				},
				error: function(ev) {
					var err = new Error("Loading failed (" + ev.type + " event)");
					err.infoCode = -1;
					err.infoSrc = image.src;
					err.logEvent = ev;
					err.logMessage = "_whenImageLoads::" + ev.type + " [reject]";
					removeEventListeners();
					reject(err);
				}
			};
			handlers.abort = handlers.error;
			var removeEventListeners = function() {
				for (var event in handlers) {
					if (handlers.hasOwnProperty(event)) {
						image.removeEventListener(event, handlers[event], false);
					}
				}
			};
			for (var event in handlers) {
				if (handlers.hasOwnProperty(event)) {
					image.addEventListener(event, handlers[event], false);
				}
			}
		}
	});
};

},{}],77:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:app/view/promise/_whenImageLoads} */
var _whenImageLoads = require("app/view/promise/_whenImageLoads");
/** @type {module:app/view/promise/_loadImageAsObjectURL} */
var _loadImageAsObjectURL = require("app/view/promise/_loadImageAsObjectURL");

// var isBlobRE = /^blob\:.*/;

var logMessage = "%s::whenDefaultImageLoads [%s]: %s";

module.exports = function(view) {
	return new Promise(function(resolve, reject) {
		var source = view.model.get("source");
		if (source.has("prefetched")) {
			view.defaultImage.src = source.get("prefetched");
			_whenImageLoads(view.defaultImage)
				.then(
					function(targetEl) {
						// console.log(logMessage, view.cid, "resolved", "prefetched");
						resolve(view);
					});
		} else {
			view.mediaState = "pending";

			var sUrl = source.get("original");
			var progressFn = function(progress) {
				// console.log(logMessage, view.cid, "progress", progress);
				view.updateMediaProgress(progress, sUrl);
			};
			progressFn = _.throttle(progressFn, 100, {
				leading: true,
				trailing: false
			});
			_loadImageAsObjectURL(sUrl, progressFn)
				.then(
					function(url) {
						if (/^blob\:.*/.test(url)) {
							source.set("prefetched", url);
						}
						view.defaultImage.src = url;
						// URL.revokeObjectURL(url); 
						return view.defaultImage;
					})
				.then(_whenImageLoads)
				.then(
					function(targetEl) {
						// console.log(logMessage, view.cid, "resolved", targetEl.src);
						view.on("view:removed", function() {
							var prefetched = source.get("prefetched");
							if (prefetched && /^blob\:/.test(prefetched)) {
								source.unset("prefetched", {
									silent: true
								});
								URL.revokeObjectURL(prefetched);
							}
						});
						// view.placeholder.removeAttribute("data-progress");
						// view.updateMediaProgress(imageUrl, "complete");
						resolve(view);
					},
					// 	})
					// .catch(
					function(err) {
						// console.warn(logMessage, view.cid, "rejected", err.message);
						// view.placeholder.removeAttribute("data-progress");
						// view.updateMediaProgress(imageUrl, progress);
						reject(err);
					});
		}
	});
};

},{"app/view/promise/_loadImageAsObjectURL":75,"app/view/promise/_whenImageLoads":76,"underscore":"underscore"}],78:[function(require,module,exports){
/* global Promise */
/** @type {module:app/view/base/ViewError} */
var ViewError = require("app/view/base/ViewError");

/** @type {module:app/view/base/ViewError} */
var whenViewIsAttached = require("app/view/promise/whenViewIsAttached");

function whenScrollingEnds(view) {
	return new Promise(function(resolve, reject) {
		var parent = view.parentView;
		if (parent === null) {
			console.error("%s::whenScrollingEnds [%s] (sync)", view.cid, "rejected", view.attached);
			reject(new ViewError(view, new Error("whenScrollingEnds: view has no parent")));
		} else if (!parent.scrolling) {
			// console.log("%s::whenScrollingEnds [%s] (sync)", view.cid, "resolved", view.attached);
			resolve(view);
		} else {
			var cleanup = function() {
				parent.off("view:scrollend", onScrollend);
				parent.off("view:remove", onRemove);
			};
			var onScrollend = function() {
				// console.log("%s::whenScrollingEnds [%s]", view.cid, "resolved", view.attached);
				cleanup();
				resolve(view);
			};
			var onRemove = function() {
				// console.log("%s::whenScrollingEnds [%s]", view.cid, "rejected", view.attached);
				cleanup();
				reject(new ViewError(view, new Error("whenScrollingEnds: view was removed")));
			};
			parent.on("view:scrollend", onScrollend);
			parent.on("view:remove", onRemove);
		}
	});
}

module.exports = function(view) {
	return Promise.resolve(view)
		.then(whenViewIsAttached)
		.then(whenScrollingEnds);
};

/*
module.exports = function(view) {
	return Promise.resolve(view)
		.then(function(view) {
			if (view.attached) {
				return view;
			} else {
				return new Promise(function(resolve, reject) {
					view.once("view:attached", function(view) {
						resolve(view);
					});
				});
			}
		})
		.then(function(view) {
			if (!view.parentView.scrolling) {
				return view;
			} else {
				return new Promise(function(resolve, reject) {
					var resolveOnScrollend = function() {
						// console.log("%s::whenScrollingEnds [%s]", view.cid, "resolved");
						view.off("view:remove", rejectOnRemove);
						resolve(view);
					};
					var rejectOnRemove = function(view) {
						// console.log("%s::whenScrollingEnds [%s]", view.cid, "rejected");
						view.parentView.off("view:scrollend", resolveOnScrollend);
						reject(new ViewError(view,
							new Error("whenSelectScrollingEnds: view was removed ("+ view.cid +")")));
					};
					view.parentView.once("view:scrollend", resolveOnScrollend);
					view.once("view:remove", rejectOnRemove);
				});
			}
		});
};
*/

},{"app/view/base/ViewError":64,"app/view/promise/whenViewIsAttached":81}],79:[function(require,module,exports){
/** @type {module:app/view/base/ViewError} */
var ViewError = require("app/view/base/ViewError");

// var logMessage = "%s::whenSelectionDistanceIs [%s]: %s";

/**
 * @param {module:app/view/base/View}
 * @param {number} distance
 */
module.exports = function(view, distance) {
	return new Promise(function(resolve, reject) {
		// if (!(view.model && view.model.collection)) {
		// 	reject(new ViewError(view, new Error("whenSelectionIsContiguous: model.collection is empty")));
		// }
		var model = view.model;
		var collection = model.collection;

		var check = function(n) { // Check indices for contiguity
			return Math.abs(collection.indexOf(model) - collection.selectedIndex) <= distance;
		};

		if (check()) {
			// console.log(logMessage, view.cid, "resolve", "sync");
			resolve(view);
		} else {
			var cleanupOnSettle = function() {
				// console.log(logMessage, view.cid, "cleanup", "async");
				collection.off("select:one select:none", resolveOnSelect);
				view.off("view:removed", rejectOnRemove);
			};
			var resolveOnSelect = function(model) {
				if (check()) {
					// console.log(logMessage, view.cid, "resolve", "async");
					cleanupOnSettle();
					resolve(view);
				}
			};
			var rejectOnRemove = function(view) {
				cleanupOnSettle();
				reject(new ViewError(view, new Error("whenSelectionDistanceIs: view was removed")));
			};
			collection.on("select:one select:none", resolveOnSelect);
			view.on("view:removed", rejectOnRemove);
		}
	});
};

},{"app/view/base/ViewError":64}],80:[function(require,module,exports){
/** @type {module:app/view/base/ViewError} */
var ViewError = require("app/view/base/ViewError");

/** @type {module:app/view/promise/whenSelectionDistanceIs} */
var whenSelectionDistanceIs = require("app/view/promise/whenSelectionDistanceIs");

/** @param {module:app/view/base/View} */
module.exports = function(view) {
	return whenSelectionDistanceIs(view, 1);
};

},{"app/view/base/ViewError":64,"app/view/promise/whenSelectionDistanceIs":79}],81:[function(require,module,exports){
module.exports = function(view) {
	return new Promise(function(resolve, reject) {
		if (view.attached) {
			resolve(view);
		} else {
			view.on("view:attached", function(view) {
				resolve(view);
			});
		}
	});
};

},{}],82:[function(require,module,exports){
/**
 * @module app/view/render/CarouselRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:underscore} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

/**
 * @constructor
 * @type {module:app/view/render/CarouselRenderer}
 */
var CarouselRenderer = View.extend({

	/** @type {string} */
	cidPrefix: "carouselRenderer",
	/** @override */
	tagName: "div",
	/** @override */
	className: "carousel-item",
	/** @override */
	template: _.template("<div class=\"content sizing\"><%= name %></div>"),

	properties: {
		content: {
			get: function() {
				return this._content || (this._content = this.el.querySelector(".content"));
			},
		},
		sizing: {
			get: function() {
				return this._sizing || (this._sizing = this.el.querySelector(".sizing"));
			},
		}
	},

	/** @override */
	initialize: function(options) {
		options.parentView && (this.parentView = options.parentView);
		this.metrics = {};
		this.metrics.content = {};
		this.createChildren();
		// this.enabled = !!options.enabled; // force bool
		this.setEnabled(!!options.enabled);
	},

	createChildren: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
	},

	/** @return {HTMLElement} */
	getSizingEl: function() {
		return this._sizing || (this._sizing = this.el.querySelector(".sizing"));
	},

	/** @return {HTMLElement} */
	getContentEl: function() {
		return this._content || (this._content = this.el.querySelector(".content"));
	},

	/** @return {this} */
	measure: function() {
		var sizing = this.getSizingEl();

		this.metrics = getBoxEdgeStyles(this.el, this.metrics);
		this.metrics.content = getBoxEdgeStyles(this.getContentEl(), this.metrics.content);

		sizing.style.maxWidth = "";
		sizing.style.maxHeight = "";

		this.metrics.content.x = sizing.offsetLeft + sizing.clientLeft;
		this.metrics.content.y = sizing.offsetTop + sizing.clientTop;
		this.metrics.content.width = sizing.clientWidth;
		this.metrics.content.height = sizing.clientHeight;

		return this;
	},

	/** @override */
	render: function() {
		this.measure();
		return this;
	},

	getSelectionDistance: function() {
		return Math.abs(this.model.collection.indexOf(this.model) - this.model.collection.selectedIndex);
	},
});

module.exports = CarouselRenderer;

},{"app/view/base/View":63,"underscore":"underscore","utils/css/getBoxEdgeStyles":107}],83:[function(require,module,exports){
/**
 * @module app/view/render/ClickableRenderer
 */

/** @type {module:app/view/render/LabelRenderer} */
var LabelRenderer = require("app/view/render/LabelRenderer");

/**
 * @constructor
 * @type {module:app/view/render/ClickableRenderer}
 */
var ClickableRenderer = LabelRenderer.extend({

	/** @type {string} */
	cidPrefix: "clickableRenderer",

	/** @override */
	events: {
		"click": function(ev) {
			this.trigger("renderer:click", this.model, ev);
		},
		"click a": function(ev) {
			ev.defaultPrevented || ev.preventDefault();
		}
	},
});

module.exports = ClickableRenderer;

},{"app/view/render/LabelRenderer":90}],84:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<a href=\"#"
    + container.escapeExpression(((helper = (helper = helpers.domid || (depth0 != null ? depth0.domid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"domid","hash":{},"data":data}) : helper)))
    + "\"><span class=\"label\">"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span></a>";
},"useData":true});

},{"hbsfy/runtime":25}],85:[function(require,module,exports){
/**
 * @module app/view/render/DefaultSelectableRenderer
 */

/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

/**
 * @constructor
 * @type {module:app/view/render/DefaultSelectableRenderer}
 */
var DefaultSelectableRenderer = ClickableRenderer.extend({

	/** @override */
	tagName: "li",
	/** @override */
	className: "list-item",
	/** @override */
	template: require("./DefaultSelectableRenderer.hbs"),

	initialize: function(options) {
		this.listenTo(this.model, "selected deselected", this._renderClassList);
		this._renderClassList();
	},

	/** @override */
	render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		this._renderClassList();
		return this;
	},

	_renderClassList: function() {
		this.el.classList.toggle("selected", this.model.selected);
	},
});

module.exports = DefaultSelectableRenderer;

},{"./DefaultSelectableRenderer.hbs":84,"app/view/render/ClickableRenderer":83}],86:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span class=\"label\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span><a href=\"#"
    + alias4(((helper = (helper = helpers.domid || (depth0 != null ? depth0.domid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"domid","hash":{},"data":data}) : helper)))
    + "\"><b> </b></a>";
},"useData":true});

},{"hbsfy/runtime":25}],87:[function(require,module,exports){
/**
 * @module app/view/render/DotNavigationRenderer
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {string} */
var viewTemplate = require("./DotNavigationRenderer.hbs");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

/**
 * @constructor
 * @type {module:app/view/render/DotNavigationRenderer}
 */
var DotNavigationRenderer = ClickableRenderer.extend({

	/** @type {string} */
	cidPrefix: "dotRenderer",
	/** @override */
	tagName: "li",
	/** @override */
	className: "list-item",
	/** @override */
	template: viewTemplate,

	/** @override */
	initialize: function(options) {
		this.listenTo(this.model, "selected deselected", this.renderClassList);
		this.renderClassList();
	},

	/** @override */
	render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.renderClassList();
		return this;
	},

	renderClassList: function() {
		this.el.classList.toggle("selected", this.model.selected);
	},
});

module.exports = DotNavigationRenderer;

},{"./DotNavigationRenderer.hbs":86,"app/view/render/ClickableRenderer":83}],88:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"placeholder sizing\"></div>\n<img class=\"content media-border default\" alt=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" longdesc=\"#desc_m"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" />";
},"useData":true});

},{"hbsfy/runtime":25}],89:[function(require,module,exports){
/**
 * @module app/view/render/ImageRenderer
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
// /** @type {module:app/model/item/MediaItem} */
// var MediaItem = require("app/model/item/MediaItem");

/** @type {module:app/view/MediaRenderer} */
var MediaRenderer = require("./MediaRenderer");

/** @type {Function} */
var viewTemplate = require("./ImageRenderer.hbs");

/**
 * @constructor
 * @type {module:app/view/render/ImageRenderer}
 */
var ImageRenderer = MediaRenderer.extend({

	/** @type {string} */
	cidPrefix: "imageRenderer",
	/** @type {string} */
	className: MediaRenderer.prototype.className + " image-renderer",
	/** @type {Function} */
	template: viewTemplate,

	/** @override */
	initialize: function(opts) {
		MediaRenderer.prototype.initialize.apply(this, arguments);
		// this.createChildren();
		// this.initializeAsync();
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		MediaRenderer.prototype.createChildren.apply(this, arguments);
		// this.el.innerHTML = this.template(this.model.toJSON());
		this.placeholder = this.el.querySelector(".placeholder");
	},

	/** @override */
	render: function() {
		MediaRenderer.prototype.render.apply(this, arguments);

		// this.measure();

		var img = this.getDefaultImage();
		img.setAttribute("width", this.metrics.media.width);
		img.setAttribute("height", this.metrics.media.height);

		var content = this.getContentEl();
		content.style.left = this.metrics.content.x + "px";
		content.style.top = this.metrics.content.y + "px";

		// var sizing = this.getSizingEl();
		// sizing.style.maxWidth = this.metrics.content.width + "px";
		// sizing.style.maxHeight = this.metrics.content.height + "px";

		return this;
	},

	/* --------------------------- *
	/* initializeAsync
	/* --------------------------- */

	initializeAsync: function() {
		return MediaRenderer.prototype.initializeAsync.apply(this, arguments)
		// return MediaRenderer.whenSelectionIsContiguous(this)
		// // return Promise.resolve(this)
		// // 	.then(MediaRenderer.whenSelectionIsContiguous)
		// 	.then(MediaRenderer.whenSelectTransitionEnds)
		// 	.then(MediaRenderer.whenDefaultImageLoads)
		// .then(
		// 	function(view) {
		// 		view.mediaState = "ready";
		// 	})
		// .catch(
		// 	function(err) {
		// 		if (err instanceof ViewError) {
		// 			// NOTE: ignore ViewError type
		// 			// console.log(err.view.cid, err.view.model.cid, "ImageRenderer: " + err.message);
		// 		} else {
		// 			console.error(this.cid, err.name, err);
		// 			this.placeholder.innerHTML = "<p class=\"color-fg\" style=\"position:absolute;bottom:0;padding:3rem;\"><strong>" + err.name + "</strong> " + err.message + "</p>";
		// 			this.mediaState = "error";
		// 		}
		// 	}.bind(this))
		;
	},
});

module.exports = ImageRenderer;

},{"./ImageRenderer.hbs":88,"./MediaRenderer":91}],90:[function(require,module,exports){
/**
 * @module app/view/render/LabelRenderer
 */

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");

/**
 * @constructor
 * @type {module:app/view/render/LabelRenderer}
 */
var LabelRenderer = View.extend({

	/** @type {string} */
	cidPrefix: "labelRenderer",

	properties: {
		label: {
			get: function() {
				return this._label || (this._label = this.el.querySelector(".label"));
			}
		}
		// measuredWidth: {
		// 	get: function() {
		// 		return this._measuredWidth;
		// 	}
		// },
		// measuredHeight: {
		// 	get: function() {
		// 		return this._measuredHeight;
		// 	}
		// },
	},

	/* -------------------------------
	/* measure
	/* ------------------------------- */

	// _measuredWidth: null,
	// _measuredHeight: null,
	// measure: function() {},
});

module.exports = LabelRenderer;

},{"app/view/base/View":63}],91:[function(require,module,exports){
/*global XMLHttpRequest, HTMLMediaElement, MediaError*/
/**
 * @module app/view/render/MediaRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:utils/css/getBoxEdgeStyles} */
// var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

/** @type {module:app/model/item/MediaItem} */
var MediaItem = require("app/model/item/MediaItem");
/** @type {module:app/view/CarouselRenderer} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");

var errorTemplate = require("../template/ErrorBlock.hbs");

var MediaRenderer = CarouselRenderer.extend({

	/** @type {string} */
	cidPrefix: "mediaRenderer",
	/** @type {string} */
	className: CarouselRenderer.prototype.className + " media-item",
	/** @type {module:app/model/MediaItem} */
	model: MediaItem,

	properties: {
		defaultImage: {
			get: function() {
				return this._defaultImage || (this._defaultImage = this.el.querySelector("img.default"));
			}
		},
		mediaState: {
			get: function() {
				return this._mediaState;
			},
			set: function(state) {
				this._setMediaState(state);
			}
		}
	},

	/** @override */
	initialize: function(opts) {
		// if (this.model.attrs().hasOwnProperty("@classname")) {
		// 	this.el.className += " " + this.model.attr("@classname");
		// }
		if (this.model.attr("@classname") !== void 0) {
			this.el.classList.add(this.model.attr("@classname"));
		}
		CarouselRenderer.prototype.initialize.apply(this, arguments);

		this.metrics.media = {};
		this.mediaState = "idle";

		this.initializeAsync()
			.then(this.whenInitialized)
			.catch(this.whenInitializeError.bind(this));
	},

	initializeAsync: function() {
		// var MediaRenderer = Object.getPrototypeOf(this).constructor;
		return Promise.resolve(this)
			.then(MediaRenderer.whenSelectionIsContiguous)
			.then(MediaRenderer.whenScrollingEnds)
			.then(MediaRenderer.whenDefaultImageLoads);
	},

	whenInitialized: function(view) {
		// console.log("%s::whenInitialized [%s]", view.cid, "resolved");
		view.mediaState = "ready";
		view.placeholder.removeAttribute("data-progress");
		return view;
	},

	whenInitializeError: function(err) {
		if (err instanceof CarouselRenderer.ViewError) {
			// NOTE: ignore ViewError type
			// console.log("%s::whenInitializeError", err.view.cid, err.message);
			return;
		} else if (err instanceof Error) {
			console.error(err.stack);
		}
		this.renderMediaError(err);
		this.placeholder.removeAttribute("data-progress");
		this.mediaState = "error";
		// this.placeholder.innerHTML = errorTemplate(err);
		// this.placeholder.removeAttribute("data-progress");
		// this.mediaState = "error";

		console.error("%s::initializeAsync [%s (caught)]: %s", this.cid, err.name,
			(err.info && err.info.logMessage) || err.message);
		err.logEvent && console.log(err.logEvent);
	},

	renderMediaError: function(err) {
		this.placeholder.innerHTML = err ? errorTemplate(err) : "";
	},

	updateMediaProgress: function(progress, id) {
		if (_.isNumber(progress)) {
			this.placeholder.setAttribute("data-progress", (progress * 100).toFixed(0));
		}
		// else if (progress === "complete") {
		// 	this.placeholder.removeAttribute("data-progress");
		// }
	},

	// whenMediaIsReady: function(view) {
	// 	return MediaRenderer.whenDefaultImageLoads(this, this.updateMediaProgress.bind(this));
	// },

	/* --------------------------- *
	/* child getters
	/* --------------------------- */

	/** @return {HTMLElement} */
	getDefaultImage: function() {
		return this.defaultImage;
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	createChildren: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
	},

	/** @override */
	measure: function() {
		CarouselRenderer.prototype.measure.apply(this, arguments);

		var sw, sh; // source dimensions
		var pcw, pch; // measured values
		var cx, cy, cw, ch, cs; // computed values
		var ew, eh; // content edge totals
		var cm; // content metrics

		cm = this.metrics.content;
		cx = cm.x;
		cy = cm.y;
		pcw = cm.width;
		pch = cm.height;

		ew = (cm.paddingLeft + cm.paddingRight + cm.borderLeftWidth + cm.borderRightWidth);
		eh = (cm.paddingTop + cm.paddingBottom + cm.borderTopWidth + cm.borderBottomWidth);
		pcw -= ew;
		pch -= eh;

		sw = this.model.get("source").get("w");
		sh = this.model.get("source").get("h");

		// Unless both client dimensions are larger than the source's
		// choose constraint direction by aspect ratio
		if (sw < pcw && sh < pch) {
			cs = 1;
			cw = sw;
			ch = sh;
		} else if ((pcw / pch) < (sw / sh)) {
			// constrain height
			cw = pcw;
			cs = cw / sw;
			// ch = cs * sh;
			ch = Math.round(cs * sh);
		} else {
			// constrain width
			ch = pch;
			cs = ch / sh;
			// cw = cs * sw;
			cw = Math.round(cs * sw);
		}

		this.metrics.content.x = cx;
		this.metrics.content.y = cy;
		this.metrics.content.width = cw + ew;
		this.metrics.content.height = ch + eh;

		this.metrics.media.x = cx + cm.paddingLeft + cm.borderLeftWidth;
		this.metrics.media.y = cy + cm.paddingTop + cm.borderTopWidth;
		this.metrics.media.width = cw;
		this.metrics.media.height = ch;
		this.metrics.media.scale = cs;

		// var sizing = this.getSizingEl();
		// sizing.style.maxWidth = (cw + ew) + "px";
		// sizing.style.maxHeight = (ch + eh) + "px";

		return this;
	},

	render: function() {
		// NOTE: not calling super.render, calling measure ourselves
		this.measure();

		var sizing = this.getSizingEl();
		sizing.style.maxWidth = this.metrics.content.width + "px";
		sizing.style.maxHeight = this.metrics.content.height + "px";

		return this;
	},

	/* --------------------------- *
	/* mediaState
	/* --------------------------- */

	_mediaStateEnum: ["idle", "pending", "ready", "error"],

	_setMediaState: function(key) {
		if (this._mediaStateEnum.indexOf(key) === -1) {
			throw new Error("Argument " + key + " invalid. Must be one of: " + this._mediaStateEnum.join(", "));
		}
		if (this._mediaState !== key) {
			if (this._mediaState) {
				this.el.classList.remove(this._mediaState);
			}
			this.el.classList.add(key);
			this._mediaState = key;
			this.trigger("media:" + key);
		}
	},
}, {
	LOG_TO_SCREEN: true,

	/** @type {module:app/view/promise/whenSelectionIsContiguous} */
	whenSelectionIsContiguous: require("app/view/promise/whenSelectionIsContiguous"),

	// /** @type {module:app/view/promise/whenSelectTransitionEnds} */
	// whenSelectTransitionEnds: require("app/view/promise/whenSelectTransitionEnds"),

	/** @type {module:app/view/promise/whenScrollingEnds} */
	whenScrollingEnds: require("app/view/promise/whenScrollingEnds"),

	/** @type {module:app/view/promise/whenDefaultImageLoads} */
	whenDefaultImageLoads: require("app/view/promise/whenDefaultImageLoads"),
});

/* ---------------------------
/* log to screen
/* --------------------------- */
if (DEBUG) {

	MediaRenderer = (function(MediaRenderer) {
		if (!MediaRenderer.LOG_TO_SCREEN) return MediaRenderer;

		/** @type {Function} */
		var Color = require("color");
		/** @type {module:underscore.strings/lpad} */
		var lpad = require("underscore.string/lpad");
		/** @type {module:underscore.strings/rpad} */
		var rpad = require("underscore.string/rpad");

		return MediaRenderer.extend({

			/** @override */
			initialize: function() {
				MediaRenderer.prototype.initialize.apply(this, arguments);

				var fgColor = new Color(this.model.attr("color"));
				var bgColor = new Color(this.model.attr("background-color"));
				this.__logColors = {
					normal: fgColor.clone().mix(bgColor, 0.75).hslString(),
					ignored: fgColor.clone().mix(bgColor, 0.25).hslString(),
					error: "brown",
					abort: "orange"
				};
				this.__logFrameStyle = "1px dashed " + fgColor.clone().mix(bgColor, 0.5).hslString();
				this.__logStartTime = Date.now();
				this.__rafId = -1;
				this.__onFrame = this.__onFrame.bind(this);
			},

			initializeAsync: function() {
				return MediaRenderer.prototype.initializeAsync.apply(this, arguments).catch(function(err) {
					if (!(err instanceof MediaRenderer.ViewError)) {
						this.__logMessage(err.message, err.name, this.__logColors["error"]);
					}
					return Promise.reject(err);
				}.bind(this));
			},

			/** @override */
			createChildren: function() {
				MediaRenderer.prototype.createChildren.apply(this, arguments);

				this.__logElement = document.createElement("div");
				this.__logElement.className = "debug-log";
				this.el.insertBefore(this.__logElement, this.el.firstElementChild);
			},

			/** @override */
			render: function() {
				MediaRenderer.prototype.render.apply(this, arguments);

				this.__logElement.style.marginTop = "3rem";
				this.__logElement.style.maxHeight = "calc(100% - " + (this.metrics.media.height) + "px - 3rem)";
				this.__logElement.style.width = this.metrics.media.width + "px";
				this.__logElement.scrollTop = this.__logElement.scrollHeight;

				return this;
			},

			__logMessage: function(msg, logtype, color) {
				var logEntryEl = document.createElement("pre");

				logEntryEl.textContent = this.__getTStamp() + " " + msg;
				logEntryEl.setAttribute("data-logtype", logtype || "-");
				logEntryEl.style.color = color || this.__logColors[logtype] || this.__logColors.normal;

				this.__logElement.appendChild(logEntryEl);
				this.__logElement.scrollTop = this.__logElement.scrollHeight;

				if (this.__rafId == -1) {
					this.__rafId = this.requestAnimationFrame(this.__onFrame);
				}
			},

			__onFrame: function(tstamp) {
				this.__rafId = -1;
				this.__logElement.lastElementChild.style.borderBottom = this.__logFrameStyle;
				this.__logElement.lastElementChild.style.paddingBottom = "2px";
				this.__logElement.lastElementChild.style.marginBottom = "2px";
			},

			__getTStamp: function() {
				// return new Date(Date.now() - this.__logStartTime).toISOString().substr(11, 12);
				return lpad(((Date.now() - this.__logStartTime) / 1000).toFixed(3), 8, "0");
			},
		});
	})(MediaRenderer);

} // end debug

/**
 * @constructor
 * @type {module:app/view/render/MediaRenderer}
 */
module.exports = MediaRenderer;

},{"../template/ErrorBlock.hbs":100,"app/model/item/MediaItem":51,"app/view/promise/whenDefaultImageLoads":77,"app/view/promise/whenScrollingEnds":78,"app/view/promise/whenSelectionIsContiguous":80,"app/view/render/CarouselRenderer":82,"color":"color","underscore":"underscore","underscore.string/lpad":35,"underscore.string/rpad":37}],92:[function(require,module,exports){
/**
 * @module app/view/render/PlayableRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");

/** @type {module:app/view/MediaRenderer} */
var MediaRenderer = require("app/view/render/MediaRenderer");
// /** @type {module:app/view/component/ProgressMeter} */
// var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {Function} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {Function} */
var prefixedEvent = require("utils/prefixedEvent");

// var visibilityHiddenProp = prefixedProperty("hidden", document);
/** @type {String} */
var visibilityStateProp = prefixedProperty("visibilityState", document);
/** @type {String} */
var visibilityChangeEvent = prefixedEvent("visibilitychange", document, "hidden");

/** @type {Function} */
// var duotone = require("utils/canvas/bitmap/duotone");
// var stackBlurRGB = require("utils/canvas/bitmap/stackBlurRGB");
// var stackBlurMono = require("utils/canvas/bitmap/stackBlurMono");
// var getAverageRGBA = require("utils/canvas/bitmap/getAverageRGBA");
// var getAverageRGB = require("utils/canvas/bitmap/getAverageRGB");

/** @type {HTMLCanvasElement} */
var _sharedCanvas = null;
/** @return {HTMLCanvasElement} */
var getSharedCanvas = function() {
	if (_sharedCanvas === null) {
		_sharedCanvas = document.createElement("canvas");
	}
	return _sharedCanvas;
};

function logAttachInfo(view, name, level) {
	if (["log", "info", "warn", "error"].indexOf(level) != -1) {
		level = "log";
	}
	console[level].call(console, "%s::%s [parent:%s %s %s depth:%s]", view.cid, name, view.parentView && view.parentView.cid, view.attached ? "attached" : "detached", view._viewPhase, view.viewDepth);

}

/**
 * @constructor
 * @type {module:app/view/render/PlayableRenderer}
 */
var PlayableRenderer = MediaRenderer.extend({

	/** @type {string} */
	cidPrefix: "playableRenderer",

	/** @type {string|Function} */
	className: MediaRenderer.prototype.className + " playable-renderer",

	properties: {
		paused: {
			/** @return {Boolean} */
			get: function() {
				return this._isMediaPaused();
			}
		},
		playbackRequested: {
			/** @return {Boolean} */
			get: function() {
				return this._playbackRequested;
			},
			set: function(value) {
				this._setPlaybackRequested(value);
			}
		},
		playToggle: {
			/** @return {HTMLElement} */
			get: function() {
				return this._playToggle || (this._playToggle = this.el.querySelector(".play-toggle"));
			}
		},
		overlay: {
			/** @return {HTMLElement} */
			get: function() {
				return this._overlay || (this._overlay = this.el.querySelector(".overlay"));
			}
		}
	},

	/** @override */
	initialize: function(opts) {
		MediaRenderer.prototype.initialize.apply(this, arguments);
		_.bindAll(this,
			"_onPlaybackToggle",
			"_onVisibilityChange"
		);
		this._setPlaybackRequested(this._playbackRequested);
		// this.listenTo(this, "view:parentChange", function(childView, newParent, oldParent) {
		// 	// logAttachInfo(this, "[view:parentChange]", "info");
		// 	console.info("%s::[view:parentChange] '%s' to '%s'", this.cid, oldParent && oldParent.cid, newParent && newParent.cid);
		// });
	},

	// /** @override */
	// initializeAsync: function() {
	// 	return MediaRenderer.prototype.initialize.initializeAsync.apply(this, arguments);
	// },

	// /** @override */
	// remove: function() {
	// 	MediaRenderer.prototype.remove.apply(this, arguments);
	// 	return this;
	// },

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	// createChildren: function() {
	// 	this.el.innerHTML = this.template(this.model.toJSON());
	// 	this.placeholder = this.el.querySelector(".placeholder");
	// 	this.content = this.el.querySelector(".content");
	// 	this.image = this.content.querySelector("img.current");
	// },

	/* --------------------------- *
	/* setEnabled
	/* --------------------------- */

	/** @override */
	setEnabled: function(enabled) {
		MediaRenderer.prototype.setEnabled.apply(this, arguments);
		// this._validatePlayback(enabled);
		// if (enabled) {
		this._validatePlayback();
		// } else {
		// 	// if selected, pause media
		// 	this.model.selected && this.togglePlayback(false);
		// 	// this.togglePlayback(false);
		// }
	},

	/* ---------------------------
	/* selection handlers
	/* --------------------------- */

	addSelectionListeners: function() {
		if (this._viewPhase != "initialized")
			throw new Error(this.cid + "::addSelectionListeners called while " + this._viewPhase);

		// logAttachInfo(this, "addSelectionListeners", "log");
		// this.listenTo(this, "view:removed", this.removeSelectionListeners);
		this.listenTo(this.model, "selected", this._onModelSelected);
		this.listenTo(this.model, "deselected", this._onModelDeselected);
		if (this.model.selected) {
			this._onModelSelected();
		}
	},

	// removeSelectionListeners: function() {
	// 	// logAttachInfo(this, "removeSelectionListeners", "log");
	// 	this.stopListening(this, "view:removed", this.removeSelectionListeners);
	// 	this.stopListening(this.model, "selected", this._onModelSelected);
	// 	this.stopListening(this.model, "deselected", this._onModelDeselected);
	// 	if (this.model.selected) {
	// 		this._onModelDeselected();
	// 	}
	// },

	/* model selected handlers:
	/* model selection toggles playback
	/* --------------------------- */

	_onModelSelected: function() {
		console.log("%s::_onModelSelected _playbackRequested: %s, event: %s", this.cid, this._playbackRequested, this._toggleEvent);
		// logAttachInfo(this, "_onModelSelected", "log");
		// this._addParentListeners();
		this.listenTo(this, "view:parentChange", this._onParentChange);
		if (this.parentView) this._onParentChange(this, this.parentView, null);

		this._addDOMListeners();
		this._validatePlayback();
	},

	_onModelDeselected: function() {
		// logAttachInfo(this, "_onModelDeselected", "log");
		// this._removeParentListeners();
		this.stopListening(this, "view:parentChange", this._onParentChange);
		if (this.parentView) this._onParentChange(this, null, this.parentView);

		this._removeDOMListeners();
		this.togglePlayback(false);
		// this._validatePlayback(this.model.selected);
		// this._validatePlayback();
	},

	/* view:parentChange handlers 3
	/* --------------------------- */

	_onParentChange: function(childView, newParent, oldParent) {
		// console.log("[scroll] %s::_onParentChange '%s' to '%s'", this.cid, oldParent && oldParent.cid, newParent && newParent.cid);
		if (oldParent) this.stopListening(oldParent, "view:scrollstart view:scrollend", this._onScrollChange);
		if (newParent) this.listenTo(newParent, "view:scrollstart view:scrollend", this._onScrollChange);
	},

	_onScrollChange: function() {
		if (this.parentView === null) {
			this.togglePlayback(false);
			throw new Error(this.cid + "::_onScrollChange parentView is null");
		}
		// console.log("[scroll] %s::_onScrollChange %s.scrolling: %s", this.cid, this.parentView.cid, this.parentView.scrolling);

		// this._validatePlayback(!this.parentView.scrolling);
		// if (!this.parentView.scrolling) {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* view:parentChange handlers
	/* --------------------------- */

	/*_addParentListeners: function() {
		if (!this.parentView) {
			logAttachInfo(this, "_addParentListeners", "error");
			return;
		}
		this.listenTo(this, "view:remove", this._removeParentListeners);
		this.listenTo(this.parentView, "view:remove", this._removeParentListeners);
		this.listenTo(this.parentView, "view:scrollstart", this._onScrollStart);
		this.listenTo(this.parentView, "view:scrollend", this._onScrollEnd);
	},

	_removeParentListeners: function(view) {
		if (!this.parentView) {
			logAttachInfo(this, "_removeParentListeners", "error");
			return;
		}
		if (view !== void 0) {
			logAttachInfo(this, "_removeParentListeners [event source view]", "info");
			// console.info("%s[playable]::_removeParentListeners event source view: %s", this.cid, view && view.cid);
		}

		this.stopListening(this, "view:remove", this._removeParentListeners);
		this.stopListening(this.parentView, "view:remove", this._removeParentListeners);
		this.stopListening(this.parentView, "view:scrollstart", this._onScrollStart);
		this.stopListening(this.parentView, "view:scrollend", this._onScrollEnd);
	},*/

	/* view:scrollstart view:scrollend
	/* --------------------------- */

	/*_onScrollStart: function() {
		this.togglePlayback(false);
	},

	_onScrollEnd: function() {
		this._validatePlayback();
	},*/

	/* listen to DOM events
	/* --------------------------- */

	_addDOMListeners: function() {
		this.listenTo(this, "view:removed", this._removeDOMListeners);
		document.addEventListener(visibilityChangeEvent, this._onVisibilityChange, false);
		this.playToggle.addEventListener(this._toggleEvent, this._onPlaybackToggle, true);
	},

	_removeDOMListeners: function() {
		this.stopListening(this, "view:removed", this._removeDOMListeners);
		document.removeEventListener(visibilityChangeEvent, this._onVisibilityChange, false);
		this.playToggle.removeEventListener(this._toggleEvent, this._onPlaybackToggle, true);
	},

	/* visibility dom event
	/* --------------------------- */
	_onVisibilityChange: function(ev) {
		// this._validatePlayback(!document[visibilityHiddenProp]);
		// this._validatePlayback(document[visibilityStateProp] != "hidden");
		// if (document[visibilityStateProp] != "hidden") {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* --------------------------- *
	/* play-toggle
	/* --------------------------- */

	/** @type {String} */
	_toggleEvent: window.hasOwnProperty("onpointerup") ? "pointerup" : "mouseup",

	_onPlaybackToggle: function(ev) {
		console.log("%s[%sabled]::_onPlaybackToggle[%s] defaultPrevented: %s", this.cid, this.enabled ? "en" : "dis", ev.type, ev.defaultPrevented);
		// NOTE: Perform action if MouseEvent.button is 0 or undefined (0: left-button)
		if (!ev.defaultPrevented && !ev.button) {
			ev.preventDefault();
			this.playbackRequested = !this.playbackRequested;
		}
	},

	/* --------------------------- *
	/* playbackRequested
	/* --------------------------- */

	/** @type {Boolean?} */
	_playbackRequested: null,

	_setPlaybackRequested: function(value) {
		this._playbackRequested = value;

		var classList = this.content.classList;
		classList.toggle("playing", value === true);
		classList.toggle("paused", value === false);
		classList.toggle("requested", value === true || value === false);

		// this._validatePlayback(this.playbackRequested);
		// if (this.playbackRequested) {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* --------------------------- *
	/* togglePlayback
	/* --------------------------- */

	/** @override */
	togglePlayback: function(newPlayState) {
		// console.log("[scroll] %s::togglePlayback [%s -> %s] (requested: %s)", this.cid,
		// 		(this._isMediaPaused()? "pause" : "play"),
		// 		(newPlayState? "play" : "pause"),
		// 		this.playbackRequested
		// 	);
		if (_.isBoolean(newPlayState) && newPlayState !== this._isMediaPaused()) {
			return; // requested state is current, do nothing
		} else {
			newPlayState = this._isMediaPaused();
		}
		if (newPlayState) { // changing to what?
			this._playMedia();
		} else {
			this._pauseMedia();
		}
	},

	_canResumePlayback: function() {
		return !!(
			this.enabled &&
			this.model.selected &&
			this.playbackRequested &&
			(this.mediaState === "ready") &&
			this.attached &&
			(this.parentView !== null) &&
			(!this.parentView.scrolling) &&
			(document[visibilityStateProp] != "hidden")
		);
	},

	_validatePlayback: function(shortcircuit) {
		// a 'shortcircuit' boolean argument can be passed, and if false, 
		// skip _canResumePlayback and pause playback right away
		if (arguments.length != 0 && !shortcircuit) {
			this.togglePlayback(false);
		} else {
			this.togglePlayback(this._canResumePlayback());
		}
	},

	/* --------------------------- *
	/* abstract
	/* --------------------------- */

	_isMediaPaused: function() {
		console.warn("%s::_isMediaPaused Not implemented", this.cid);
		return true;
	},

	_playMedia: function() {
		console.warn("%s::_playMedia Not implemented", this.cid);
	},

	_pauseMedia: function() {
		console.warn("%s::_pauseMedia Not implemented", this.cid);
	},

	/* --------------------------- *
	/* util
	/* --------------------------- */

	updateOverlay: function(mediaEl, targetEl, rectEl) {
		// // this method is not critical, just catch and log all errors
		// try {
		// 	this._updateOverlay(mediaEl, targetEl, rectEl)
		// } catch (err) {
		// 	console.error("%s::updateOverlay", this.cid, err);
		// }
	},

	_drawMediaElement: function(context, mediaEl, dest) {
		// destination rect
		// NOTE: mediaEl is expected to have the same dimensions in this.metrics.media
		mediaEl || (mediaEl = this.defaultImage);
		dest || (dest = {
			x: 0,
			y: 0,
			width: this.metrics.media.width,
			height: this.metrics.media.height
		});

		// native/display scale
		var sW = this.model.get("source").get("w"),
			sH = this.model.get("source").get("h"),
			rsX = sW / this.metrics.media.width,
			rsY = sH / this.metrics.media.height;

		// dest, scaled to native
		var src = {
			x: Math.max(0, dest.x * rsX),
			y: Math.max(0, dest.y * rsY),
			width: Math.min(sW, dest.width * rsX),
			height: Math.min(sH, dest.height * rsY)
		};

		// resize canvas
		// var canvas = context.canvas;
		// if (canvas.width !== dest.width || canvas.height !== dest.height) {
		// 	canvas.width = dest.width;
		// 	canvas.height = dest.height;
		// }
		context.canvas.width = dest.width;
		context.canvas.height = dest.height;

		// copy image to canvas
		context.clearRect(0, 0, dest.width, dest.height);
		context.drawImage(mediaEl,
			src.x, src.y, src.width, src.height,
			0, 0, dest.width, dest.height // destination rect
		);

		return context;
	},

	/*
	_updateOverlay: function(mediaEl, targetEl, rectEl) {
		// src/dest rects
		// ------------------------------
		rectEl || (rectEl = targetEl);

		// NOTE: does not work with svg element
		// var tRect = rectEl.getBoundingClientRect();
		// var cRect = mediaEl.getBoundingClientRect();
		// var tX = tRect.x - cRect.x,
		// 	tY = tRect.y - cRect.y,
		// 	tW = tRect.width,
		// 	tH = tRect.height;

		// target bounds
		var tX = rectEl.offsetLeft,
			tY = rectEl.offsetTop,
			tW = rectEl.offsetWidth,
			tH = rectEl.offsetHeight;

		if (tX === void 0 || tY === void 0 || tW === void 0 || tH === void 0) {
			return;
		}

		// destination rect
		var RECT_GROW = 20;
		var dest = {
			x: tX - RECT_GROW,
			y: tY - RECT_GROW,
			width: tW + RECT_GROW * 2,
			height: tH + RECT_GROW * 2
		};

		// native/display scale
		var sW = this.model.get("w"),
			sH = this.model.get("h"),
			rsX = sW/this.metrics.media.width,
			rsY = sH/this.metrics.media.height;

		// dest, scaled to native
		var src = {
			x: Math.max(0, dest.x * rsX),
			y: Math.max(0, dest.y * rsY),
			width: Math.min(sW, dest.width * rsX),
			height: Math.min(sH, dest.height * rsY)
		};

		// Copy image to canvas
		// ------------------------------
		var canvas, context, imageData;

		// canvas = document.createElement("canvas");
		// canvas.style.width  = dest.width + "px";
		// canvas.style.height = dest.height + "px";

		canvas = getSharedCanvas();
		if (canvas.width !== dest.width || canvas.height !== dest.height) {
			canvas.width = dest.width;
			canvas.height = dest.height;
		}
		context = canvas.getContext("2d");
		context.clearRect(0, 0, dest.width, dest.height);
		context.drawImage(mediaEl,
			src.x, src.y, src.width, src.height,
			0, 0, dest.width, dest.height // destination rect
		);
		imageData = context.getImageData(0, 0, dest.width, dest.height);

		var avgColor = Color().rgb(getAverageRGB(imageData));
		// var avgHex = avgColor.hexString(), els = this.el.querySelectorAll("img, video");
		// for (var i = 0; i < els.length; i++) {
		// 	els.item(i).style.backgroundColor = avgHex;
		// }

		targetEl.classList.toggle("over-dark", avgColor.dark());

		// console.log("%s::updateOverlay() avgColor:%s (%s)", this.cid, avgColor.rgbString(), avgColor.dark()?"dark":"light", targetEl);

		// Color, filter opts
		// ------------------------------

		// this.fgColor || (this.fgColor = new Color(this.model.attr("color")));
		// this.bgColor || (this.bgColor = new Color(this.model.attr("background-color")));
		//
		// var opts = { radius: 20 };
		// var isFgDark = this.fgColor.luminosity() < this.bgColor.luminosity();
		// opts.x00 = isFgDark? this.fgColor.clone().lighten(0.5) : this.bgColor.clone().darken(0.5);
		// opts.xFF = isFgDark? this.bgColor.clone().lighten(0.5) : this.fgColor.clone().darken(0.5);
		//
		// stackBlurMono(imageData, opts);
		// duotone(imageData, opts);
		// stackBlurRGB(imageData, { radius: 20 });
		//
		// context.putImageData(imageData, 0, 0);
		// targetEl.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
	}*/
});

// if (DEBUG) {
//
// PlayableRenderer = (function(PlayableRenderer) {
// 	if (!PlayableRenderer.LOG_TO_SCREEN) return PlayableRenderer;
//
// 	/** @type {module:underscore.strings/lpad} */
// 	var lpad = require("underscore.string/lpad");
//
// 	return PlayableRenderer.extend({
// 		_canResumePlayback: function() {
// 			var retval = PlayableRenderer.prototype._canResumePlayback.apply(this.arguments);
// 			console.log("[scroll] %s::_canResumePlayback():%s", this.cid, retval,
// 			{
// 				"enabled": this.enabled,
// 				"selected": (!!this.model.selected),
// 				"playbackRequested": this.playbackRequested,
// 				"attached": this.attached,
// 				"parentView": (this.parentView && this.parentView.cid),
// 				"!scrolling": (this.parentView && !this.parentView.scrolling),
// 				"mediaState": this.mediaState,
// 				// "!document.hidden": !document[visibilityHiddenProp],
// 				"visibilityState": document[visibilityStateProp]
// 			});
// 			return retval;
// 		},
// 	});
// })(PlayableRenderer);
//
// }

module.exports = PlayableRenderer;

},{"app/view/render/MediaRenderer":91,"color":"color","underscore":"underscore","utils/prefixedEvent":111,"utils/prefixedProperty":112}],93:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"placeholder sizing\"></div>\n<div class=\"content\">\n	<div class=\"media-border content-size\"></div>\n	<div class=\"controls content-size\">\n		<div class=\"top-bar control-box\">\n		</div>\n	</div>\n	<div class=\"sequence media-size\">\n		<img class=\"sequence-step current default\" alt=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" longdesc=\"#desc_m"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" />\n	</div>\n	<div class=\"overlay media-size\">\n		<div class=\"play-toggle-hitarea play-toggle\">\n		</div>\n	</div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],94:[function(require,module,exports){
/**
 * @module app/view/render/SequenceRenderer
 */

/* --------------------------- *
/* Imports
/* --------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/render/PlayableRenderer} */
var PlayableRenderer = require("app/view/render/PlayableRenderer");
// /** @type {module:app/model/SelectableCollection} */
// var SelectableCollection = require("app/model/SelectableCollection");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

/** @type {module:app/view/component/ProgressMeter} */
var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {module:utils/Timer} */
var Timer = require("utils/Timer");
// /** @type {Function} */
// var transitionEnd = require("utils/event/transitionEnd");
// /** @type {module:utils/prefixedProperty} */
// var prefixed = require("utils/prefixedProperty");

/** @type {Function} */
var _whenImageLoads = require("app/view/promise/_whenImageLoads");
/** @type {module:app/view/promise/_loadImageAsObjectURL} */
var _loadImageAsObjectURL = require("app/view/promise/_loadImageAsObjectURL");
/** @type {Function} */
var whenSelectionDistanceIs = require("app/view/promise/whenSelectionDistanceIs");
// var whenSelectTransitionEnds = require("app/view/promise/whenSelectTransitionEnds");
// var whenDefaultImageLoads = require("app/view/promise/whenDefaultImageLoads");

// /** @type {Function} */
// var Color = require("color");
// var duotone = require("utils/canvas/bitmap/duotone");
// var stackBlurRGB = require("utils/canvas/bitmap/stackBlurRGB");
// var stackBlurMono = require("utils/canvas/bitmap/stackBlurMono");
// var getAverageRGBA = require("utils/canvas/bitmap/getAverageRGBA");

var errorTemplate = require("../template/ErrorBlock.hbs");

/* --------------------------- *
/* Private classes
/* --------------------------- */

// /**
// * @constructor
// * @type {module:app/view/render/SequenceRenderer.SourceCollection}
// */
// var SourceCollection = SelectableCollection.extend({
// 	model: Backbone.Model
// });

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer.PrefetechedSourceRenderer}
 */
var PrefetechedSourceRenderer = View.extend({

	cidPrefix: "sequenceStepRenderer",
	/** @type {string} */
	className: "sequence-step",
	/** @type {string} */
	tagName: "img",

	properties: {
		ready: {
			get: function() {
				return this._ready;
			}
		}
	},

	/** @override */
	initialize: function(options) {
		if (this.model.has("prefetched")) {
			this._renderPrefetched();
		} else {
			this.listenTo(this.model, "change:prefetched", this._renderPrefetched);
		}
		this.listenTo(this.model, "selected deselected", this._renderSelection);
		this._renderSelection();
	},

	_renderSelection: function() {
		this.el.classList.toggle("current", !!this.model.selected);
	},

	_renderPrefetched: function() {
		var prefetched = this.model.get("prefetched");
		if (prefetched !== this.el.src) {
			this.el.src = prefetched;
		}
		_whenImageLoads(this.el).then(
			function(el) {
				this.requestAnimationFrame(function(tstamp) {
					this._setReady(true);
				});
			}.bind(this),
			function(err) {
				// this._setReady(false);
				(err instanceof Error) || (err = new Error("cannot load prefetched url"));
				throw err;
			}.bind(this)
		);
	},

	/** @type {boolean} */
	_ready: false,

	_setReady: function(ready) {
		if (this._ready === ready) return;
		this._ready = !!(ready); // make bool
		this.trigger("renderer:ready", this);
	},

	render: function() {
		// if (this.model.has("prefetched")) {
		// 	this._renderPrefetched();
		// }
		// this.el.classList.toggle("current", !!this.model.selected);
		console.log("%s::render", this.cid);
		return this;
	},
});

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer.SimpleSourceRenderer}
 */
// var SimpleSourceRenderer = View.extend({
//
// 	cidPrefix: "sequenceStepRenderer",
// 	/** @type {string} */
// 	className: "sequence-step",
// 	/** @type {string} */
// 	tagName: "img",
//
// 	/** @override */
// 	initialize: function (options) {
// 		// this.el.classList.toggle("current", this.model.hasOwnProperty("selected"));
// 		this.el.classList.toggle("current", !!this.model.selected);
// 		this.listenTo(this.model, {
// 			"selected": function () {
// 				this.el.classList.add("current");
// 			},
// 			"deselected": function () {
// 				this.el.classList.remove("current");
// 			}
// 		});
// 		if (this.el.src === "") {
// 			this.el.src = Globals.MEDIA_DIR + "/" + this.model.get("src");
// 		}
//
// 		if (this.model.has("error")) {
// 			this._onModelError();
// 		} else {
// 			this.listenToOnce(this.model, "change:error", this._onModelError);
// 			// this.listenToOnce(this.model, {
// 			// 	"change:source": this._onModelSource,
// 			// 	"change:error": this._onModelError,
// 			// });
// 		}
// 	},
//
// 	// _onModelSource: function() {
// 	// 	this.el.src = Globals.MEDIA_DIR + "/" + this.model.get("src");
// 	// 	// console.log("%s::change:src", this.cid, this.model.get("src"));
// 	// },
//
// 	_onModelError: function() {
// 		var err = this.model.get("error");
// 		var errEl = document.createElement("div");
// 		errEl.className = "error color-bg" + (this.model.selected? " current" : "");
// 		errEl.innerHTML = errorTemplate(err);
// 		this.setElement(errEl, true);
// 		console.log("%s::change:error", this.cid, err.message, err.infoSrc);
// 	},
// });

var SourceErrorRenderer = View.extend({

	/** @type {string} */
	className: "sequence-step error",
	/** @override */
	cidPrefix: "sourceErrorRenderer",
	/** @override */
	template: errorTemplate,
	/** @type {boolean} */
	ready: true,

	initialize: function(options) {
		// var handleSelectionChange = function onSelectionChange () {
		// 	this.el.classList.toggle("current", !!this.model.selected);
		// };
		// this.listenTo(this.model, "selected deselected", handleSelectionChange);
		// // this.el.classList.toggle("current", !!this.model.selected);
		// handleSelectionChange.call(this);
		this.listenTo(this.model, "selected deselected", function() {
			this.el.classList.toggle("current", !!this.model.selected);
		});
	},

	render: function() {
		this.el.classList.toggle("current", !!this.model.selected);
		this.el.innerHTML = this.template(this.model.get("error"));
		return this;
	},
});

var SequenceStepRenderer = PrefetechedSourceRenderer;
// var SequenceStepRenderer = SimpleSourceRenderer;

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer}
 */
var SequenceRenderer = PlayableRenderer.extend({

	/** @type {string} */
	cidPrefix: "sequenceRenderer",
	/** @type {string} */
	className: PlayableRenderer.prototype.className + " sequence-renderer",
	/** @type {Function} */
	template: require("./SequenceRenderer.hbs"),

	/* --------------------------- *
	/* initialize
	/* --------------------------- */

	initialize: function() {
		this.sources = this.model.get("sources");
		PlayableRenderer.prototype.initialize.apply(this, arguments);
	},

	initializeAsync: function() {
		return PlayableRenderer.prototype.initializeAsync.apply(this, arguments)
			.then(
				function(view) {
					return view.whenAttached();
				})
			.then(function(view) {
				view.initializePlayable();
				view.updateOverlay(view.defaultImage, view.overlay);
				view.addSelectionListeners();
				return view;
			});
	},

	whenInitialized: function(view) {
		var retval = PlayableRenderer.prototype.whenInitialized.apply(this, arguments);
		view._validatePlayback();
		return retval;
	},

	/* --------------------------- *
	/* children
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		PlayableRenderer.prototype.createChildren.apply(this, arguments);

		this.placeholder = this.el.querySelector(".placeholder");
		this.sequence = this.content.querySelector(".sequence");

		this.content.classList.add("started");

		// styles
		// ---------------------------------
		var s, attrs = this.model.attrs();
		// var s, attrs = this.model.get("attrs");
		s = _.pick(attrs, "box-shadow", "border", "border-radius");
		_.extend(this.content.querySelector(".media-border").style, s);
		s = _.pick(attrs, "border-radius");
		_.extend(this.sequence.style, s);
		_.extend(this.placeholder.style, s);

		// model
		// ---------------------------------
		this.sources.select(this.model.get("source"));

		// itemViews
		// ---------------------------------
		this.itemViews = new Container();
		// add default image as renderer (already in DOM)
		this.itemViews.add(new SequenceStepRenderer({
			el: this.getDefaultImage(),
			model: this.sources.selected
		}));
	},

	/* --------------------------- *
	/* layout
	/* --------------------------- */

	/** @override */
	render: function() {
		PlayableRenderer.prototype.render.apply(this, arguments);

		var els, el, i, cssW, cssH;
		var content = this.content;

		// media-size
		// ---------------------------------
		cssW = this.metrics.media.width + "px";
		cssH = this.metrics.media.height + "px";

		els = this.el.querySelectorAll(".media-size");
		for (i = 0; i < els.length; i++) {
			el = els.item(i);
			el.style.width = cssW;
			el.style.height = cssH;
		}
		content.style.width = cssW;
		content.style.height = cssH;

		// content-position
		// ---------------------------------
		var cssX, cssY;
		cssX = this.metrics.content.x + "px";
		cssY = this.metrics.content.y + "px";
		content.style.left = cssX;
		content.style.top = cssY;

		el = this.el.querySelector(".controls");
		// el.style.left = cssX;
		// el.style.top = cssY;
		el.style.width = this.metrics.content.width + "px";
		el.style.height = this.metrics.content.height + "px";

		// // content-size
		// // ---------------------------------
		// cssW = this.metrics.content.width + "px";
		// cssH = this.metrics.content.height + "px";
		//
		// els = this.el.querySelectorAll(".content-size");
		// for (i = 0; i < els.length; i++) {
		// 	el = els.item(i);
		// 	el.style.width = cssW;
		// 	el.style.height = cssH;
		// }

		return this;
	},

	initializePlayable: function() {
		// Sequence model
		// ---------------------------------
		// this.sources = this._createSourceCollection(this.model);
		whenSelectionDistanceIs(this, 0).then(this._preloadAllItems, function(err) {
			if (err instanceof View.ViewError) { // Ignore ViewError
				// console.warn(err.name, err.message);//, err.view.cid);
				return;
			}
			return err;
		});

		// timer
		// ---------------------------------
		this._sequenceInterval = parseInt(this.model.attr("@sequence-interval")) || 2500;

		this.timer = new Timer();
		this.listenTo(this, "view:removed", function() {
			this.timer.stop();
			this.stopListening(this.timer);
		});
		this.listenTo(this.timer, {
			"start": this._onTimerStart,
			"resume": this._onTimerResume,
			"pause": this._onTimerPause,
			"end": this._onTimerEnd,
			// "stop": function () { // stop is only called on view remove},
		});

		// progress-meter model
		// ---------------------------------
		this._sourceProgressByIdx = this.sources.map(function() {
			return 0;
		});
		this._sourceProgressByIdx[0] = 1; // first item is already loaded

		// progress-meter
		// ---------------------------------

		this.progressMeter = new ProgressMeter({
			values: {
				available: this._sourceProgressByIdx.concat(),
			},
			maxValues: {
				amount: this.sources.length,
				available: this.sources.length,
			},
			color: this.model.attr("color"),
			backgroundColor: this.model.attr("background-color"),
			labelFn: this._progressLabelFn.bind(this)
		});

		this.el.querySelector(".top-bar").appendChild(this.progressMeter.render().el);
	},

	_progressLabelFn: function() {
		if (this.playbackRequested === false) return Globals.PAUSE_CHAR;
		return (this.sources.selectedIndex + 1) + "/" + this.sources.length;
	},

	_preloadAllItems: function(view) {
		view.once("view:remove", function() {
			var silent = {
				silent: true
			};
			view.sources.forEach(function(item, index, sources) {
				var prefetched = item.get("prefetched");
				if (prefetched && /^blob\:/.test(prefetched)) {
					item.unset("prefetched", silent);
					item.set("progress", 0, silent);
					URL.revokeObjectURL(prefetched);
				}
			});
		});
		return view.sources.reduce(function(lastPromise, item, index, sources) {
			return lastPromise.then(function(view) {
				if (item.has("prefetched")) {
					view._updateItemProgress(1, index);
					return view;
				} else {
					return _loadImageAsObjectURL(item.get("original"),
							function(progress) {
								view._updateItemProgress(progress, index);
								item.set("progress", progress);
							})
						.then(
							function(pUrl) {
								view._updateItemProgress(1, index);
								item.set({
									prefetched: pUrl,
									progress: 1
								});
								// item.set("prefetched", pUrl);
								return view;
							},
							function(err) {
								view._updateItemProgress(0, index);
								item.set({
									error: err,
									progress: 0
								});
								// item.set("error", err);
								return view;
							}
						);
				}
			});
		}, Promise.resolve(view));
	},

	// _preloadAllItems2: function(view) {
	// 	return view.sources.reduce(function(lastPromise, item, index, sources) {
	// 		return lastPromise.then(function(view) {
	// 			var itemView = view._getItemRenderer(item);
	// 			return _whenImageLoads(itemView.el).then(function(url){
	// 				view._updateItemProgress(1, index);
	// 				return view;
	// 			}, function(err) {
	// 				view._updateItemProgress(0, index);
	// 				item.set("error", err);
	// 				return view;
	// 			});
	// 		});
	// 	}, Promise.resolve(view));
	// },

	// _getItemRenderer: function(item) {}

	_updateItemProgress: function(progress, index) {
		this._sourceProgressByIdx[index] = progress;
		if (this.progressMeter) {
			this.progressMeter.valueTo(this._sourceProgressByIdx, 300, "available");
		}
	},

	/* ---------------------------
	/* PlayableRenderer implementation
	/* --------------------------- */

	/** @override initial value */
	_playbackRequested: true,

	/** @type {Boolean} internal store */
	_paused: true,

	/** @override */
	_isMediaPaused: function() {
		return this._paused;
	},

	/** @override */
	_playMedia: function() {
		if (!this._paused) return;
		this._paused = false;
		if (this.timer.status == Timer.PAUSED) {
			this.timer.start(); // resume, actually
		} else {
			this.timer.start(this._sequenceInterval);
		}
	},

	/** @override */
	_pauseMedia: function() {
		if (this._paused) return;
		this._paused = true;
		if (this.timer.status == Timer.STARTED) {
			this.timer.pause();
		}
	},

	/* --------------------------- *
	/* sequence private
	/* --------------------------- */

	_onTimerStart: function(duration) {
		this.progressMeter.valueTo(this.sources.selectedIndex + 1, duration, "amount");
		// init next renderer now to have smooth transitions
		this._getItemRenderer(this.sources.followingOrFirst());
	},

	_onTimerResume: function(duration) {
		this.progressMeter.valueTo(this.sources.selectedIndex + 1, duration, "amount");
	},

	_onTimerPause: function(duration) {
		// var meterDur = this.progressMeter._valueData["amount"]._duration - this.progressMeter._valueData["amount"]._elapsedTime;
		// var meterVal = this.progressMeter.getRenderedValue("amount");
		// var timerVal = (this._sequenceInterval - duration) / this._sequenceInterval + this.sources.selectedIndex;
		//
		// console.log("%s::_onTimerPause [interval:%sms]\n\tmeter:%s (%sms)\n\ttimer:%s (%sms)\n\tdiffs:%s (%sms)",
		// 		this.cid, this._sequenceInterval,
		// 		meterVal, meterDur,
		// 		timerVal, duration,
		// 		Math.abs(meterVal-timerVal), Math.abs(meterDur-duration));

		// this.progressMeter.valueTo(timerVal);
		// this.progressMeter.valueTo(meterVal);

		this.progressMeter.valueTo(this.progressMeter.getRenderedValue("amount"), 0, "amount");
	},

	_onTimerEnd: function() {
		var context = this;
		var nextSource, nextView;

		nextSource = this.sources.followingOrFirst();
		// init next renderer
		nextView = this._getItemRenderer(nextSource).el;
		// init second next renderer
		// this._getItemRenderer(this.sources.followingOrFirst(nextSource));

		var showNextView = function() {
			context.requestAnimationFrame(function() {
				context.content.classList.remove("waiting");
				if (!context._paused) {
					// if (context.playbackRequested) {
					context.content.classList.toggle("playback-error", nextSource.has("error"));
					context.sources.select(nextSource); // NOTE: step increase done here
					// view.updateOverlay(nextView.el, view.overlay);
					context.timer.start(context._sequenceInterval);
				}
			});
		};

		if (nextSource.has("prefetched") || nextSource.has("error")) {
			// nextView = context._getItemRenderer(nextSource).el;
			_whenImageLoads(nextView.el).then(showNextView, showNextView);
		} else {
			this.content.classList.add("waiting");
			this.listenTo(nextSource, "change:prefetched change:error", function() {
				this.stopListening(nextSource, "change:prefetched change:error");
				// context.content.classList.remove("waiting");
				// nextView = context._getItemRenderer(nextSource).el;
				_whenImageLoads(nextView.el).then(showNextView, showNextView);
			});
		}
	},

	_getItemRenderer: function(item) {
		var view = this.itemViews.findByModel(item);
		if (!view) {
			var renderer = item.has("error") ? SourceErrorRenderer : SequenceStepRenderer;
			view = new renderer({
				model: item
			});
			// view = new SequenceStepRenderer({ model: item });
			this.itemViews.add(view);
			this.sequence.appendChild(view.render().el);
		}
		return view;
	},

	/* --------------------------- *
	/* progress meter
	/* --------------------------- */

	// _createDefaultItemData: function() {
	// 	var canvas = document.createElement("canvas");
	// 	var context = canvas.getContext("2d");
	// 	var imageData = this._drawMediaElement(context).getImageData(0, 0, canvas.width, canvas.height);
	//
	// 	var opts = { radius: 20 };
	// 	var fgColor = new Color(this.model.attr("color"));
	// 	var bgColor = new Color(this.model.attr("background-color"));
	// 	var isFgDark = fgColor.luminosity() < bgColor.luminosity();
	// 	opts.x00 = isFgDark? fgColor.clone().lighten(0.33) : bgColor.clone().darken(0.33);
	// 	opts.xFF = isFgDark? bgColor.clone().lighten(0.33) : fgColor.clone().darken(0.33);
	//
	// 	stackBlurMono(imageData, opts);
	// 	duotone(imageData, opts);
	// 	// stackBlurRGB(imageData, opts);
	//
	// 	context.putImageData(imageData, 0, 0);
	// 	return canvas.toDataURL();
	// },
});

if (DEBUG) {

	SequenceRenderer = (function(SequenceRenderer) {
		if (!SequenceRenderer.LOG_TO_SCREEN) return SequenceRenderer;

		/** @type {module:underscore.strings/lpad} */
		var lpad = require("underscore.string/lpad");

		return SequenceRenderer.extend({
			__logTimerEvent: function(evname, msg) {
				var logMsg = [
				"source: ", lpad(this.sources.selectedIndex, 2),
				"duration:", lpad(this.timer.getDuration(), 4),
				"paused:", this.paused,
				"requested:", this.playbackRequested,
				"status:", this.timer.getStatus(),
			];
				msg && logMsg.push(msg);
				logMsg = logMsg.join(" ");

				this.__logMessage(logMsg, evname);
				// console.log("%s::[%s] %s", this.cid, evname, logMsg);
			},
			_playMedia: function() {
				this.__logTimerEvent("playback");
				SequenceRenderer.prototype._playMedia.apply(this, arguments);
				// console.log("%s::_playMedia()", this.cid);
			},
			_pauseMedia: function() {
				this.__logTimerEvent("playback");
				SequenceRenderer.prototype._pauseMedia.apply(this, arguments);
				// console.log("%s::_pauseMedia()", this.cid);
			},

			_onTimerStart: function() {
				this.__logTimerEvent("timer:start");
				SequenceRenderer.prototype._onTimerStart.apply(this, arguments);
			},
			_onTimerResume: function() {
				this.__logTimerEvent("timer:resume");
				SequenceRenderer.prototype._onTimerStart.apply(this, arguments);
			},
			_onTimerPause: function() {
				this.__logTimerEvent("timer:pause");
				SequenceRenderer.prototype._onTimerPause.apply(this, arguments);
			},
			_onTimerEnd: function() {
				this.__logTimerEvent("timer:end");
				SequenceRenderer.prototype._onTimerEnd.apply(this, arguments);
			},

			_updateItemProgress: function(progress, srcIdx) {
				if (progress == 1) {
					this.__logMessage("idx:" + srcIdx + " progress:" + progress, "load:progress");
				}
				SequenceRenderer.prototype._updateItemProgress.apply(this, arguments);
			},

			_preloadAllItems: function(view) {
				view.__logMessage(view.cid + "::_preloadAllItems", "load:start");
				SequenceRenderer.prototype._preloadAllItems.apply(view, arguments);
			},
		});
	})(SequenceRenderer);
}

module.exports = SequenceRenderer;

},{"../template/ErrorBlock.hbs":100,"./SequenceRenderer.hbs":93,"app/control/Globals":41,"app/view/base/View":63,"app/view/component/ProgressMeter":71,"app/view/promise/_loadImageAsObjectURL":75,"app/view/promise/_whenImageLoads":76,"app/view/promise/whenSelectionDistanceIs":79,"app/view/render/PlayableRenderer":92,"backbone.babysitter":"backbone.babysitter","underscore":"underscore","underscore.string/lpad":35,"utils/Timer":102}],95:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"placeholder sizing\"></div>\n<div class=\"content media-border\">\n	<div class=\"controls content-size\">\n		<div class=\"top-bar control-box\">\n			<a class=\"fullscreen-toggle\" href=\"javascript:(void 0)\">\n				<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"-21 -21 42 42\" style=\"max-width:14px;max-height:14px\">\n					<path d=\"M-5,5 L-20,20 M-7,20 L-20,20 L-20,7 M5,-5 L20,-20 M7,-20 L20,-20 L20,-7\" class=\"color-stroke\" style=\"stroke-width:1;fill:none;\" vector-effect=\"non-scaling-stroke\" />\n				</svg>\n			</a>\n		</div>\n	</div>\n	<div class=\"crop-box media-size\">\n		<video preload=\"none\"></video>\n		<img class=\"poster default\" alt=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\" />\n	</div>\n	<div class=\"overlay media-size\">\n		<div class=\"play-toggle-hitarea play-toggle\">\n		</div>\n	</div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],96:[function(require,module,exports){
/*global HTMLMediaElement, MediaError*/
/**
 * @module app/view/render/VideoRenderer
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
 */

/* --------------------------- *
/* Imports
/* --------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/render/PlayableRenderer} */
var PlayableRenderer = require("app/view/render/PlayableRenderer");
/** @type {module:app/view/component/ProgressMeter} */
var ProgressMeter = require("app/view/component/ProgressMeter");
// /** @type {module:utils/prefixedStyleName} */
// var prefixedStyleName = require("utils/prefixedStyleName");
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

/* --------------------------- *
/* private static
/* --------------------------- */

// var whenViewIsAttached = require("app/view/promise/whenViewIsAttached");

var fullscreenChangeEvent = prefixedEvent("fullscreenchange", document);
var fullscreenErrorEvent = prefixedEvent("fullscreenerror", document);

var formatTimecode = function(value) {
	if (isNaN(value)) return ""; //value = 0;
	if (value >= 3600) return ((value / 3600) | 0) + "H";
	if (value >= 60) return ((value / 60) | 0) + "M";
	// if (value >= 10) return "0" + (value | 0) + "S";
	return (value | 0) + "S";
};

/**
 * @constructor
 * @type {module:app/view/render/VideoRenderer}
 */
var VideoRenderer = PlayableRenderer.extend({

	/** @type {string} */
	cidPrefix: "videoRenderer",
	/** @type {string} */
	className: PlayableRenderer.prototype.className + " video-renderer",
	/** @type {Function} */
	template: require("./VideoRenderer.hbs"),

	events: (function() {
		return window.hasOwnProperty("onpointerup")
			? { "pointerup .fullscreen-toggle": "_onFullscreenToggle" }
			: { "mouseup .fullscreen-toggle": "_onFullscreenToggle" }
	}()),

	// events: {
	// 	"click .fullscreen-toggle": "_onFullscreenToggle",
	// },

	// properties: {
	// 	paused: {
	// 		get: function() {
	// 			return this.video.paused;
	// 		}
	// 	},
	// },

	/** @override */
	initialize: function(opts) {
		PlayableRenderer.prototype.initialize.apply(this, arguments);

		_.bindAll(this,
			"_updatePlaybackState",
			"_updatePlayedValue",
			"_updateBufferedValue",
			"_onMediaError",
			"_onMediaEnded",
			"_onMediaPlayingOnce",
			"_onFullscreenChange"
		);
		// var onPeerSelect = function() {
		// 	this.content.style.display = (this.getSelectionDistance() > 1)? "none": "";
		// };
		// this.listenTo(this.model.collection, "select:one select:none", onPeerSelect);
		// onPeerSelect();
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		PlayableRenderer.prototype.createChildren.apply(this, arguments);

		this.placeholder = this.el.querySelector(".placeholder");
		// this.overlay = this.content.querySelector(".overlay");
		this.video = this.content.querySelector("video");
		// this.video.loop = this.model.attrs().hasOwnProperty("@video-loop");
		this.video.loop = this.model.attr("@video-loop") !== void 0;
		this.video.src = this.findPlayableSource(this.video);
	},

	measure: function() {
		PlayableRenderer.prototype.measure.apply(this, arguments);

		// NOTE: Top/bottom 1px video crop
		// - Cropped in CSS: video, .poster { margin-top: -1px; margin-bottom: -1px;}
		// - Cropped height is adjusted in metrics obj
		// - Crop amount added back to actual video on render()
		this.metrics.media.height -= 2;
		this.metrics.content.height -= 2;
	},

	/** @override */
	render: function() {
		PlayableRenderer.prototype.render.apply(this, arguments);

		var els, el, i, cssW, cssH;
		var img = this.defaultImage;
		var content = this.content;

		// media-size
		// ---------------------------------
		cssW = this.metrics.media.width + "px";
		cssH = this.metrics.media.height + "px";

		els = this.el.querySelectorAll(".media-size");
		for (i = 0; i < els.length; i++) {
			el = els.item(i);
			el.style.width = cssW;
			el.style.height = cssH;
		}

		content.style.width = cssW;
		content.style.height = (this.metrics.media.height - 1) + "px";

		// content-position
		// ---------------------------------
		var cssX, cssY;
		cssX = this.metrics.content.x + "px";
		cssY = this.metrics.content.y + "px";
		content.style.left = cssX;
		content.style.top = cssY;

		el = this.el.querySelector(".controls");
		// el.style.left = cssX;
		// controls.style.top = cssY;
		el.style.width = this.metrics.content.width + "px";
		el.style.height = this.metrics.content.height + "px";

		// // content-size
		// // ---------------------------------
		// cssW = this.metrics.content.width + "px";
		// cssH = this.metrics.content.height + "px";
		//
		// els = this.el.querySelectorAll(".content-size");
		// for (i = 0; i < els.length; i++) {
		// 	el = els.item(i);
		// 	el.style.width = cssW;
		// 	el.style.height = cssH;
		// }

		// NOTE: elements below must use video's UNCROPPED height, so +2px
		this.video.setAttribute("width", this.metrics.media.width);
		this.video.setAttribute("height", this.metrics.media.height + 2);
		img.setAttribute("width", this.metrics.media.width);
		img.setAttribute("height", this.metrics.media.height + 2);

		return this;
	},

	/* --------------------------- *
	/* initializeAsync
	/* --------------------------- */

	initializeAsync: function() {
		return Promise.resolve(this)
			.then(PlayableRenderer.whenSelectionIsContiguous)
			.then(PlayableRenderer.whenScrollingEnds)
			.then(
				function(view) {
					return Promise.all([
						view.whenVideoHasMetadata(view),
						PlayableRenderer.whenDefaultImageLoads(view),
					]).then(
						function(arr) {
							return Promise.resolve(view);
						},
						function(err) {
							return Promise.reject(err);
						}
					);
				})
			.then(
				function(view) {
					return view.whenAttached();
				})
			.then(
				function(view) {
					view.initializePlayable();
					view.updateOverlay(view.defaultImage, view.overlay);
					view.addSelectionListeners();
					return view;
				});
	},

	initializePlayable: function() {
		// video
		// ---------------------------------
		this.addMediaListeners();

		// progress-meter
		// ---------------------------------
		this.progressMeter = new ProgressMeter({
			maxValues: {
				amount: this.video.duration,
				available: this.video.duration,
			},
			color: this.model.attr("color"),
			backgroundColor: this.model.attr("background-color"),
			labelFn: this._progressLabelFn.bind(this)
		});
		var parentEl = this.el.querySelector(".top-bar");
		parentEl.insertBefore(this.progressMeter.render().el, parentEl.firstChild);
	},

	_progressLabelFn: function(value, total) {
		if (!this._started || this.video.ended || isNaN(value)) {
			return formatTimecode(total);
		} else if (!this.playbackRequested) {
			return Globals.PAUSE_CHAR;
		} else {
			return formatTimecode(total - value);
		}
	},

	/* ---------------------------
	/* whenVideoHasMetadata promise
	/* --------------------------- */

	whenVideoHasMetadata: function(view) {
		// NOTE: not pretty !!!
		return new Promise(function(resolve, reject) {
			var mediaEl = view.video;
			var eventHandlers = {
				loadedmetadata: function(ev) {
					if (ev) removeEventListeners();
					// console.log("%s::whenVideoHasMetadata [%s] %s", view.cid, "resolved", ev? ev.type : "sync");
					resolve(view);
				},
				abort: function(ev) {
					if (ev) removeEventListeners();
					reject(new PlayableRenderer.ViewError(view, new Error("whenVideoHasMetadata: view was removed")));
				},
				error: function(ev) {
					if (ev) removeEventListeners();
					var err;
					if (mediaEl.error) {
						err = new Error(_.invert(MediaError)[mediaEl.error.code]);
						err.infoCode = mediaEl.error.code;
					} else {
						err = new Error("Unspecified error");
					}
					err.infoSrc = mediaEl.src;
					err.logMessage = "whenVideoHasMetadata: " + err.name + " " + err.infoSrc;
					err.logEvent = ev;
					reject(err);
				},
			};
			//  (mediaEl.preload == "auto" && mediaEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA)
			// 	(mediaEl.preload == "metadata" && mediaEl.readyState >= HTMLMediaElement.HAVE_METADATA)
			if (mediaEl.error) {
				eventHandlers.error();
			} else if (mediaEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
				eventHandlers.loadedmetadata();
			} else {
				var sources = mediaEl.querySelectorAll("source");
				var errTarget = sources.length > 0 ? sources.item(sources.length - 1) : mediaEl;
				var errCapture = errTarget === mediaEl; // use capture with HTMLMediaElement

				var removeEventListeners = function() {
					errTarget.removeEventListener("error", eventHandlers.error, errCapture);
					for (var ev in eventHandlers) {
						if (ev !== "error" && eventHandlers.hasOwnProperty(ev)) {
							mediaEl.removeEventListener(ev, eventHandlers[ev], false);
						}
					}
				};
				errTarget.addEventListener("error", eventHandlers.error, errCapture);
				for (var ev in eventHandlers) {
					if (ev !== "error" && eventHandlers.hasOwnProperty(ev)) {
						mediaEl.addEventListener(ev, eventHandlers[ev], false);
					}
				}
				mediaEl.preload = "metadata";
			}
		});
	},

	findPlayableSource: function(video) {
		var playable = this.model.get("sources").find(function(source) {
			return /^video\//.test(source.get("mime")) && video.canPlayType(source.get("mime")) != "";
		});
		return playable ? playable.get("original") : "";
	},

	/* ---------------------------
	/* PlayableRenderer implementation
	/* --------------------------- */

	/** @override initial value */
	_playbackRequested: false,

	/** @override */
	_isMediaPaused: function() {
		return this.video.paused;
	},

	/** @override */
	_playMedia: function() {
		if (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && this.video.seekable.length == 0) {
			console.warn(this.cid, "WTF! got video data, but cannot seek, calling load()");
			// this._logMessage("call:load", "got video data, but cannot seek, calling load()", "orange");
			this.video.load();
			// this.video.currentTime = 0;
		} else if (this.video.ended) {
			this.video.currentTime = this.video.seekable.start(0);
		}
		this.video.play();
	},

	/** @override */
	_pauseMedia: function() {
		this.video.pause();
	},

	/* ---------------------------
	/* media events
	/* --------------------------- */

	// updatePlaybackEvents: "play playing waiting pause seeking seeked ended",
	// updateBufferedEvents: "progress canplay canplaythrough playing timeupdate",//loadeddata
	updatePlaybackEvents: "playing waiting pause",
	updateBufferedEvents: "progress canplay canplaythrough play playing",
	updatePlayedEvents: "timeupdate seeked",

	addMediaListeners: function() {
		if (!this._started) this.video.addEventListener("playing", this._onMediaPlayingOnce, false);
		this.addListener(this.video, this.updatePlaybackEvents, this._updatePlaybackState);
		this.addListener(this.video, this.updateBufferedEvents, this._updateBufferedValue);
		this.addListener(this.video, this.updatePlayedEvents, this._updatePlayedValue);
		this.video.addEventListener("ended", this._onMediaEnded, false);
		this.video.addEventListener("error", this._onMediaError, true);

		this.on("view:removed", this.removeMediaListeners, this);
	},

	removeMediaListeners: function() {
		this.off("view:removed", this.removeMediaListeners, this);

		if (!this._started) this.video.removeEventListener("playing", this._onMediaPlayingOnce, false);
		this.removeListener(this.video, this.updatePlaybackEvents, this._updatePlaybackState);
		this.removeListener(this.video, this.updateBufferedEvents, this._updateBufferedValue);
		this.removeListener(this.video, this.updatePlayedEvents, this._updatePlayedValue);
		this.video.removeEventListener("ended", this._onMediaEnded, false);
		this.video.removeEventListener("error", this._onMediaError, true);
	},

	/* ---------------------------
	/* media event handlers
	/* --------------------------- */

	_onMediaError: function(ev) {
		this.removeMediaListeners();
		this.removeSelectionListeners();

		this._onMediaEnded(ev);
		this.content.classList.remove("ended");
		this.content.classList.remove("waiting");
		this.content.classList.remove("started");
		this._started = false;

		this.mediaState = "error";
	},

	_onMediaPlayingOnce: function(ev) {
		this.video.removeEventListener("playing", this._onMediaPlayingOnce, false);
		if (!this._started) {
			this._started = true;
			this.content.classList.add("started");
		}
	},

	_onMediaEnded: function(ev) {
		this.playbackRequested = false;
		if (this.video.webkitDisplayingFullscreen) {
			this.video.webkitExitFullscreen();
		}
		if (document.fullscreenElement === this.video) {
			this.video.exitFullscreen();
		}
	},

	_updatePlaybackState: function(ev) {
		var classList = this.content.classList;
		if (this.playbackRequested) {
			switch (ev.type) {
				case "pause":
				case "playing":
					classList.remove("waiting");
					break;
				case "waiting":
					classList.add("waiting");
					break;
			}
		} else {
			classList.remove("waiting");
		}
		classList.toggle("ended", this.video.ended);

		this._updatePlayedValue(ev);
	},

	_updatePlayedValue: function(ev) {
		this._currentTimeValue = this.video.currentTime;
		if (this.progressMeter) {
			this.progressMeter.valueTo(this._currentTimeValue, 0, "amount");
		}
	},

	_updateBufferedValue: function(ev) {
		var bRanges = this.video.buffered;
		if (bRanges.length > 0) {
			this._bufferedValue = bRanges.end(bRanges.length - 1);
			if (this.progressMeter && ((this.video.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) || (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && this.video.networkState == HTMLMediaElement.NETWORK_LOADING))) {
				this.progressMeter.valueTo(this._bufferedValue, 300, "available");
				// this.progressMeter.valueTo(this._bufferedValue, Math.max(0, 1000 * (this._bufferedValue - (this.progressMeter.getValue("available") | 0))), "available");
			}
		}
	},

	/* ---------------------------
	/* fullscreen api
	/* --------------------------- */

	_onFullscreenToggle: function(ev) {
		// NOTE: Ignore if MouseEvent.button is 0 or undefined (0: left-button)
		if (!ev.defaultPrevented && !ev.button && this.model.selected) {
			// ev.preventDefault();
			try {
				if (document.hasOwnProperty("fullscreenElement") &&
					document.fullscreenElement !== this.video) {
					document.addEventListener(fullscreenChangeEvent, this._onFullscreenChange, false);
					this.video.requestFullscreen();
				} else
				if (this.video.webkitSupportsFullscreen && !this.video.webkitDisplayingFullscreen) {
					this.video.addEventListener("webkitbeginfullscreen", this._onFullscreenChange, false);
					this.video.webkitEnterFullScreen();
				}
			} catch (err) {
				this.video.controls = false;
				console.error(err);
			}
		}
	},

	_onFullscreenChange: function(ev) {
		switch (ev.type) {
			case fullscreenChangeEvent:
				// var isOwnFullscreen = Modernizr.prefixed("fullscreenElement", document) === this.video;
				var isOwnFullscreen = document.fullscreenElement === this.video;
				this.video.controls = isOwnFullscreen;
				if (!isOwnFullscreen) {
					document.removeEventListener(fullscreenChangeEvent, this._onFullscreenChange, false);
				}
				break;
			case "webkitbeginfullscreen":
				this.video.controls = true;
				this.video.removeEventListener("webkitbeginfullscreen", this._onFullscreenChange, false);
				this.video.addEventListener("webkitendfullscreen", this._onFullscreenChange, false);
				break;
			case "webkitendfullscreen":
				this.video.controls = false;
				this.video.removeEventListener("webkitendfullscreen", this._onFullscreenChange, false);
				break;
		}
	},

	/* ---------------------------
	/* event helpers
	/* --------------------------- */

	addListener: function(target, events, handler, useCapture) {
		(typeof events === "string") && (events = events.split(" "));
		for (var i = 0; i < events.length; i++) {
			target.addEventListener(events[i], handler, !!useCapture);
		}
	},

	removeListener: function(target, events, handler, useCapture) {
		(typeof events === "string") && (events = events.split(" "));
		for (var i = 0; i < events.length; i++) {
			target.removeEventListener(events[i], handler, !!useCapture);
		}
	},
});

/* ---------------------------
/* log to screen
/* --------------------------- */
if (DEBUG) {

	VideoRenderer = (function(VideoRenderer) {
		if (!VideoRenderer.LOG_TO_SCREEN) return VideoRenderer;

		/** @type {Function} */
		var Color = require("color");
		/** @type {module:underscore.strings/lpad} */
		var lpad = require("underscore.string/lpad");
		/** @type {module:underscore.strings/rpad} */
		var rpad = require("underscore.string/rpad");

		var fullscreenEvents = [
		fullscreenChangeEvent, fullscreenErrorEvent,
		"webkitbeginfullscreen", "webkitendfullscreen",
	];

		// var mediaEvents = [];
		var mediaEvents = _.without(require("utils/event/mediaEventsEnum"), "resize", "error");
		var updatePlaybackStateEvents = ["playing", "waiting", "ended", "pause", "seeking", "seeked"],
			updateBufferedEvents = ["progress", "durationchange", "canplay", "play"],
			updatePlayedEvents = ["playing", "timeupdate"];

		var readyStateSymbols = _.invert(_.pick(HTMLMediaElement,
			function(val, key, obj) {
				return /^HAVE_/.test(key);
			}));
		var readyStateToString = function(el) {
			return readyStateSymbols[el.readyState] + "(" + el.readyState + ")";
		};

		var networkStateSymbols = _.invert(_.pick(HTMLMediaElement,
			function(val, key, obj) {
				return /^NETWORK_/.test(key);
			}));
		var networkStateToString = function(el) {
			return networkStateSymbols[el.networkState] + "(" + el.networkState + ")";
		};

		var mediaErrorSymbols = _.invert(MediaError);
		var mediaErrorToString = function(el) {
			return el.error ? mediaErrorSymbols[el.error.code] + "(" + el.error.code + ")" : "[MediaError null]";
		};

		var findRangeIndex = function(range, currTime) {
			for (var i = 0, ii = range.length; i < ii; i++) {
				if (range.start(i) <= currTime && currTime <= range.end(i)) {
					return i;
				}
			}
			return -1;
		};

		var formatVideoError = function(video) {
			return [
			mediaErrorToString(video),
			networkStateToString(video),
			readyStateToString(video),
		].join(" ");
		};

		var formatVideoStats = function(video) {
			var currTime = video.currentTime,
				durTime = video.duration,
				bRanges = video.buffered,
				bRangeIdx,
				sRanges = video.seekable,
				sRangeIdx;

			bRangeIdx = findRangeIndex(bRanges, currTime);
			sRangeIdx = findRangeIndex(sRanges, currTime);
			return [
			"[t:" + lpad(currTime.toFixed(1), 5) +
				" " + lpad((!isNaN(durTime) ? durTime.toFixed(1) : "-"), 5) + "]",
			"[s:" + lpad((sRangeIdx >= 0 ? sRanges.end(sRangeIdx).toFixed(1) : "-"), 5) +
				" " + (sRangeIdx >= 0 ? sRangeIdx : "-") + "/" + sRanges.length + "]",
			"[b:" + lpad((bRangeIdx >= 0 ? bRanges.end(bRangeIdx).toFixed(1) : "-"), 5) +
				" " + (bRangeIdx >= 0 ? bRangeIdx : "-") + "/" + bRanges.length + "]",
			rpad(networkStateToString(video).substr(8), 12),
			rpad(readyStateToString(video).substr(5), 15),
				(video.ended ? ">:" : (video.paused ? "::" : ">>")),
		].join(" ");
		};

		return VideoRenderer.extend({

			/** @override */
			initialize: function() {
				VideoRenderer.prototype.initialize.apply(this, arguments);

				_.bindAll(this, "__handleMediaEvent");

				var fgColor = this.model.attr("color"),
					red = new Color("red"),
					blue = new Color("blue"),
					green = new Color("green");

				for (var i = 0; i < mediaEvents.length; i++) {
					var ev = mediaEvents[i];
					this.video.addEventListener(ev, this.__handleMediaEvent, false);

					var c = new Color(fgColor),
						cc = 1;
					if (updateBufferedEvents.indexOf(ev) != -1) c.mix(green, (cc /= 2));
					if (updatePlayedEvents.indexOf(ev) != -1) c.mix(blue, (cc /= 2));
					if (updatePlaybackStateEvents.indexOf(ev) != -1) c.mix(red, (cc /= 2));
					this.__logColors[ev] = c.rgbString();
				}
				this.video.addEventListener("error", this.__handleMediaEvent, true);
			},

			/** @override */
			remove: function() {
				VideoRenderer.prototype.remove.apply(this, arguments);
				for (var i = 0; i < mediaEvents.length; i++) {
					if (mediaEvents[i] == "error") continue;
					this.video.removeEventListener(mediaEvents[i], this.__handleMediaEvent, false);
				}
				this.video.removeEventListener("error", this.__handleMediaEvent, true);
			},

			/** @override */
			_onVisibilityChange: function(ev) {
				VideoRenderer.prototype._onVisibilityChange.apply(this, arguments);
				var stateVal = Modernizr.prefixed("visibilityState", document);
				this.__logEvent("visibilityState:" + stateVal, ev.type + ":" + stateVal);
			},

			/** @override */
			_onFullscreenChange: function(ev) {
				VideoRenderer.prototype._onFullscreenChange.apply(this, arguments);
				var logtype = (document.fullscreenElement === this.video ? "enter:" : "exit:") + ev.type;
				this.__logEvent("document.fullscreenElement: " + this.cid, logtype);
			},

			/** @override */
			_onFullscreenToggle: function(ev) {
				VideoRenderer.prototype._onFullscreenToggle.apply(this, arguments);
				if (!ev.defaultPrevented && this.model.selected) {
					this.__logEvent("fullscreen-toggle", ev.type);
				}
			},

			__handleMediaEvent: function(ev) {
				var evmsg, errmsg;
				// evmsg = formatVideoStats(this.video) + " " + rpad(this._lastPlaybackStates || "-", 9);
				evmsg = formatVideoStats(this.video);
				if (this.playbackRequested === true) {
					evmsg += " (>>)";
				} else if (this.playbackRequested === false) {
					evmsg += " (::)";
				} else {
					evmsg += " (--)";
				}
				this.__logEvent(evmsg, ev.type);
				if (ev.type === "error" || ev.type === "abort") {
					this.__logMessage(formatVideoError(this.video), ev.type);
				}
			},

			__logEvent: function(msg, logtype, color) {
				var logEntryEl = this.__logElement.lastElementChild;
				if ((logEntryEl && logEntryEl.getAttribute("data-logtype") == logtype) &&
					(logtype === "timeupdate")) {
					var logRepeatVal = parseInt(logEntryEl.getAttribute("data-logrepeat"));
					logEntryEl.textContent = this.__getTStamp() + " " + msg;
					logEntryEl.setAttribute("data-logrepeat", isNaN(logRepeatVal) ? 2 : ++logRepeatVal);
				} else {
					this.__logMessage(msg, logtype, color);
				}
			},
		});
	})(VideoRenderer);

}

module.exports = VideoRenderer;

},{"./VideoRenderer.hbs":95,"app/control/Globals":41,"app/view/component/ProgressMeter":71,"app/view/render/PlayableRenderer":92,"color":"color","underscore":"underscore","underscore.string/lpad":35,"underscore.string/rpad":37,"utils/event/mediaEventsEnum":109,"utils/prefixedEvent":111}],97:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<div id=\"desc_b"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"content sizing\">"
    + ((stack1 = ((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],98:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<div id=\"desc_m"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"content sizing\"><p>"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p></div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],99:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "			<option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "	<li class=\""
    + ((stack1 = helpers["if"].call(alias1,depth0,{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "passed";
},"6":function(container,depth0,helpers,partials,data) {
    return "failed";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression;

  return "<dl class=\"debug-links\">\n	<dt id=\"links-toggle\">\n		<svg class=\"icon\" viewBox=\"-100 -100 200 200\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid meet\">\n			<path id=\"cog\" d=\"M11.754,-99.307c-7.809,-0.924 -15.699,-0.924 -23.508,0l-3.73,20.82c-6.254,1.234 -12.338,3.21 -18.123,5.888l-15.255,-14.651c-6.861,3.842 -13.244,8.48 -19.018,13.818l9.22,19.036c-4.335,4.674 -8.095,9.849 -11.201,15.416l-20.953,-2.886c-3.292,7.141 -5.731,14.645 -7.265,22.357l18.648,9.981c-0.759,6.329 -0.759,12.727 0,19.056l-18.648,9.981c1.534,7.712 3.973,15.216 7.265,22.357l20.953,-2.886c3.106,5.567 6.866,10.742 11.201,15.416l-9.22,19.036c5.774,5.338 12.157,9.976 19.018,13.818l15.255,-14.651c5.785,2.678 11.869,4.654 18.123,5.888l3.73,20.82c7.809,0.924 15.699,0.924 23.508,0l3.73,-20.82c6.254,-1.234 12.338,-3.21 18.123,-5.888l15.255,14.651c6.861,-3.842 13.244,-8.48 19.018,-13.818l-9.22,-19.036c4.335,-4.674 8.095,-9.849 11.201,-15.416l20.953,2.886c3.292,-7.141 5.731,-14.645 7.265,-22.357l-18.648,-9.981c0.759,-6.329 0.759,-12.727 0,-19.056l18.648,-9.981c-1.534,-7.712 -3.973,-15.216 -7.265,-22.357l-20.953,2.886c-3.106,-5.567 -6.866,-10.742 -11.201,-15.416l9.22,-19.036c-5.774,-5.338 -12.157,-9.976 -19.018,-13.818l-15.255,14.651c-5.785,-2.678 -11.869,-4.654 -18.123,-5.888l-3.73,-20.82ZM0,-33c18.213,0 33,14.787 33,33c0,18.213 -14.787,33 -33,33c-18.213,0 -33,-14.787 -33,-33c0,-18.213 14.787,-33 33,-33Z\" style=\"fill:currentColor;fill-rule:evenodd;\"/>\n		</svg>\n	</dt>\n	<dt id=\"app-state\">\n		<span class=\"color-fg color-bg\" data-prop=\"withBundle\">b</span>\n		<span class=\"color-fg color-bg\" data-prop=\"withMedia\">m</span>\n		<span class=\"color-fg color-bg\" data-prop=\"collapsed\">c</span>\n	</dt>\n	<dd id=\"select-layout\">\n		<select size=1>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.layouts : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</select>\n	</dd>\n	<dd id=\"edit-backend\">\n		<a href=\""
    + alias2((helpers.global || (depth0 && depth0.global) || helpers.helperMissing).call(alias1,"APP_ROOT",{"name":"global","hash":{},"data":data}))
    + "symphony/\" target=\"_blank\">CMS</a>\n	</dd>\n	<dd id=\"toggle-tests\">\n		<a href=\"#toggle-tests\" class=\"color-fg color-bg\">Tests</a>\n	</dd>\n	<dd id=\"toggle-grid-bg\">\n		<a href=\"#toggle-grid-bg\" class=\"color-fg color-bg\">Grid</a>\n	</dd>\n	<dd id=\"toggle-blocks\">\n		<a href=\"#toggle-blocks\" class=\"color-fg color-bg\">Blocks</a>\n	</dd>\n	<dd id=\"toggle-tx\">\n		<a href=\"#toggle-blocks\" class=\"color-fg color-bg\">TX/FX</a>\n	</dd>\n	<dd id=\"toggle-logs\">\n		<a href=\"#toggle-logs\" class=\"color-fg color-bg\">Logs</a>\n	</dd>\n	<dd id=\"media-info\">\n		<span></span>\n	</dd>\n	<dd id=\"viewport-info\">\n		<span></span>\n	</dd>\n</dl>\n<div id=\"test-results\">\n<h6>Tests <a id=\"toggle-passed\" href=\"#toggle-passed\">Passed</a></h6>\n<p>"
    + alias2(container.lambda(((stack1 = (depth0 != null ? depth0.navigator : depth0)) != null ? stack1.userAgent : stack1), depth0))
    + "</p>\n<ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.tests : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],100:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p><code>"
    + container.escapeExpression(((helper = (helper = helpers.infoSrc || (depth0 != null ? depth0.infoSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"infoSrc","hash":{},"data":data}) : helper)))
    + "</code></p>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"error-message color-fg\">\n	<p><strong>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</strong> <code>"
    + alias4(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper)))
    + "</code></p>\n	"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.infoSrc : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":25}],101:[function(require,module,exports){
// var Handlebars = require("handlebars")["default"];
var Handlebars = require("hbsfy/runtime");
/** @type {Function} */
var Color = require("color");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

// (function() {
var helpers = {
	/*
	/* Arithmetic helpers
	/*/
	add: function(value, addition) {
		return value + addition;
	},
	subtract: function(value, substraction) {
		return value - substraction;
	},
	divide: function(value, divisor) {
		return value / divisor;
	},
	multiply: function(value, multiplier) {
		return value * multiplier;
	},
	floor: function(value) {
		return Math.floor(value);
	},
	ceil: function(value) {
		return Math.ceil(value);
	},
	round: function(value) {
		return Math.round(value);
	},
	global: function(value) {
		return Globals[value];
	},

	/*
	/* Flow control helpers
	/*/
	is: function(a, b, opts) {
		return (a === b) ? opts.fn(this) : opts.inverse(this);
	},
	isnot: function(a, b, opts) {
		return (a !== b) ? opts.fn(this) : opts.inverse(this);
	},
	isany: function(value) {
		var i = 0,
			ii = arguments.length - 2,
			opts = arguments[ii + 1];
		do
			if (value === arguments[++i]) {
				return opts.fn(this);
			}
		while (i < ii);
		return opts.inverse(this);
	},
	contains: function(a, b, opts) {
		return (a.indexOf(b) !== -1) ? opts.fn(this) : opts.inverse(this);
	},
	ignore: function() {
		return "";
	},

	/*
	/* Color helpers
	/*/
	mix: function(colora, colorb, amount) {
		return new Color(colora).mix(new Color(colorb), amount).rgbString();
	},
	lighten: function(color, amount) {
		return new Color(color).lighten(amount).rgbString();
	},
	darken: function(color, amount) {
		return new Color(color).darken(amount).rgbString();
	},
	// colorFormat: function(color, fmt) {
	// 	switch (fmt) {
	// 		case "rgb":
	// 			return new Color(color).rgbString();
	// 		case "hsl":
	// 			return new Color(color).hslString();
	// 		case "hex": default:
	// 			return new Color(color).hexString();
	// 	}
	// },
};
for (var helper in helpers) {
	if (helpers.hasOwnProperty(helper)) {
		Handlebars.registerHelper(helper, helpers[helper]);
	}
}
// })();

// module.exports = Handlebars;

},{"app/control/Globals":41,"color":"color","hbsfy/runtime":25}],102:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Events = require("backbone").Events;


// var defaultOptions = {
// 	tick: 1,
// 	onstart: null,
// 	ontick: null,
// 	onpause: null,
// 	onstop: null,
// 	onend: null
// }
var idSeed = 0;

var Timer = function(options) {
	// if (!(this instanceof Timer)) {
	// 	return new Timer(options);
	// }
	this._id = idSeed++;
	// this._options = {};
	this._duration = 0;
	this._status = "initialized";
	this._start = 0;
	// this._measures = [];

	// for (var prop in defaultOptions) {
	// 	this._options[prop] = defaultOptions[prop];
	// }
	// this.options(options);
};

_.extend(Timer.prototype, Events, {

	start: function(duration) {
		if (!_.isNumber(duration) && !this._duration) {
			return this;
		}
		// duration && (duration *= 1000)
		if (this._timeout && this._status === "started") {
			return this;
		}
		var evName = (this._status === "stopped") ? "start" : "resume";
		this._duration = duration || this._duration;
		this._timeout = window.setTimeout(end.bind(this), this._duration);
		// if (typeof this._options.ontick === "function") {
		// 	this._interval = setInterval(function() {
		// 		this.trigger("tick", this.getDuration())
		// 	}.bind(this), +this._options.tick * 1000)
		// }
		this._start = _now();
		this._status = "started";
		this.trigger(evName, this.getDuration());
		return this;
	},

	pause: function() {
		if (this._status !== "started") {
			return this;
		}
		this._duration -= (_now() - this._start);
		clear.call(this, false);
		this._status = "paused";
		this.trigger("pause", this.getDuration());
		return this;
	},

	stop: function() {
		if (!/started|paused/.test(this._status)) {
			return this;
		}
		clear.call(this, true);
		this._status = "stopped";
		this.trigger("stop");
		return this;
	},

	getDuration: function() {
		if (this._status === "started") {
			return this._duration - (_now() - this._start);
		}
		if (this._status === "paused") {
			return this._duration;
		}
		return 0;
	},

	getStatus: function() {
		return this._status;
	},
});

var _now = window.performance ?
	window.performance.now.bind(window.performance) :
	Date.now.bind(Date);

function end() {
	clear.call(this);
	this._status = "stopped";
	this.trigger("end");
}

function clear(clearDuration) {
	window.clearTimeout(this._timeout);
	// window.clearInterval(this._interval);
	if (clearDuration === true) {
		this._duration = 0;
	}
}

Object.defineProperties(Timer.prototype, {
	duration: {
		enumerable: true,
		get: function() {
			return this.getDuration();
		}
	},
	status: {
		enumerable: true,
		get: function() {
			return this.getStatus();
		}
	}
});

Object.defineProperties(Timer, {
	STOPPED: {
		enumerable: true,
		value: "stopped"
	},
	STARTED: {
		enumerable: true,
		value: "started"
	},
	PAUSED: {
		enumerable: true,
		value: "paused"
	},
});

module.exports = Timer;

},{"backbone":"backbone","underscore":"underscore"}],103:[function(require,module,exports){
/* -------------------------------
/* Imports
/* ------------------------------- */


/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:utils/TransformItem} */
var TransformItem = require("./TransformItem");

var idSeed = 0;
var cidSeed = 100;
var slice = Array.prototype.slice;

/**
 * @constructor
 * @type {module:app/helper/TransformHelper}
 */
function TransformHelper() {
	this.id = idSeed++;
	this._items = [];
	this._itemsById = {};
}

TransformHelper.prototype = Object.create({

	/* -------------------------------
	/* Private
	/* ------------------------------- */

	_get: function(el) {
		if (this.has(el)) {
			return this._itemsById[el.eid];
		} else {
			return this._add(el);
		}
	},

	_add: function(el) {
		var item, id;
		// id = el.eid || el.cid || el.id;
		// if (!id || (this._itemsById[id] && (this._itemsById[id].el !== el))) {
		// 	id = "elt" + cidSeed++;
		// }
		// if (!el.eid) {
		// 	id = el.eid || el.cid || ("elt" + cidSeed++);
		// }
		id = el.eid || el.cid || ("elt" + cidSeed++);
		item = new TransformItem(el, id);
		this._itemsById[id] = item;
		this._items.push(item);
		return item;
	},

	_remove: function(el) {
		if (this.has(el)) {
			var o = this._itemsById[el.eid];
			this._items.splice(this._items.indexOf(o), 1);
			o.destroy();
			delete this._itemsById[el.eid];
		}
	},

	_invoke: function(funcName, args, startIndex) {
		var i, ii, j, jj, el, o, rr;
		var funcArgs = null;
		if (startIndex !== void 0) {
			funcArgs = slice.call(args, 0, startIndex);
		} else {
			startIndex = 0;
		}
		for (i = startIndex, ii = args.length, rr = []; i < ii; ++i) {
			el = args[i];
			// iterate on NodeList, Arguments, Array...
			if (el.length) {
				for (j = 0, jj = el.length; j < jj; ++j) {
					o = this._get(el[j]);
					rr.push(o[funcName].apply(o, funcArgs));
				}
			} else {
				o = this._get(el);
				rr.push(o[funcName].apply(o, funcArgs));
			}
		}
		return rr;
	},

	/* -------------------------------
	/* Public
	/* ------------------------------- */

	has: function(el) {
		return el.eid && this._itemsById[el.eid] !== void 0;
	},

	getItems: function() {
		var i, j, el, ret = [];
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					ret.push(this._get(el[j]));
				}
			} else {
				ret.push(this._get(el));
			}
		}
		return ret;
	},

	get: function(el) {
		return this._get(el);
	},

	add: function() {
		var i, j, el;
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					this._get(el[j]);
				}
			} else {
				this._get(el);
			}
		}
	},

	remove: function() {
		var i, j, el;
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					this._remove(el[j]);
				}
			} else {
				this._remove(el);
			}
		}
	},

	/* --------------------------------
	/* public
	/* -------------------------------- */

	/* public: single arg
	/* - - - - - - - - - - - - - - - - */

	hasOffset: function(el) {
		return this.has(el) ? this._itemsById[el.eid].hasOffset : (void 0);
	},

	/* public: capture
	/* - - - - - - - - - - - - - - - - */

	capture: function() {
		this._invoke("capture", arguments);
	},
	captureAll: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].capture();
		}
	},

	clearCapture: function() {
		this._invoke("clearCapture", arguments);
	},
	clearAllCaptures: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearCapture();
		}
	},

	/* public: offset
	/* - - - - - - - - - - - - - - - - */
	offset: function(x, y) {
		this._invoke("offset", arguments, 2);
	},
	offsetAll: function(x, y) {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].offset(x, y);
		}
	},

	clearOffset: function() {
		this._invoke("clearOffset", arguments);
	},
	clearAllOffsets: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearOffset();
		}
	},

	/* public: transitions
	/* - - - - - - - - - - - - - - - - */

	runTransition: function(transition) {
		this._invoke("runTransition", arguments, 1);
	},
	runAllTransitions: function(transition) {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].runTransition(transition);
		}
	},

	clearTransition: function() {
		this._invoke("clearTransition", arguments);
	},
	clearAllTransitions: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearTransition();
		}
	},

	stopTransition: function() {
		this._invoke("stopTransition", arguments);
	},
	stopAllTransitions: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].stopTransition();
		}
	},

	whenTransitionEnds: function() {
		var res = this._invoke("whenTransitionEnds", arguments);
		return res.length != 0 ?
			Promise.all(res) :
			Promise.resolve(null);
	},
	whenAllTransitionsEnd: function() {
		return (this._items.length != 0) ? Promise.all(this._items.map(function(o) {
			return o.whenTransitionEnds();
		})) : Promise.resolve(null);
	},

	promise: function() {
		return arguments.length == 0 ?
			this.whenAllTransitionsEnd() :
			this.whenTransitionEnds.call(this, arguments);
	},

	/* -------------------------------
	/* validation
	/* ------------------------------- */

	validate: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].validate();
		}
	},
}, {
	items: {
		get: function() {
			return this._items;
		}
	}
});

module.exports = TransformHelper;

},{"./TransformItem":104,"underscore":"underscore"}],104:[function(require,module,exports){
/* -------------------------------
 * Imports
 * ------------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/prefixedStyleName} */
var prefixedStyleName = require("utils/prefixedStyleName");
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

/** @type {String} */
var transitionEnd = prefixedEvent("transitionend"); //require("utils/event/transitionEnd");
/** @type {Function} */
var slice = Array.prototype.slice;

// /** @type {module:utils/debug/traceElement} */
// var traceElt = require("./debug/traceElement");
// var traceEltCache = {};
// var log = function() {
// 	var logFn = "log";
// 	var args = slice.apply(arguments);
// 	switch(args[0]) {
// 		case "error":
// 		case "warn":
// 		case "info":
// 			logFn = args.shift();
// 			break;
// 		default:
// 			// break;
// 			return;
// 	}
// 	var el, txId;
// 	if ((el = args[0]) && (txId = el.eid)) {
// 		args[0] = traceEltCache[txId] || (traceEltCache[txId] = el);
// 	}
// 	args[0] = "\t" + args[0];
// 	console[logFn].apply(console, args);
// };

/* jshint -W079 */
// var console = (function(target) {
// 	return Object.getOwnPropertyNames(target).reduce(function(proxy, prop) {
// 		if ((typeof target[prop]) == "function") {
// 			switch (prop) {
// 				case "error":
// 				case "warn":
// 				case "info":
// 					proxy[prop] = function () {
// 						var args = slice.apply(arguments);
// 						if (typeof args[0] == "string") {
// 							args[0] = prop + "::" + args[0];
// 						}
// 						return target[prop].apply(target, args);
// 					};
// 					break;
// 				case "log":
// 					proxy[prop] = function() {};
// 					break;
// 				default:
// 					proxy[prop] = target[prop].bind(target);
// 					break;
// 			}
// 		} else {
// 			Object.defineProperty(proxy, prop, {
// 				get: function() { return target[prop]; },
// 				set: function(val) { target[prop] = val; }
// 			});
// 		}
// 		return proxy;
// 	}, {});
// })(window.console);
/* jshint +W079 */

/* -------------------------------
/* Private static
/* ------------------------------- */

var NO_TRANSITION = "none 0s step-start 0s";

var translateTemplate = function(o) {
	// return "translate(" + o._renderedX + "px, " + o._renderedY + "px)";
	return "translate3d(" + o._renderedX + "px, " + o._renderedY + "px, 0px)";
};
var transitionTemplate = function(o) {
	return o.property + " " + o.duration / 1000 + "s " + o.easing + " " + o.delay / 1000 + "s";
};

var UNSET_TRANSITION = {
	name: "unset",
	className: "tx-unset",
	property: "none",
	easing: "ease",
	delay: 0,
	duration: 0,
	cssText: "unset",
};

// var transitionTemplate = _.template("<%= property %> <% duration/1000 %>s <%= easing %> <% delay/1000 %>s");
// var NO_TRANSITION = "all 0.001s step-start 0.001s";

var propDefaults = {
	"opacity": "1",
	"visibility": "visible",
	"transform": "matrix(1, 0, 0, 1, 0, 0)",
	"transformStyle": "",
	"transition": "",
	// "willChange": "",
	// "transitionDuration": "0s",
	// "transitionDelay": "0s",
	// "transitionProperty": "none",
	// "transitionTimingFunction": "ease"
};
var propKeys = Object.keys(propDefaults);
var propNames = propKeys.reduce(function(obj, propName) {
	obj[propName] = prefixedProperty(propName);
	return obj;
}, {});

/** @type {module:utils/strings/camelToDashed} */
var camelToDashed = require("utils/strings/camelToDashed");
var styleNames = propKeys.map(camelToDashed).reduce(function(obj, propName) {
	obj[propName] = prefixedStyleName(propName);
	return obj;
}, {});

var resolveAll = function(pp, result) {
	if (pp.length != 0) {
		pp.forEach(function(p, i, a) {
			p.resolve(result);
			a[i] = null;
		});
		pp.length = 0;
	}
	return pp;
};

var rejectAll = function(pp, reason) {
	if (pp.length != 0) {
		pp.forEach(function(p, i, a) {
			p.reject(reason);
			a[i] = null;
		});
		pp.length = 0;
	}
	return pp;
};

/* -------------------------------
 * TransformItem
 * ------------------------------- */

/**
 * @constructor
 */
function TransformItem(el, id) {
	_.bindAll(this, "_onTransitionEnd");

	this.el = el;
	this.id = id;
	this.el.eid = id;
	this.el.addEventListener(transitionEnd, this._onTransitionEnd, false);

	this._captureInvalid = false;
	this._capturedChanged = false;
	this._capturedX = null;
	this._capturedY = null;
	this._currCapture = {};
	this._lastCapture = {};

	this._hasOffset = false;
	this._offsetInvalid = false;
	this._offsetX = null;
	this._offsetY = null;

	this._renderedX = null;
	this._renderedY = null;

	this._hasTransition = false;
	this._transitionInvalid = false;
	this._transitionRunning = false;
	this._transition = _.extend({}, UNSET_TRANSITION); //{};

	this._promises = [];
	this._pendingPromises = [];
}

var TransformItemProps = {
	transition: {
		get: function() {
			return this._transition;
		}
	},

	capturedChanged: {
		get: function() {
			return this._capturedChanged;
		}
	},
	capturedX: {
		get: function() {
			return this._capturedX;
		}
	},
	capturedY: {
		get: function() {
			return this._capturedY;
		}
	},

	hasOffset: {
		get: function() {
			return this._hasOffset;
		}
	},
	offsetX: {
		get: function() {
			return this._offsetX;
		}
	},
	offsetY: {
		get: function() {
			return this._offsetY;
		}
	},
};

var TransformItemProto = {

	/* -------------------------------
	/* Public
	/* ------------------------------- */

	/* destroy
	/* - - - - - - - - - - - - - - - - */
	destroy: function() {
		// NOTE: style property may have been modified; clearOffset(element) should
		// be called explicitly if clean up is required.
		this.el.removeEventListener(transitionEnd, this._onTransitionEnd, false);
		rejectAll(this._pendingPromises, this.el);
		rejectAll(this._promises, this.el);
		// delete this.el.eid;
	},

	/* capture
	/* - - - - - - - - - - - - - - - - */
	capture: function() {
		// console.log("tx[%s]::capture", this.id);
		this._validateCapture();
		return this;
	},

	clearCapture: function() {
		// console.log("tx[%s]::clearCapture", this.id);
		// this._hasOffset = false;
		this._captureInvalid = true;
		return this;
	},

	/* offset/clear
	/* - - - - - - - - - - - - - - - - */
	offset: function(x, y) {
		// console.log("tx[%s]::offset", this.id);

		this._hasOffset = true;
		this._offsetInvalid = true;
		this._offsetX = x || 0;
		this._offsetY = y || 0;
		// if (this.immediate) this._validateOffset();
		return this;
	},

	clearOffset: function() {
		if (this._hasOffset) {
			// console.log("tx[%s]::clearOffset", this.id);

			this._hasOffset = false;
			this._offsetInvalid = true;
			this._offsetX = null;
			this._offsetY = null;
			// if (this.immediate) this._validateOffset();
		} else {
			// console.log("tx[%s]::clearOffset no offset to clear", this.id);
		}
		return this;
	},

	/* transitions
	/* - - - - - - - - - - - - - - - - */
	runTransition: function(transition) {
		if (!transition) { // || (transition.duration + transition.delay) == 0) {
			return this.clearTransition();
		}
		var lastValue = this._transitionValue;
		var lastName = this._transition.name;
		this._transition.property = styleNames["transform"];
		this._transition = _.extend(this._transition, transition);
		this._transitionValue = transitionTemplate(this._transition);

		if (this._transitionInvalid) {
			console.warn("tx[%s]::runTransition set over (%s:'%s' => %s:'%s')", this.id,
				lastName, lastValue, this._transition.name, this._transitionValue);
		}

		this._hasTransition = true;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	clearTransition: function() {
		this._transition = _.extend(this._transition, UNSET_TRANSITION);
		this._transitionValue = NO_TRANSITION;

		this._hasTransition = false;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	stopTransition: function() {
		// this._transition.name = "[none]";
		// this._transition.property = "none";
		this._transition = _.extend(this._transition, UNSET_TRANSITION);
		this._transitionValue = NO_TRANSITION;

		this._hasTransition = false;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	whenTransitionEnds: function() {
		var d, p, pp;
		if (this._transitionInvalid || this._transitionRunning) {
			d = {};
			p = new Promise(function(resolve, reject) {
				d.resolve = resolve;
				d.reject = reject;
			});
			pp = this._transitionInvalid ? this._pendingPromises : this._promises;
			pp.push(d);
		} else {
			p = Promise.resolve(this.el);
		}
		return p;
	},

	/* validation
	/* - - - - - - - - - - - - - - - - */
	validate: function() {
		// this.el.removeEventListener(transitionEnd, this._onTransitionEnd, false);
		this._ignoreEvent = true;

		if (this._captureInvalid) {
			var lastX = (this._renderedX !== null ? this._renderedX : this._capturedX),
				lastY = (this._renderedY !== null ? this._renderedY : this._capturedY);

			// this._validateTransition();
			this._validateCapture();
			this._validateOffset();

			var currX = (this._renderedX !== null ? this._renderedX : this._capturedX),
				currY = (this._renderedY !== null ? this._renderedY : this._capturedY);

			if (lastX === currX && lastY === currY) {
				this._hasTransition && console.info("tx[%s]::validate unchanged: last:[%i,%i] curr:[%i,%i]", this.el.id || this.id, lastX, lastY, currX, currY);
				// console.info("tx[%s]::validate unchanged: last:[%f,%f] curr:[%f,%f] render:[%f,%f] captured[%f,%f]", this.el.id || this.id, lastX, lastY, currX, currY, this._renderedX, this._renderedY, this._capturedX, this._capturedY);
				this.clearTransition();
				// this._validateTransition();
			}
			this._validateTransition();
		} else {
			// this._validateCapture();
			this._validateTransition();
			this._validateOffset();
		}

		// this.el.addEventListener(transitionEnd, this._onTransitionEnd, false);
		this._ignoreEvent = false;

		// if (this._capturedChanged) {
		// 	console.error("tx[%s]::validate capture changed: [%f,%f]", this.id, this._capturedX, this._capturedY);
		// }
		this._capturedChanged = false;
		return this;
	},

	/* -------------------------------
	/* Private
	/* ------------------------------- */

	_validateCapture: function() {
		if (!this._captureInvalid) {
			return;
		}
		var computed, capturedValues;
		var transformValue = null;

		if (this._hasOffset && !this._offsetInvalid) {
			// this is an explicit call to capture() instead of a subcall from _validateOffset()
			transformValue = this._getCSSProp("transform");
			if (transformValue === "") {
				console.error("tx[%s]::_capture valid offset (%i,$i) but transformValue=\"\"", this.id, this._offsetX, this._offsetY);
			}
			this._removeCSSProp("transform");
		}

		// NOTE: reusing object, all props will be overwritten
		this._lastCapture = this._currCapture;
		this._currCapture = this._getComputedCSSProps();

		if (this._currCapture.transform !== this._lastCapture.transform) {
			var m, mm, ret = {};
			mm = this._currCapture.transform.match(/(matrix|matrix3d)\(([^\)]+)\)/);
			if (mm) {
				m = mm[2].split(",");
				if (mm[1] === "matrix") {
					this._capturedX = parseFloat(m[4]);
					this._capturedY = parseFloat(m[5]);
				} else {
					this._capturedX = parseFloat(m[12]);
					this._capturedY = parseFloat(m[13]);
				}
			} else {
				this._capturedX = 0;
				this._capturedY = 0;
			}
			this._capturedChanged = true;
		}
		if (transformValue !== null) {
			console.log("tx[%s]::_capture reapplying '%s'", this.id, transformValue);
			this._setCSSProp("transform", transformValue);
		}
		this._captureInvalid = false;
	},

	_validateOffset: function() {
		if (this._offsetInvalid) {
			// this._validateCapture();
			this._offsetInvalid = false;
			if (this._hasOffset) {
				var tx = this._offsetX + this._capturedX;
				var ty = this._offsetY + this._capturedY;
				if (tx !== this._renderedX || ty !== this._renderedY) {
					this._renderedX = tx;
					this._renderedY = ty;
					this._setCSSProp("transform", translateTemplate(this));
				}
			} else {
				this._renderedX = null;
				this._renderedY = null;
				this._removeCSSProp("transform");
			}
		}
	},

	_validateTransition: function() {
		if (this._transitionInvalid) {
			// this._validateCapture();
			this._transitionInvalid = false;

			// save promises made while invalid
			var reject = this._promises;
			// prepare _promises and push in new ones
			this._promises = this._pendingPromises;
			// whatever still here is to be rejected. reuse array
			this._pendingPromises = rejectAll(reject, this.el);

			this._transitionRunning = this._hasTransition;
			this._setCSSProp("transition", this._transitionValue);

			if (!this._hasTransition) {
				// no transition, resolve now
				resolveAll(this._promises, this.el);
			}
		}
	},

	_onTransitionEnd: function(ev) {
		if (this._ignoreEvent) {
			return;
		}
		if (this._transitionRunning && (this.el === ev.target) &&
			(this._transition.property == ev.propertyName)) {
			this._transitionRunning = false;
			this._removeCSSProp("transition");
			resolveAll(this._promises, this.el);
		}
	},

	/* -------------------------------
	/* CSS
	/* ------------------------------- */

	_getCSSProp: function(prop) {
		return this.el.style[propNames[prop]];
		// return this.el.style[prefixedProperty(prop)];
		// return this.el.style.getPropertyValue(styleNames[prop]);
	},

	_setCSSProp: function(prop, value) {
		if (prop === "transition" && value == NO_TRANSITION) {
			value = "";
		}
		if (value === null || value === void 0 || value === "") {
			this._removeCSSProp(prop);
		} else {
			this.el.style[propNames[prop]] = value;
			// this.el.style.setProperty(styleNames[prop], value);
		}
	},

	_removeCSSProp: function(prop) {
		this.el.style[propNames[prop]] = "";
		// this.el.style.removeProperty(styleNames[prop]);
	},

	_getComputedCSSProps: function() {
		var values = {};
		var computed = window.getComputedStyle(this.el);
		for (var p in propNames) {
			values[p] = computed[propNames[p]];
		}
		return values;
	},
};

TransformItem.prototype = Object.create(TransformItemProto, TransformItemProps);

delete TransformItemProto;
delete TransformItemProps;

module.exports = TransformItem;

},{"underscore":"underscore","utils/prefixedEvent":111,"utils/prefixedProperty":112,"utils/prefixedStyleName":113,"utils/strings/camelToDashed":116}],105:[function(require,module,exports){
var PI2 = Math.PI * 2;

var setStyle = function(ctx, s) {
	if (typeof s != "object") return;
	for (var p in s) {
		switch (typeof ctx[p]) {
			case "undefined":
				break;
			case "function":
				if (Array.isArray(s[p])) ctx[p].apply(ctx, s[p]);
				else ctx[p].call(ctx, s[p]);
				break;
			default:
				ctx[p] = s[p];
		}
	}
};

module.exports = {
	setStyle: setStyle,

	vGuide: function(ctx, x, s) {
		ctx.save();
		if (s) setStyle(ctx, s);
		ctx.beginPath();
		ctx.moveTo(x, ctx.canvas.offsetTop);
		ctx.lineTo(x, ctx.canvas.offsetHeight);
		ctx.stroke();
		ctx.restore();
	},

	crosshair: function(ctx, x, y, r, s) {
		ctx.save();
		if (s) {
			setStyle(ctx, s);
		}
		// if (s && s.style != "vertical") {
		ctx.translate(x, y);
		ctx.rotate(Math.PI / 4);
		// }
		ctx.beginPath();
		ctx.moveTo(0, -r);
		ctx.lineTo(0, r);
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
		ctx.stroke();
		ctx.restore();
	},

	circle: function(ctx, x, y, r, solid, s) {
		ctx.save();
		if (s) setStyle(ctx, s);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, PI2);
		ctx.closePath();
		if (solid) ctx.fill();
		else ctx.stroke();
		ctx.restore();
	},

	square: function(ctx, x, y, r, solid, s) {
		r = Math.floor(r / 2) * 2;
		if (solid) r += 0.5;
		ctx.save();
		if (s) setStyle(ctx, s);
		ctx.beginPath();
		ctx.rect(x - r, y - r, r * 2, r * 2);
		if (solid) ctx.fill();
		else ctx.stroke();
		ctx.restore();
	},

	arrowhead: function(ctx, x, y, r, a, solid, s) {
		ctx.save();
		if (s) {
			setStyle(ctx, s);
		}
		if (r < 10) {
			ctx.setLineDash([]);
		}
		ctx.translate(x, y);
		ctx.rotate(a); // - Math.PI * 0.5);
		ctx.translate(r * 0.5, 0);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		// ctx.lineTo(-r, r * Math.SQRT1_2);
		// ctx.lineTo(-r, -r * Math.SQRT1_2);
		ctx.lineTo(-r * Math.SQRT2, r * Math.SQRT1_2);
		ctx.arcTo(0, 0, -r * Math.SQRT2, -r * Math.SQRT1_2, r);
		// ctx.quadraticCurveTo(0, 0, -r * Math.SQRT2, -r * Math.SQRT1_2);
		ctx.lineTo(0, 0);
		if (solid) ctx.fill();
		else ctx.stroke();
		ctx.restore();
	}
};

},{}],106:[function(require,module,exports){
/**
 * @module utils/canvas/calcArcHConnector
 */

module.exports = function(x1, y1, r1, x2, y2, r2, ro) {
	var qx = x2 > x1 ? 1 : -1;
	var qy = y2 > y1 ? 1 : -1;
	var dy = Math.abs(y2 - y1);
	var dx = Math.abs(x2 - x1);
	var rr = r1 + r2;
	var tx1, tx2, c, tx, ty;

	if (dy < 1) {
		// points are aligned horizontally, no arcs needed
		tx1 = 0;
		tx2 = dx
		// return [x1, x2];
	}

	if (dy >= rr && dx >= rr) {
		// arcs fit horizontally:
		// second circle center is r1+r2, tangent intersect at x=r1
		c = rr;
		tx1 = r1;
		tx2 = r1;
	} else {
		// arcs overlap horizontally:
		// find second circle center
		c = Math.sqrt(dy * r2 * 2 + dy * r1 * 2 - dy * dy);

		// circles tangent point
		tx = (c * r1) / rr;
		ty = (dy * r1) / rr;

		if (r1 < ty || c > dx) {
			return;
		}

		// tangent perpendicular slope
		var slope = (rr - dy) / c;
		// tangent intersections
		tx1 = tx - (ty * slope);
		tx2 = (dy * slope) + tx1;

		/*
		// circle centers
		var ccx1, ccy1, ccx2, ccy2;
		ccx1 = 0;
		ccy1 = r1;
		ccx2 = c;
		ccy2 = dy - r2;
		// tangent perpendicular slope
		var slope = (ccy1 - ccy2) / (ccx2 - ccx1);
		var xSec = tx - (ty * slope);
		// tangent intersections
		tx1 = xSec;
		tx2 = (dy * slope) + xSec;
		*/
	}

	// offset arcTo's in x-axis
	if (ro > 0) {
		if (ro > 1) {
			ro = Math.min(dx - rr, ro);
		} else {
			ro *= dx - rr;
		}
		tx1 += ro;
		tx2 += ro;
	}

	return [tx1 * qx + x1, tx2 * qx + x1, tx1, tx2];
};

/*
var drawArcConnector = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, hx, hy, gx, gy;

	hx = 0;
	hy = 0;
	gx = (x1 + x2) / 2;
	gy = (y1 + y2) / 2;
	dx = Math.abs(x1 - gx);
	dy = Math.abs(y1 - gy);

	if (dx < r && dy < r) {
		r = Math.min(dx * Math.SQRT1_2, dy * Math.SQRT1_2);
	} else {
		if (dx < r) {
			hy = Math.acos(dx / r) * r * 0.5;
			if (y1 > y2) hy *= -1;
		}
		if (dy < r) {
			hx = Math.acos(dy / r) * r * 0.5;
			if (x1 > x2) hx *= -1;
		}
	}
	ctx.arcTo(gx - hx, y1, gx + hx, y2, r);
	ctx.arcTo(gx + hx, y2, x2, y2, r);
};

var drawArcConnector2 = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, hx, hy, cx1, cx2;

	hx = 0;
	hy = 0;
	dx = Math.abs(x2 - x1) / 2;
	dy = Math.abs(y1 - y2) / 2;

	if (dx < r && dy < r) {
		r = Math.min(dx * Math.SQRT1_2, dy * Math.SQRT1_2);
	} else {
		if (dx < r) {
			hy = Math.acos(dx / r) * r;
		}
		if (dy < r) {
			hx = Math.acos(dy / r) * r;
		}
	}
	cx1 = x1 + dx;
	cx2 = x2 - (dx - hx / 2);
	ctx.arcTo(cx1, y1, cx2, y2, r);
	ctx.arcTo(cx2, y2, x2, y2, r);
};

var drawArcConnector1 = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, cx;

	dx = Math.abs(x2 - x1) / 2;
	dy = Math.abs(y1 - y2) / 2;
	r = Math.min(r, dy * Math.SQRT1_2);
	if (x1 < x2) {
		cx = x1 + dx + r;
	} else {
		cx = x2 - dx - r;
	}
	// cx = (x2 + x1) / 2;
	// cx += x1 < x2 ? r : -r;

	ctx.arcTo(cx, y1, cx, y2, r);
	ctx.arcTo(cx, y2, x2, y2, r);
};
*/

},{}],107:[function(require,module,exports){
/* global HTMLElement, CSSStyleDeclaration */

// var parseSize = require("./parseSize");

var CSS_BOX_PROPS = [
	"boxSizing", "position", "objectFit"
];
var CSS_EDGE_PROPS = [
	"marginTop", "marginBottom", "marginLeft", "marginRight",
	"borderTopWidth", "borderBottomWidth", "borderLeftWidth", "borderRightWidth",
	"paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
];
var CSS_POS_PROPS = ["top", "bottom", "left", "right"];
var CSS_SIZE_PROPS = ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"];
var CSS_ALL_PROPS = CSS_EDGE_PROPS.concat(CSS_SIZE_PROPS, CSS_POS_PROPS);

// var COMPUTED_PROPS = [
// 	"clientLeft", "clientTop", "clientWidth", "clientHeight",
// 	"offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"
// ];
// var o = _.pick(element, function(val) {
// 	return /^(offset|client)(Left|Top|Width|Height)/.test(val);
// });

var cssDimensionRE = /^(-?[\d\.]+)(px|em|rem)$/;
// var cssDimRe = /^([-\.0-9]+)([rem]+)$/;

module.exports = function(s, m, includeSizePos) {
	if (s instanceof HTMLElement) {
		s = getComputedStyle(s);
	}
	if (DEBUG) {
		if (!(s instanceof CSSStyleDeclaration)) {
			throw new Error("Not a CSSStyleDeclaration nor HTMLElement");
		}
	}
	var v, p, i, ii, emPx, remPx;
	m || (m = {});

	emPx = m.fontSize = parseFloat(s.fontSize);

	for (i = 0, ii = CSS_BOX_PROPS.length; i < ii; i++) {
		p = CSS_BOX_PROPS[i];
		if (p in s) {
			m[p] = s[p];
		}
	}
	var cssProps = includeSizePos ? CSS_EDGE_PROPS : CSS_ALL_PROPS;
	for (i = 0, ii = cssProps.length; i < ii; i++) {
		p = cssProps[i];
		m["_" + p] = s[p];
		if (s[p] && (v = cssDimensionRE.exec(s[p]))) {
			if (v[2] === "px") {
				m[p] = parseFloat(v[1]);
			} else if (v[2] === "em") {
				m[p] = parseFloat(v[1]) * emPx;
			} else if (v[2] === "rem") {
				remPx || (remPx = parseFloat(getComputedStyle(document.documentElement).fontSize));
				m[p] = parseFloat(v[1]) * remPx;
			} else {
				console.warn("Ignoring value", p, v[1], v[2]);
				m[p] = null;
			}
		} // else {
		//	console.warn("Ignoring unitless value", p, v);
		//}
	}
	return m;
};

},{}],108:[function(require,module,exports){
/**
 * @param {number} i current iteration
 * @param {number} s start value
 * @param {number} d change in value
 * @param {number} t total iterations
 * @return {number}
 */
var linear = function(i, s, d, t) {
	return d * i / t + s;
};

module.exports = linear;

},{}],109:[function(require,module,exports){
module.exports = [
	"loadstart",
	"progress",
	"suspend",
	"abort",
	"error",
	"emptied",
	"stalled",
	"loadedmetadata",
	"loadeddata",
	"canplay",
	"canplaythrough",
	"playing",
	"waiting",
	"seeking",
	"seeked",
	"ended",
	"durationchange",
	"timeupdate",
	"play",
	"pause",
	"paused",
	"resize",
	"ratechange",
	"volumechange",
];

},{}],110:[function(require,module,exports){
/**
 * @module app/view/component/GraphView
 */

// /** @type {module:underscore} */
// var _ = require("underscore");

module.exports = function(rect, dx, dy) {
	dy || (dy = dx);
	var r = {
		width: rect.width + dx * 2,
		height: rect.height + dy * 2
	};
	if (r.width >= 0) {
		r.left = rect.left - dx;
		r.right = r.left + r.width;
		r.x = r.left;
	} else {
		r.right = rect.right + dx;
		r.left = rect.right - r.width;
		r.y = r.right;
	}
	if (r.height >= 0) {
		r.top = rect.top - dy;
		r.bottom = r.top + r.height;
		r.y = r.top;
	} else {
		r.bottom = rect.bottom + dy;
		r.top = rect.bottom - r.height;
		r.y = r.bottom;
	}

	return r;
};

},{}],111:[function(require,module,exports){
/** @type {Array} lowercase prefixes */
var lcPrefixes = [""].concat(require("./prefixes"));

/** @type {Array} capitalized prefixes */
var ucPrefixes = lcPrefixes.map(function(s) {
	return (s === "") ? s : s.charAt(0).toUpperCase() + s.substr(1);
});

/** @type {Object} specific event solvers */
var _solvers = {};

/** @type {Object} cached values */
var _cache = {};

/**
 * @param {String} name Unprefixed event name
 * @param {?Object} obj Prefix test target
 * @param {?String} testProp Proxy property to test prefixes
 * @return {String|null}
 */
var _prefixedEvent = function(name, obj, testProp) {
	var prefixes = /^[A-Z]/.test(name) ? ucPrefixes : lcPrefixes;
	obj || (obj = document);
	for (var i = 0; i < prefixes.length; i++) {
		if (testProp) {
			if ((prefixes[i] + testProp) in obj) {
				return prefixes[i] + name;
			}
		}
		if (("on" + prefixes[i] + name) in obj) {
			return prefixes[i] + name;
		}
	}
	return null;
};

// transitionend
_solvers["transitionend"] = function() {
	var prop, style = document.body.style,
		map = {
			"transition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd",
			"MozTransition": "transitionend",
			// "msTransition" : "MSTransitionEnd",
			"OTransition": "oTransitionEnd"
		};
	for (prop in map) {
		if (prop in style) {
			return map[prop];
		}
	}
	return null;
};

/**
 * get the prefixed property
 * @param {String} property name
 * @param {Object} look-up object
 * @returns {String|null} prefixed
 */
module.exports = function(evName) {
	if (!_cache.hasOwnProperty(evName)) {
		_cache[evName] = _solvers.hasOwnProperty(evName) ? _solvers[evName]() : _prefixedEvent.apply(null, arguments);
		if (_cache[evName] === null) {
			console.warn("Event '%s' not found", evName);
		} else {
			console.log("Event '%s' found as '%s'", evName, _cache[evName]);
		}
	}
	return _cache[evName];
	// return _cache[evName] || (_cache[evName] = _solvers[evName]? _solvers[evName].call() : _prefixedProperty.apply(null, arguments));
};

/*
var defaultTest = function(name, obj) {
	var prefixes = /^[A-Z]/.test(name)? ucPrefixes : lcPrefixes;
	for (var i = 0; i < prefixes.length; i++) {
		if (("on" + prefixes[i] + name) in obj) {
			console.log("Event '%s' found as '%s'", name, prefixes[i] + name);
			return prefixes[i] + name;
		}
	}
	return null;
};

var proxyTest = function(name, obj, testProp) {
	var prefixes = /^[A-Z]/.test(name)? ucPrefixes : lcPrefixes;
	for (var i = 0; i < prefixes.length; i++) {
		if ((prefixes[i] + testProp) in obj) {
			console.log("Event %s inferred as '%s' from property '%s'", name, prefixes[i] + name, testProp);
			return prefixes[i] + name;
		}
	}
	return null;
};
*/

},{"./prefixes":114}],112:[function(require,module,exports){
/**
/* @module utils/prefixedProperty
/*/

/** @type {module:utils/prefixes} */
var prefixes = require("./prefixes");
/** @type {Number} prefix count */
var _prefixNum = prefixes.length;
/** @type {Array} cached values */
var _cache = {};

var _prefixedProperty = function(prop, obj) {
	var prefixedProp, camelProp;

	if (prop in obj) {
		console.log("Property '%s' found unprefixed", prop);
		return prop;
	}
	camelProp = prop[0].toUpperCase() + prop.slice(1);
	for (var i = 0; i < _prefixNum; i++) {
		prefixedProp = prefixes[i] + camelProp;
		if (prefixedProp in obj) {
			console.log("Property '%s' found as '%s'", prop, prefixedProp);
			return prefixedProp;
		}
	}
	console.error("Property '%s' not found", prop);
	return null;
};

/**
 * get the prefixed property
 * @param {String} property name
 * @param {Object} look-up object
 * @returns {String|null} prefixed
 */
module.exports = function(prop, obj) {
	return _cache[prop] || (_cache[prop] = _prefixedProperty(prop, obj || document.body.style));
};

},{"./prefixes":114}],113:[function(require,module,exports){
/**
/* @module utils/prefixedStyleName
/*/

/** @type {module:utils/prefixes} */
var prefixes = require("./prefixes"); //.map(function(prefix) { return "-" + prefix + "-"; });
/** @type {Number} prefix count */
var _prefixNum = prefixes.length;
/** @type {Array} cached values */
var _cache = {};

var _prefixedStyleName = function(style, styleObj) {
	var prefixedStyle;

	if (style in styleObj) {
		console.log("CSS style '%s' found unprefixed", style);
		return style;
	}
	for (var i = 0; i < _prefixNum; i++) {
		prefixedStyle = "-" + prefixes[i] + "-" + style;
		// prefixedStyle = prefixes[i] + style;
		if (prefixedStyle in styleObj) {
			console.log("CSS style '%s' found as '%s'", style, prefixedStyle);
			return prefixedStyle;
		}
	}
	console.warn("CSS style '%s' not found", style);
	return null;
};

/**
 * get the prefixed style name
 * @param {String} style name
 * @param {Object} look-up style object
 * @returns {String|Undefined} prefixed
 */
module.exports = function(style, styleObj) {
	// return _cache[style] || (_cache[style] = _prefixedStyleName_reverse(style, styleObj || document.body.style));
	return _cache[style] || (_cache[style] = _prefixedStyleName(style, styleObj || document.body.style));
};

// /** @type {module:utils/strings/camelToDashed} */
// var camelToDashed = require("./strings/camelToDashed");
// /** @type {module:utils/prefixedProperty} */
// var prefixedProperty = require("./prefixedProperty");
// /** @type {module:utils/strings/dashedToCamel} */
// var dashedToCamel = require("./strings/dashedToCamel");
//
// var _prefixedStyleName_reverse = function (style, styleObj) {
// 	var camelProp, prefixedProp;
// 	camelProp = dashedToCamel(style);
// 	prefixedProp = prefixedProperty(camelProp, styleObj);
// 	return prefixedProp? (camelProp === prefixedProp? "" : "-") + camelToDashed(prefixedProp) : null;
// };

},{"./prefixes":114}],114:[function(require,module,exports){
module.exports = ["webkit", "moz", "ms", "o"];

},{}],115:[function(require,module,exports){
/* jshint ignore:start */
/*
Taken from:
https://github.com/webcomponents/webcomponentsjs/blob/master/src/MutationObserver/MutationObserver.js
*/
/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var setImmediate;

// As much as we would like to use the native implementation, IE
// (all versions) suffers a rather annoying bug where it will drop or defer
// callbacks when heavy DOM operations are being performed concurrently.
//
// For a thorough discussion on this, see:
// http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
if (/Trident|Edge/.test(navigator.userAgent)) {
	// Sadly, this bug also affects postMessage and MessageQueues.
	//
	// We would like to use the onreadystatechange hack for IE <= 10, but it is
	// dangerous in the polyfilled environment due to requiring that the
	// observed script element be in the document.
	setImmediate = setTimeout;

	// If some other browser ever implements it, let's prefer their native
	// implementation:
} else if (window.setImmediate) {
	setImmediate = window.setImmediate;

	// Otherwise, we fall back to postMessage as a means of emulating the next
	// task semantics of setImmediate.
} else {
	var setImmediateQueue = [];
	var sentinel = String(Math.random());
	window.addEventListener("message", function(e) {
		if (e.data === sentinel) {
			var queue = setImmediateQueue;
			setImmediateQueue = [];
			queue.forEach(function(func) {
				func();
			});
		}
	});
	setImmediate = function(func) {
		setImmediateQueue.push(func);
		window.postMessage(sentinel, "*");
	};
}

module.exports = setImmediate;
/* jshint ignore:end */

},{}],116:[function(require,module,exports){
module.exports = function(str) {
	return str.replace(/[A-Z]/g, function($0) {
		return "-" + $0.toLowerCase();
	});
};

},{}],117:[function(require,module,exports){
module.exports = function(s) {
	return s.replace(/<[^>]+>/g, "");
};

},{}],118:[function(require,module,exports){
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
	if (state & Hammer.STATE_CANCELLED) {
		return "cancel";
	} else if (state & Hammer.STATE_ENDED) {
		return "end";
	} else if (state & Hammer.STATE_CHANGED) {
		return "move";
	} else if (state & Hammer.STATE_BEGAN) {
		return "start";
	}
	return "";
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
	if (direction == Hammer.DIRECTION_DOWN) {
		return "down";
	} else if (direction == Hammer.DIRECTION_UP) {
		return "up";
	} else if (direction == Hammer.DIRECTION_LEFT) {
		return "left";
	} else if (direction == Hammer.DIRECTION_RIGHT) {
		return "right";
	}
	return "";
}

///**
// * Pan
// * Recognized when the pointer is down and moved in the allowed direction.
// * @constructor
// * @extends AttrRecognizer
// */
//function PanRecognizer() {
//	Hammer.AttrRecognizer.apply(this, arguments);
//
//	this.pX = null;
//	this.pY = null;
//}
//
//inherit(PanRecognizer, Hammer.AttrRecognizer, {
//	/**
//	/* @namespace
//	/* @memberof PanRecognizer
//	/*/
//	defaults: {
//		event: "pan",
//		threshold: 10,
//		pointers: 1,
//		direction: DIRECTION_ALL
//	},
//
//	getTouchAction: function() {
//		var direction = this.options.direction;
//		var actions = [];
//		if (direction & DIRECTION_HORIZONTAL) {
//			actions.push(TOUCH_ACTION_PAN_Y);
//		}
//		if (direction & DIRECTION_VERTICAL) {
//			actions.push(TOUCH_ACTION_PAN_X);
//		}
//		return actions;
//	},
//
//	directionTest: function(input) {
//		var options = this.options;
//		var hasMoved = true;
//		var distance = input.distance;
//		var direction = input.direction;
//		var x = input.deltaX;
//		var y = input.deltaY;
//
//		// lock to axis?
//		if (!(direction & options.direction)) {
//			if (options.direction & DIRECTION_HORIZONTAL) {
//				direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
//				hasMoved = x != this.pX;
//				distance = Math.abs(input.deltaX);
//			} else {
//				direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
//				hasMoved = y != this.pY;
//				distance = Math.abs(input.deltaY);
//			}
//		}
//		input.direction = direction;
//		return hasMoved && distance > options.threshold && direction & options.direction;
//	},
//
//	attrTest: function(input) {
//		return AttrRecognizer.prototype.attrTest.call(this, input) &&
//			(this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
//	},
//
//	emit: function(input) {
//		this.pX = input.deltaX;
//		this.pY = input.deltaY;
//
//		var direction = directionStr(input.direction);
//		if (direction) {
//			this.manager.emit(this.options.event + direction, input);
//		}
//
//		this._super.emit.call(this, input);
//	}
//});

/**
 * SmoothPan
 * @constructor
 * @extends Hammer.Pan
 */
function SmoothPan() {
	Hammer.Pan.apply(this, arguments);
	this.thresholdOffsetX = null;
	this.thresholdOffsetY = null;
	this.thresholdOffset = null;
}

Hammer.inherit(SmoothPan, Hammer.Pan, {
	emit: function(input) {
		// Inheritance breaks, so this code is taken from PanRecognizer.emit
		//	this._super.emit.call(this, input); 				// Triggers infinite recursion
		//	Hammer.Pan.prototype.emit.apply(this, arguments); 	// This breaks too

		var threshold = this.options.threshold;
		var direction = input.direction;

		if (this.state == Hammer.STATE_BEGAN) {
			this.thresholdOffsetX = (direction & Hammer.DIRECTION_HORIZONTAL)? ((direction & Hammer.DIRECTION_LEFT)? threshold: -threshold) : 0;
			this.thresholdOffsetY = (direction & Hammer.DIRECTION_VERTICAL)? ((direction & Hammer.DIRECTION_UP)? threshold: -threshold) : 0;
			// this.thresholdOffset = (direction & Hammer.DIRECTION_HORIZONTAL)? input.thresholdOffsetX : input.thresholdOffsetY;
			// console.log("RECOGNIZER STATE", directionStr(direction), stateStr(this.state), this.thresholdOffsetX);
		}
		input.thresholdOffsetX = this.thresholdOffsetX;
		input.thresholdOffsetY = this.thresholdOffsetY;
		input.thresholdDeltaX = input.deltaX + this.thresholdOffsetX,
		input.thresholdDeltaY = input.deltaY + this.thresholdOffsetY,

		this.pX = input.deltaX;
		this.pY = input.deltaY;

		direction = directionStr(direction);
		if (direction) {
			this.manager.emit(this.options.event + direction, input);
		}
		Hammer.Recognizer.prototype.emit.apply(this, arguments);
	}
});

module.exports = SmoothPan;

},{"hammerjs":"hammerjs"}],119:[function(require,module,exports){
module.exports={
	"units": {
		"hu_px": "20",
		"vu_px": "12"
	},
	"transitions": {
		"min_delay_ms": "20",
		"delay_interval_ms": "120",
		"duration_ms": "400",
		"ease": "ease"
	},
	"breakpoints": {
		"mobile": "not screen and (min-width: 704px) and (min-height: 540px)",
		"unsupported": "not screen and (min-width: 704px)",
		"desktop-small": "only screen and (min-width: 1024px)",
		"desktop-medium": "only screen and (min-width: 1224px)",
		"desktop-large": "only screen and (min-width: 1824px)"
	},
	"default_colors": {
		"color": "hsl(47, 5%, 15%)",
		"background-color": "hsl(47, 5%, 95%)",
		"--link-color": "hsl(10, 80%, 50%)",
		"--alt-background-color": "unset"
	},
	"layout_names": ["left-layout", "default-layout", "right-layout"],
	"temp": {
		"collapse_offset": "360"
	}
}

},{}],"Backbone.Mutators":[function(require,module,exports){
/*! Backbone.Mutators - v0.4.4
------------------------------
Build @ 2015-02-03
Documentation and Full License Available at:
http://asciidisco.github.com/Backbone.Mutators/index.html
git://github.com/asciidisco/Backbone.Mutators.git
Copyright (c) 2015 Sebastian Golasch <public@asciidisco.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the

Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.*/
(function (root, factory, undef) {
    'use strict';

    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], function (_, Backbone) {
            // Check if we use the AMD branch of Back
            _ = _ === undef ? root._ : _;
            Backbone = Backbone === undef ? root.Backbone : Backbone;
            return (root.returnExportsGlobal = factory(_, Backbone, root));
        });
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root._, root.Backbone);
    }

// Usage:
//
// Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs
//
// Vanilla JS:
// <script src="underscore.js"></script>
// <script src="backbone.js"></script>
// <script src="backbone.mutators.js"></script>
//
// Node:
// var _ = require('underscore');
// var Backbone = require('backbone');
// var Mutators = require('backbone.mutators');
//
//
// AMD:
// define(['underscore', 'backbone', 'backbone.mutators'], function (_, Backbone, Mutators) {
//    // insert sample from below
//    return User;
// });
//
// var User = Backbone.Model.extend({
//    mutators: {
//        fullname: function () {
//            return this.firstname + ' ' + this.lastname;
//        }
//    },
//
//    defaults: {
//        firstname: 'Sebastian',
//        lastname: 'Golasch'
//    }
// });
//
// var user = new User();
// user.get('fullname') // returns 'Sebastian Golasch'
// user.toJSON() // return '{firstname: 'Sebastian', lastname: 'Golasch', fullname: 'Sebastian Golasch'}'

}(this, function (_, Backbone, root, undef) {
    'use strict';

    // check if we use the amd branch of backbone and underscore
    Backbone = Backbone === undef ? root.Backbone : Backbone;
    _ = _ === undef ? root._ : _;

    // extend backbones model prototype with the mutator functionality
    var Mutator     = function () {},
        oldGet      = Backbone.Model.prototype.get,
        oldSet      = Backbone.Model.prototype.set,
        oldToJson   = Backbone.Model.prototype.toJSON;

    // This is necessary to ensure that Models declared without the mutators object do not throw and error
    Mutator.prototype.mutators = {};

    // override get functionality to fetch the mutator props
    Mutator.prototype.get = function (attr) {
        var isMutator = this.mutators !== undef;

        // check if we have a getter mutation
        if (isMutator === true && _.isFunction(this.mutators[attr]) === true) {
            return this.mutators[attr].call(this);
        }

        // check if we have a deeper nested getter mutation
        if (isMutator === true && _.isObject(this.mutators[attr]) === true && _.isFunction(this.mutators[attr].get) === true) {
            return this.mutators[attr].get.call(this);
        }

        return oldGet.call(this, attr);
    };

    // override set functionality to set the mutator props
    Mutator.prototype.set = function (key, value, options) {
        var isMutator = this.mutators !== undef,
            ret = null,
            attrs = null;

		ret = oldSet.call(this, key, value, options);

        // seamleassly stolen from backbone core
        // check if the setter action is triggered
        // using key <-> value or object
        if (_.isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

        // check if we have a deeper nested setter mutation
        if (isMutator === true && _.isObject(this.mutators[key]) === true) {

            // check if we need to set a single value
            if (_.isFunction(this.mutators[key].set) === true) {
                ret = this.mutators[key].set.call(this, key, attrs[key], options, _.bind(oldSet, this));
            } else if(_.isFunction(this.mutators[key])){
                ret = this.mutators[key].call(this, key, attrs[key], options, _.bind(oldSet, this));
            }
        }

        if (isMutator === true && _.isObject(attrs)) {
            _.each(attrs, _.bind(function (attr, attrKey) {
                if (_.isObject(this.mutators[attrKey]) === true) {
                    // check if we need to set a single value

                    var meth = this.mutators[attrKey];
                    if(_.isFunction(meth.set)){
                        meth = meth.set;
                    }

                    if(_.isFunction(meth)){
                        if (options === undef || (_.isObject(options) === true && options.silent !== true && (options.mutators !== undef && options.mutators.silent !== true))) {
                            this.trigger('mutators:set:' + attrKey);
                        }
                        meth.call(this, attrKey, attr, options, _.bind(oldSet, this));
                    }

                }
            }, this));
        }

        return ret;
    };

    // override toJSON functionality to serialize mutator properties
    Mutator.prototype.toJSON = function (options) {
        // fetch ye olde values
        var attr = oldToJson.call(this),
            isSaving,
            isTransient;
        // iterate over all mutators (if there are some)
        _.each(this.mutators, _.bind(function (mutator, name) {
            // check if we have some getter mutations
            if (_.isObject(this.mutators[name]) === true && _.isFunction(this.mutators[name].get)) {
                isSaving = (this.isSaving) ? this.isSaving(options, mutator, name) : _.has(options || {}, 'emulateHTTP');
                isTransient = this.mutators[name].transient;
                if (!isSaving || !isTransient) {
                  attr[name] = _.bind(this.mutators[name].get, this)();
                }
            } else if (_.isFunction(this.mutators[name])) {
                attr[name] = _.bind(this.mutators[name], this)();
            }
        }, this));

        return attr;
    };

    // override get functionality to get HTML-escaped the mutator props
    Mutator.prototype.escape = function (attr){
        var val = this.get(attr);
        return _.escape(val == null ? '' : '' + val);
    };

    // extend the models prototype
    _.extend(Backbone.Model.prototype, Mutator.prototype);

    // make mutators globally available under the Backbone namespace
    Backbone.Mutators = Mutator;
    return Mutator;
}));

},{"backbone":"backbone","underscore":"underscore"}],"Modernizr":[function(require,module,exports){
require("modernizr-dist");

Modernizr._config.classPrefix = "has-";
Modernizr._config.enableClasses = false;
Modernizr.addTest("weakmap", function () { 
	return window.WeakMap !== void 0; 
});
/* jshint -W117 */
Modernizr.addTest("strictmode", function() {
	try { undeclaredVar = 1; }
	catch (e) { return true; }
	return false;
});
/* jshint +W117 */

module.exports = window.Modernizr;

},{"modernizr-dist":"modernizr-dist"}],"backbone.babysitter":[function(require,module,exports){
// Backbone.BabySitter
// -------------------
// v0.1.11
//
// Copyright (c)2016 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.babysitter

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }

}(this, function(Backbone, _) {
  'use strict';

  var previousChildViewContainer = Backbone.ChildViewContainer;

  // BabySitter.ChildViewContainer
  // -----------------------------
  //
  // Provide a container to store, retrieve and
  // shut down child views.
  
  Backbone.ChildViewContainer = (function (Backbone, _) {
  
    // Container Constructor
    // ---------------------
  
    var Container = function(views){
      this._views = {};
      this._indexByModel = {};
      this._indexByCustom = {};
      this._updateLength();
  
      _.each(views, this.add, this);
    };
  
    // Container Methods
    // -----------------
  
    _.extend(Container.prototype, {
  
      // Add a view to this container. Stores the view
      // by `cid` and makes it searchable by the model
      // cid (and model itself). Optionally specify
      // a custom key to store an retrieve the view.
      add: function(view, customIndex){
        var viewCid = view.cid;
  
        // store the view
        this._views[viewCid] = view;
  
        // index it by model
        if (view.model){
          this._indexByModel[view.model.cid] = viewCid;
        }
  
        // index by custom
        if (customIndex){
          this._indexByCustom[customIndex] = viewCid;
        }
  
        this._updateLength();
        return this;
      },
  
      // Find a view by the model that was attached to
      // it. Uses the model's `cid` to find it.
      findByModel: function(model){
        return this.findByModelCid(model.cid);
      },
  
      // Find a view by the `cid` of the model that was attached to
      // it. Uses the model's `cid` to find the view `cid` and
      // retrieve the view using it.
      findByModelCid: function(modelCid){
        var viewCid = this._indexByModel[modelCid];
        return this.findByCid(viewCid);
      },
  
      // Find a view by a custom indexer.
      findByCustom: function(index){
        var viewCid = this._indexByCustom[index];
        return this.findByCid(viewCid);
      },
  
      // Find by index. This is not guaranteed to be a
      // stable index.
      findByIndex: function(index){
        return _.values(this._views)[index];
      },
  
      // retrieve a view by its `cid` directly
      findByCid: function(cid){
        return this._views[cid];
      },
  
      // Remove a view
      remove: function(view){
        var viewCid = view.cid;
  
        // delete model index
        if (view.model){
          delete this._indexByModel[view.model.cid];
        }
  
        // delete custom index
        _.any(this._indexByCustom, function(cid, key) {
          if (cid === viewCid) {
            delete this._indexByCustom[key];
            return true;
          }
        }, this);
  
        // remove the view from the container
        delete this._views[viewCid];
  
        // update the length
        this._updateLength();
        return this;
      },
  
      // Call a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.call`.
      call: function(method){
        this.apply(method, _.tail(arguments));
      },
  
      // Apply a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.apply`.
      apply: function(method, args){
        _.each(this._views, function(view){
          if (_.isFunction(view[method])){
            view[method].apply(view, args || []);
          }
        });
      },
  
      // Update the `.length` attribute on this container
      _updateLength: function(){
        this.length = _.size(this._views);
      }
    });
  
    // Borrowing this code from Backbone.Collection:
    // http://backbonejs.org/docs/backbone.html#section-106
    //
    // Mix in methods from Underscore, for iteration, and other
    // collection related features.
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck', 'reduce'];
  
    _.each(methods, function(method) {
      Container.prototype[method] = function() {
        var views = _.values(this._views);
        var args = [views].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  
    // return the public API
    return Container;
  })(Backbone, _);
  

  Backbone.ChildViewContainer.VERSION = '0.1.11';

  Backbone.ChildViewContainer.noConflict = function () {
    Backbone.ChildViewContainer = previousChildViewContainer;
    return this;
  };

  return Backbone.ChildViewContainer;

}));

},{"backbone":"backbone","underscore":"underscore"}],"backbone.native":[function(require,module,exports){
/**
 * Backbone.Native
 *
 * For all details and documentation:
 * http://github.com/inkling/backbone.native
 *
 * Copyright 2013 Inkling Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The purpose of this library is to allow Backbone to work without needing to load jQuery or Zepto.
 * This file provides a basic jQuery-like implementation for Backbone, implementing the
 * minimum functionality for Backbone to function. We assume that Backbone applications using
 * this will not expect the standard jQuery API to work, and will instead use native JS functions.
 *
 * Keep in mind that due to the APIs in this, it will likely only work on recent browsers.
 *
 * Note:
 *  - Core Backbone only needs collections with single members, so that is all that has been
 *      supported in this library. It is expected that you will just use querySelectorAll instead.
 *      This will be most obvious if you make heavy use of 'view.$'.
 *  - Events delegated with selectors starting with '>' are not supported.
 *  - Due to 'currentTarget' being read-only on standard DOM events, we cannot make standard
 *      events behave identically to jQuery's events when delegation is used. The element matching
 *      the delegate selector is instead passed as the second argument to event handlers.
 *  - The '$.ajax' implementation is very simple and likely needs to be expanded to better support
 *      standard use-cases.
 *
 * Tested with Backbone v0.9.2 and 1.0.0.
 */
(function(){
    "use strict";

    // Regular expression to match an event name and/or a namespace.
    var namespaceRE = /^([^.]+)?(?:\.([^.]+))?$/;

    var matchesSelector = Element.prototype.matchesSelector || null;
    if (!matchesSelector){
        ['webkit', 'moz', 'o', 'ms'].forEach(function(prefix){
            var func = Element.prototype[prefix + 'MatchesSelector'];
            if (func) matchesSelector = func;
        });
    }

    // The element property to save the cache key on.
    var cacheKeyProp = 'backboneNativeKey' + Math.random();
    var id = 1;
    var handlers = {};
    var unusedKeys = [];

    /**
     * Get the event handlers for a given element, creating an empty set if one doesn't exist.
     *
     * To avoid constantly filling the handlers object with null values, we reuse old IDs that
     * have been created and then cleared.
     *
     * @param {Element} el The element to get handlers for.
     *
     * @return {Array} An array of handlers.
     */
    function handlersFor(el){
        if (!el[cacheKeyProp]){
            // Pick a new key, from the unused pool, or make a new one.
            el[cacheKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
        }

        var cacheKey = el[cacheKeyProp];
        return handlers[cacheKey] || (handlers[cacheKey] = []);
    }

    /**
     * Clear the event handlers for a given element.
     *
     * @param {Element} el The element to clear.
     */
    function clearHandlers(el){
        var cacheKey = el[cacheKeyProp];
        if (handlers[cacheKey]){
            handlers[cacheKey] = null;
            el[cacheKeyProp] = null;
            unusedKeys.push(cacheKey);
        }
    }

    /**
     * Add event handlers to an element.
     *
     * @param {Element} parentElement The element to bind event handlers to.
     * @param {string} eventName The event to bind, e.g. 'click'.
     * @param {string} selector (Optional) The selector to match when an event propagates up.
     * @param {function(Event, Element)} callback The function to call when the event is fired.
     */
    function on(parentElement, eventName, selector, callback){
        // Adjust arguments if selector was not provided.
        if (typeof selector === 'function'){
            callback = selector;
            selector = null;
        }

        var parts = namespaceRE.exec(eventName);
        eventName = parts[1] || null;
        var namespace = parts[2] || null;

        if (!eventName) return;

        var handler = callback;
        var originalCallback = callback;
        if (selector){
            // Event delegation handler to match a selector for child element events.
            handler = function(event){
                for (var el = event.target; el && el !== parentElement; el = el.parentElement){
                    if (matchesSelector.call(el, selector)){
                        // jQuery does not include the second argument, but we have included it
                        // for simplicity because 'this' will likely be bound to the view inside
                        // the callback, and as noted above, we cannot override 'currentTarget'.
                        var result = originalCallback.call(el, event, el);
                        if (result === false){
                            event.stopPropagation();
                            event.preventDefault();
                        }
                        return result;
                    }
                }
            };
        } else {
            // Standard event handler bound directly to the element.
            handler = function(event){
                var result = originalCallback.call(parentElement, event, parentElement);
                if (result === false){
                    event.stopPropagation();
                    event.preventDefault();
                }
                return result;
            };
        }

        parentElement.addEventListener(eventName, handler, false);

        // Save event handler metadata so that the handler can be unbound later.
        handlersFor(parentElement).push({
            eventName: eventName,
            callback: callback,
            handler: handler,
            namespace: namespace,
            selector: selector
        });
    }

    /**
     * Remove an event handler from an element.
     *
     * @param {Element} parentElement The element to unbind event handlers from.
     * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
     * @param {string} selector (Optional) The selector to unbind.
     * @param {function(Event, Element)} callback (Optional) The function to unbind.
     */
    function off(parentElement, eventName, selector, callback){
        if (typeof selector === 'function'){
            callback = selector;
            selector = null;
        }

        var parts = namespaceRE.exec(eventName || '');
        eventName = parts[1];
        var namespace = parts[2];
        var handlers = handlersFor(parentElement) || [];

        if (!eventName && !namespace && !selector && !callback){
            // Fastpath to remove all handlers.
            handlers.forEach(function(item){
                parentElement.removeEventListener(item.eventName, item.handler, false);
            });
            clearHandlers(parentElement);
        } else {
            var matchedHandlers = handlers.filter(function(item){
                return ((!namespace || item.namespace === namespace) &&
                    (!eventName || item.eventName === eventName) &&
                    (!callback || item.callback === callback) &&
                    (!selector || item.selector === selector));
            });

            matchedHandlers.forEach(function(item){
                parentElement.removeEventListener(item.eventName, item.handler, false);

                handlers.splice(handlers.indexOf(item), 1);
            });

            if (handlers.length === 0) clearHandlers(parentElement);
        }
    }

    /**
     * Construct a new jQuery-style element representation.
     *
     * @param {string|Element|Window} element There are several different possible values for this
     *      argument:
     *      - {string} A snippet of HTML, if it starts with a '<', or a selector to find.
     *      - {Element} An existing element to wrap.
     *      - {Window} The window object to wrap.
     * @param {Element} context The context to search within, if a selector was given.
     *      Defaults to document.
     */
    function $(element, context){
        context = context || document;

        // Call as a constructor if it was used as a function.
        if (!(this instanceof $)) return new $(element, context);

        if (!element){
            this.length = 0;
        } else if (typeof element === 'string'){
            if (/^\s*</.test(element)){
                // Parse arbitrary HTML into an element.
                var div = document.createElement('div');
                div.innerHTML = element;
                this[0] = div.firstChild;
                div.removeChild(div.firstChild);
                this.length = 1;
            } else {
                this[0] = context.querySelector(element);
                this.length = 1;
            }
        } else {
            // This handles both the 'Element' and 'Window' case, as both support
            // event binding via 'addEventListener'.
            this[0] = element;
            this.length = 1;
        }
    }

    $.prototype = {
        /**
         * The following methods are used by Backbone, but only in code-paths for IE 6/7 support.
         * Since none of this will work for old IE anyway, they are not implemented, and
         * instead left for documentation purposes.
         *
         * Used in Backbone.History.prototype.start.
         */
        hide: null,
        appendTo: null,

        /**
         * Find is not supported to encourage the use of querySelector(All) as an alternative.
         *
         * e.g.
         * Instead of 'this.$(sel)', use 'this.el.querySelectorAll(sel)'.
         *
         * Used in Backbone.View.prototype.$, but not actually called internally.
         */
        find: null,

        /**
         * Add attributes to the element.
         *
         * Used in Backbone.View.prototype.make.
         *
         * @param {Object} attributes A set of attributes to apply to the element.
         *
         * @return {$} This instance.
         */
        attr: function(attrs){
            Object.keys(attrs).forEach(function(attr){
                switch (attr){
                    case 'html':
                        this[0].innerHTML = attrs[attr];
                        break;
                    case 'text':
                        this[0].textContent = attrs[attr];
                        break;
                    case 'class':
                        this[0].className = attrs[attr];
                        break;
                    default:
                        this[0].setAttribute(attr, attrs[attr]);
                        break;
                }
            }, this);
            return this;
        },

        /**
         * Set the HTML content of the element. Backbone does not use the no-argument version
         * to read innerHTML, so that has not been implemented.
         *
         * Used in Backbone.View.prototype.make.
         *
         * @param {string} html The HTML to set as the element content.
         *
         * @return {$} This instance.
         */
        html: function(html){
            this[0].innerHTML = html;
            return this;
        },

        /**
         * Remove an element from the DOM and remove all event handlers bound to it and
         * its child elements.
         *
         * Used in Backbone.View.prototype.remove.
         *
         * @return {$} This instance.
         */
        remove: function(){
            var el = this[0];
            if (el.parentElement) el.parentElement.removeChild(el);

            // Unbind all event handlers on the element and children.
            (function removeChildEvents(element){
                off(element);

                for (var i = 0, len = element.childNodes.length; i < len; i++){
                    if (element.childNodes[i].nodeType !== Node.TEXT_NODE){
                        removeChildEvents(element.childNodes[i]);
                    }
                }
            })(el);

            return this;
        },

        /**
         * Bind an event handler to this element.
         *
         * @param {string} eventName The event to bind, e.g. 'click'.
         * @param {string} selector (Optional) The selector to match when an event propagates up.
         * @param {function(Event, Element)} callback The function to call when the event is fired.
         */
        on: function(eventName, selector, callback){
            on(this[0], eventName, selector, callback);
            return this;
        },

        /**
         * Unbind an event handler to this element.
         *
         * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
         * @param {string} selector (Optional) The selector to unbind.
         * @param {function(Event, Element)} callback (Optional) The function to unbind.
         */
        off: function(eventName, selector, callback){
            off(this[0], eventName, selector, callback);
            return this;
        },

        // Backbone v0.9.2 support.
        bind: function(eventName, callback){
            return this.on(eventName, callback);
        },
        unbind: function(eventName, callback){
            return this.off(eventName, callback);
        },
        delegate: function(selector, eventName, callback){
            return this.on(eventName, selector, callback);
        },
        undelegate: function(selector, eventName, callback){
            return this.off(eventName, selector, callback);
        }
    };

    /**
     * Send an AJAX request.
     *
     * @param {Object} options The options to use for the connection:
     *      - {string} url The URL to connect to.
     *      - {string} type The type of request, e.g. 'GET', or 'POST'.
     *      - {string} dataType The type of data expected, 'json'.
     *      - {string} contentType The content-type of the data.
     *      - {string|object} data The content to send.
     *      - {function(XMLHttpRequest)} beforeSend A callback to call before sending.
     *      - {boolean} processData True if 'data' should be converted
     *          to a query string from an object.
     *      - {function({string|object}, {string}, {XMLHttpRequest})} success The success callback.
     *      - {function({XMLHttpRequest})} error The error callback.
     */
    $.ajax = function(options){
        options = options || {};
        var type = options.type || 'GET';
        var url = options.url;
        var processData = options.processData === undefined ? true : !!options.processData;

        // Process the data for sending.
        var data = options.data;
        if (processData && typeof data === 'object'){
            var params = Object.keys(data).map(function(prop){
                return encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]);
            });
            data = params.join('&');
        }

        // Data for GET and HEAD goes in the URL.
        if (data && (type === 'GET' || type === 'HEAD')){
            url += (url.indexOf('?') === -1 ? '?' : '&') + data;
            data = undefined;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(type, url, true);

        if (options.contentType) xhr.setRequestHeader('Content-Type', options.contentType);
        if (options.beforeSend) options.beforeSend(xhr);

        xhr.onload = function(){
            var error = false;
            var content = xhr.responseText;

            // Parse the JSON before calling success.
            if (options.dataType === 'json'){
                try {
                    content = JSON.parse(content);
                } catch (e){
                    error = true
                }
            }

            if (!error && (xhr.status >= 200 && xhr.status < 300)){
                // The last two arguments only apply to v0.9.2.
                if (options.success) options.success(content, xhr.statusText, xhr);
            } else {
                // This signature is inconsistent with v0.9.2, but is correct for 1.0.0.
                if (options.error) options.error(xhr);
            }
        }.bind(this);

        xhr.onerror = xhr.onabort = function(){
            if (options.error) options.error(xhr);
        };

        xhr.send(data);

        return xhr;
    };

    // Expose on/off for external use with having to instantiate a wrapper.
    $.on = on;
    $.off = off;

    if(typeof exports !== 'undefined') {
      return module.exports = $;
    }

    var root = this;
    var originalBackboneNative = root.Backbone ? root.Backbone.Native : null;
    var original$ = root.$;
    if (root.Backbone) root.Backbone.Native = $;
    root.$ = $;

    $.noConflict = function(deep){
        root.$ = original$;
        if (deep) root.Backbone.Native = originalBackboneNative;
        return $;
    };

    if (root.Backbone){
        if (root.Backbone.setDomLibrary){ // v0.9.2
            root.Backbone.setDomLibrary($);
        } else { // v1.0.0
            root.Backbone.$ = $;
        }
    }
}).call(this);

},{}],"backbone":[function(require,module,exports){
//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

},{"underscore":"underscore"}],"classlist-polyfill":[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

/* Copied from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */

if ("document" in window.self) {

  // Full polyfill for browsers with no classList support
  if (!("classList" in document.createElement("_"))) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var
        classListProp = "classList"
      , protoProp = "prototype"
      , elemCtrProto = view.Element[protoProp]
      , objCtr = Object
      , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      }
      , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
            i = 0
          , len = this.length
        ;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      , ClassList = function (elem) {
        var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
          , i = 0
          , len = classes.length
        ;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        };
      }
      , classListProto = ClassList[protoProp] = []
      , classListGetter = function () {
        return new ClassList(this);
      }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
      return this[i] || null;
    };
    classListProto.contains = function (token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
      ;
      do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.remove = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
        , index
      ;
      do {
        token = tokens[i] + "";
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
          this.splice(index, 1);
          updated = true;
          index = checkTokenAndGetIndex(this, token);
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.toggle = function (token, force) {
      token += "";

      var
          result = this.contains(token)
        , method = result ?
          force !== true && "remove"
        :
          force !== false && "add"
      ;

      if (method) {
        this[method](token);
      }

      if (force === true || force === false) {
        return force;
      } else {
        return !result;
      }
    };
    classListProto.toString = function () {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(window.self));

    } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());
  }
}

},{}],"color":[function(require,module,exports){
/* MIT license */
var convert = require("color-convert"),
    string = require("color-string");

var Color = function(obj) {
  if (obj instanceof Color) return obj;
  if (! (this instanceof Color)) return new Color(obj);

   this.values = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      hwb: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      alpha: 1
   }

   // parse Color() argument
   if (typeof obj == "string") {
      var vals = string.getRgba(obj);
      if (vals) {
         this.setValues("rgb", vals);
      }
      else if(vals = string.getHsla(obj)) {
         this.setValues("hsl", vals);
      }
      else if(vals = string.getHwb(obj)) {
         this.setValues("hwb", vals);
      }
      else {
        throw new Error("Unable to parse color from string \"" + obj + "\"");
      }
   }
   else if (typeof obj == "object") {
      var vals = obj;
      if(vals["r"] !== undefined || vals["red"] !== undefined) {
         this.setValues("rgb", vals)
      }
      else if(vals["l"] !== undefined || vals["lightness"] !== undefined) {
         this.setValues("hsl", vals)
      }
      else if(vals["v"] !== undefined || vals["value"] !== undefined) {
         this.setValues("hsv", vals)
      }
      else if(vals["w"] !== undefined || vals["whiteness"] !== undefined) {
         this.setValues("hwb", vals)
      }
      else if(vals["c"] !== undefined || vals["cyan"] !== undefined) {
         this.setValues("cmyk", vals)
      }
      else {
        throw new Error("Unable to parse color from object " + JSON.stringify(obj));
      }
   }
}

Color.prototype = {
   rgb: function (vals) {
      return this.setSpace("rgb", arguments);
   },
   hsl: function(vals) {
      return this.setSpace("hsl", arguments);
   },
   hsv: function(vals) {
      return this.setSpace("hsv", arguments);
   },
   hwb: function(vals) {
      return this.setSpace("hwb", arguments);
   },
   cmyk: function(vals) {
      return this.setSpace("cmyk", arguments);
   },

   rgbArray: function() {
      return this.values.rgb;
   },
   hslArray: function() {
      return this.values.hsl;
   },
   hsvArray: function() {
      return this.values.hsv;
   },
   hwbArray: function() {
      if (this.values.alpha !== 1) {
        return this.values.hwb.concat([this.values.alpha])
      }
      return this.values.hwb;
   },
   cmykArray: function() {
      return this.values.cmyk;
   },
   rgbaArray: function() {
      var rgb = this.values.rgb;
      return rgb.concat([this.values.alpha]);
   },
   hslaArray: function() {
      var hsl = this.values.hsl;
      return hsl.concat([this.values.alpha]);
   },
   alpha: function(val) {
      if (val === undefined) {
         return this.values.alpha;
      }
      this.setValues("alpha", val);
      return this;
   },

   red: function(val) {
      return this.setChannel("rgb", 0, val);
   },
   green: function(val) {
      return this.setChannel("rgb", 1, val);
   },
   blue: function(val) {
      return this.setChannel("rgb", 2, val);
   },
   hue: function(val) {
      return this.setChannel("hsl", 0, val);
   },
   saturation: function(val) {
      return this.setChannel("hsl", 1, val);
   },
   lightness: function(val) {
      return this.setChannel("hsl", 2, val);
   },
   saturationv: function(val) {
      return this.setChannel("hsv", 1, val);
   },
   whiteness: function(val) {
      return this.setChannel("hwb", 1, val);
   },
   blackness: function(val) {
      return this.setChannel("hwb", 2, val);
   },
   value: function(val) {
      return this.setChannel("hsv", 2, val);
   },
   cyan: function(val) {
      return this.setChannel("cmyk", 0, val);
   },
   magenta: function(val) {
      return this.setChannel("cmyk", 1, val);
   },
   yellow: function(val) {
      return this.setChannel("cmyk", 2, val);
   },
   black: function(val) {
      return this.setChannel("cmyk", 3, val);
   },

   hexString: function() {
      return string.hexString(this.values.rgb);
   },
   rgbString: function() {
      return string.rgbString(this.values.rgb, this.values.alpha);
   },
   rgbaString: function() {
      return string.rgbaString(this.values.rgb, this.values.alpha);
   },
   percentString: function() {
      return string.percentString(this.values.rgb, this.values.alpha);
   },
   hslString: function() {
      return string.hslString(this.values.hsl, this.values.alpha);
   },
   hslaString: function() {
      return string.hslaString(this.values.hsl, this.values.alpha);
   },
   hwbString: function() {
      return string.hwbString(this.values.hwb, this.values.alpha);
   },
   keyword: function() {
      return string.keyword(this.values.rgb, this.values.alpha);
   },

   rgbNumber: function() {
      return (this.values.rgb[0] << 16) | (this.values.rgb[1] << 8) | this.values.rgb[2];
   },

   luminosity: function() {
      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
      var rgb = this.values.rgb;
      var lum = [];
      for (var i = 0; i < rgb.length; i++) {
         var chan = rgb[i] / 255;
         lum[i] = (chan <= 0.03928) ? chan / 12.92
                  : Math.pow(((chan + 0.055) / 1.055), 2.4)
      }
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
   },

   contrast: function(color2) {
      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();
      if (lum1 > lum2) {
         return (lum1 + 0.05) / (lum2 + 0.05)
      };
      return (lum2 + 0.05) / (lum1 + 0.05);
   },

   level: function(color2) {
     var contrastRatio = this.contrast(color2);
     return (contrastRatio >= 7.1)
       ? 'AAA'
       : (contrastRatio >= 4.5)
        ? 'AA'
        : '';
   },

   dark: function() {
      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
      var rgb = this.values.rgb,
          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return yiq < 128;
   },

   light: function() {
      return !this.dark();
   },

   negate: function() {
      var rgb = []
      for (var i = 0; i < 3; i++) {
         rgb[i] = 255 - this.values.rgb[i];
      }
      this.setValues("rgb", rgb);
      return this;
   },

   lighten: function(ratio) {
      this.values.hsl[2] += this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   darken: function(ratio) {
      this.values.hsl[2] -= this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   saturate: function(ratio) {
      this.values.hsl[1] += this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   desaturate: function(ratio) {
      this.values.hsl[1] -= this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   whiten: function(ratio) {
      this.values.hwb[1] += this.values.hwb[1] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   blacken: function(ratio) {
      this.values.hwb[2] += this.values.hwb[2] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   greyscale: function() {
      var rgb = this.values.rgb;
      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      this.setValues("rgb", [val, val, val]);
      return this;
   },

   clearer: function(ratio) {
      this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
      return this;
   },

   opaquer: function(ratio) {
      this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
      return this;
   },

   rotate: function(degrees) {
      var hue = this.values.hsl[0];
      hue = (hue + degrees) % 360;
      hue = hue < 0 ? 360 + hue : hue;
      this.values.hsl[0] = hue;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   /**
    * Ported from sass implementation in C
    * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
    */
   mix: function(mixinColor, weight) {
      var color1 = this;
      var color2 = mixinColor;
      var p = weight !== undefined ? weight : 0.5;

      var w = 2 * p - 1;
      var a = color1.alpha() - color2.alpha();

      var w1 = (((w * a == -1) ? w : (w + a)/(1 + w*a)) + 1) / 2.0;
      var w2 = 1 - w1;

      return this
        .rgb(
          w1 * color1.red() + w2 * color2.red(),
          w1 * color1.green() + w2 * color2.green(),
          w1 * color1.blue() + w2 * color2.blue()
        )
        .alpha(color1.alpha() * p + color2.alpha() * (1 - p));
   },

   toJSON: function() {
     return this.rgb();
   },

   clone: function() {
     return new Color(this.rgb());
   }
}


Color.prototype.getValues = function(space) {
   var vals = {};
   for (var i = 0; i < space.length; i++) {
      vals[space.charAt(i)] = this.values[space][i];
   }
   if (this.values.alpha != 1) {
      vals["a"] = this.values.alpha;
   }
   // {r: 255, g: 255, b: 255, a: 0.4}
   return vals;
}

Color.prototype.setValues = function(space, vals) {
   var spaces = {
      "rgb": ["red", "green", "blue"],
      "hsl": ["hue", "saturation", "lightness"],
      "hsv": ["hue", "saturation", "value"],
      "hwb": ["hue", "whiteness", "blackness"],
      "cmyk": ["cyan", "magenta", "yellow", "black"]
   };

   var maxes = {
      "rgb": [255, 255, 255],
      "hsl": [360, 100, 100],
      "hsv": [360, 100, 100],
      "hwb": [360, 100, 100],
      "cmyk": [100, 100, 100, 100]
   };

   var alpha = 1;
   if (space == "alpha") {
      alpha = vals;
   }
   else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
   }
   else if (vals[space.charAt(0)] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space.charAt(i)];
      }
      alpha = vals.a;
   }
   else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
   }
   this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
   if (space == "alpha") {
      return;
   }

   // cap values of the space prior converting all values
   for (var i = 0; i < space.length; i++) {
      var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
      this.values[space][i] = Math.round(capped);
   }

   // convert to all the other color spaces
   for (var sname in spaces) {
      if (sname != space) {
         this.values[sname] = convert[space][sname](this.values[space])
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
         var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
         this.values[sname][i] = Math.round(capped);
      }
   }
   return true;
}

Color.prototype.setSpace = function(space, args) {
   var vals = args[0];
   if (vals === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof vals == "number") {
      vals = Array.prototype.slice.call(args);
   }
   this.setValues(space, vals);
   return this;
}

Color.prototype.setChannel = function(space, index, val) {
   if (val === undefined) {
      // color.red()
      return this.values[space][index];
   }
   // color.red(100)
   this.values[space][index] = val;
   this.setValues(space, this.values[space]);
   return this;
}

module.exports = Color;

},{"color-convert":3,"color-string":4}],"cookies-js":[function(require,module,exports){
/*
 * Cookies.js - 1.2.2
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],"es6-promise":[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.1.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }
    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
      var parent = this;
      var state = parent._state;

      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
        return this;
      }

      var child = new this.constructor(lib$es6$promise$$internal$$noop);
      var result = parent._result;

      if (state) {
        var callback = arguments[state - 1];
        lib$es6$promise$asap$$asap(function(){
          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$es6$promise$then$$default &&
          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (Array.isArray(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var input   = this._input;

      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$es6$promise$promise$resolve$$default) {
        var then = lib$es6$promise$$internal$$getThen(entry);

        if (then === lib$es6$promise$then$$default &&
            entry._state !== lib$es6$promise$$internal$$PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === lib$es6$promise$promise$$default) {
          var promise = new c(lib$es6$promise$$internal$$noop);
          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        this._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, this._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],"fullscreen-polyfill":[function(require,module,exports){
(function ( doc ) {
	// Use JavaScript script mode
	"use strict";

	/*global Element */

	var pollute = true,
		api,
		vendor,
		apis = {
			// http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
			w3: {
				enabled: "fullscreenEnabled",
				element: "fullscreenElement",
				request: "requestFullscreen",
				exit:    "exitFullscreen",
				events: {
					change: "fullscreenchange",
					error:  "fullscreenerror"
				}
			},
			webkit: {
				enabled: "webkitIsFullScreen",
				element: "webkitCurrentFullScreenElement",
				request: "webkitRequestFullScreen",
				exit:    "webkitCancelFullScreen",
				events: {
					change: "webkitfullscreenchange",
					error:  "webkitfullscreenerror"
				}
			},
			moz: {
				enabled: "mozFullScreenEnabled",
				element: "mozFullScreenElement",
				request: "mozRequestFullScreen",
				exit:    "mozCancelFullScreen",
				events: {
					change: "mozfullscreenchange",
					error:  "mozfullscreenerror"
				}
			},
			ms: {
				enabled: "msFullscreenEnabled",
				element: "msFullscreenElement",
				request: "msRequestFullscreen",
				exit:    "msExitFullscreen",
				events: {
					change: "MSFullscreenChange",
					error:  "MSFullscreenError"
				}
			}
		},
		w3 = apis.w3;

	// Loop through each vendor's specific API
	for (vendor in apis) {
		// Check if document has the "enabled" property
		if (apis[vendor].enabled in doc) {
			// It seems this browser support the fullscreen API
			api = apis[vendor];
			break;
		}
	}

	function dispatch( type, target ) {
		var event = doc.createEvent( "Event" );

		event.initEvent( type, true, false );
		target.dispatchEvent( event );
	} // end of dispatch()

	function handleChange( e ) {
		// Recopy the enabled and element values
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		console.log("fullscreen polyfill redispatch event", e);
		dispatch( w3.events.change, e.target );
	} // end of handleChange()

	function handleError( e ) {
		dispatch( w3.events.error, e.target );
	} // end of handleError()

	// Pollute only if the API doesn't already exists
	if (pollute && !(w3.enabled in doc) && api) {
		// Add listeners for fullscreen events
		doc.addEventListener( api.events.change, handleChange, false );
		doc.addEventListener( api.events.error,  handleError,  false );

		// Copy the default value
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		// Match the reference for exitFullscreen
		doc[w3.exit] = doc[api.exit];

		// Add the request method to the Element's prototype
		Element.prototype[w3.request] = function () {
			return this[api.request].apply( this, arguments );
		};
	}

	// Return the API found (or undefined if the Fullscreen API is unavailable)
	return api;

}( document ));

},{}],"hammerjs":[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.4';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],"matches-polyfill":[function(require,module,exports){
// ep.matchesSelector = ep.matchesSelector || ep.mozMatchesSelector ||
// 		ep.msMatchesSelector || ep.oMatchesSelector || ep.webkitMatchesSelector
(function(ep) {
	var vendors = ["ms", "moz", "webkit", "o"], x = -1;
	for (x = 0; x < vendors.length && !ep.matches; ++x) {
		ep.matches = ep[vendors[x] + "MatchesSelector"];
	}
	if (ep.matches) {
		console.log("Native Element.prototype.matches found ("+ (x? "prefix: " + vendors[x] : "unprefixed") +")");
	} else {
		console.warn("No native Element.prototype.matches found");
	}
	if (!ep.matches) {
		// @see https://gist.github.com/jonathantneal/3062955
		ep.matches = function (selector) {
			var node = this,
				nodes = (node.parentNode || node.document).querySelectorAll(selector),
				i = -1;
			while (nodes[++i] && nodes[i] != node);
			return !!nodes[i];
		};
	}
})(window.Element.prototype);

// module.exports = window.Element.prototype.matches;

},{}],"math-sign-polyfill":[function(require,module,exports){
/**
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign */

(function() {
	if (!Math.sign) {
		Math.sign = function(x) {
			// If x is NaN, the result is NaN.
			// If x is -0, the result is -0.
			// If x is +0, the result is +0.
			// If x is negative and not -0, the result is -1.
			// If x is positive and not +0, the result is +1.
			return ((x > 0) - (x < 0)) || +x;
			// A more aesthetical persuado-representation is shown below
			//
			// ( (x > 0) ? 0 : 1 )  // if x is negative then negative one
			//          +           // else (because you cant be both - and +)
			// ( (x < 0) ? 0 : -1 ) // if x is positive then positive one
			//         ||           // if x is 0, -0, or NaN, or not a number,
			//         +x           // Then the result will be x, (or) if x is
			//                      // not a number, then x converts to number
		};
	}
})();

},{}],"modernizr-dist":[function(require,module,exports){
/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-backgroundblendmode-backgroundcliptext-backgroundsize-bgpositionshorthand-bgpositionxy-bgrepeatspace_bgrepeatround-bgsizecover-bloburls-borderradius-boxshadow-boxsizing-canvas-canvasblending-canvastext-canvaswinding-classlist-contains-cssanimations-csscalc-csschunit-cssexunit-cssgradients-csspointerevents-csspositionsticky-csspseudoanimations-csspseudotransitions-cssremunit-cssresize-csstransforms-csstransforms3d-csstransitions-cssvhunit-cssvmaxunit-cssvminunit-cssvwunit-cubicbezierrange-datauri-devicemotion_deviceorientation-documentfragment-ellipsis-es6array-es6math-es6number-es6object-es6string-flexbox-flexwrap-fontface-fullscreen-generatedcontent-generators-hashchange-hiddenscroll-history-hsla-inlinesvg-json-lastchild-mediaqueries-multiplebgs-mutationobserver-nthchild-objectfit-opacity-pagevisibility-performance-pointerevents-postmessage-preserve3d-promises-queryselector-requestanimationframe-rgba-scriptasync-scriptdefer-siblinggeneral-sizes-smil-srcset-subpixelfont-supports-svg-svgasimg-svgclippaths-svgfilters-svgforeignobject-target-templatestrings-todataurljpeg_todataurlpng_todataurlwebp-userselect-video-videoautoplay-videoloop-videopreload-willchange-xhr2-xhrresponsetype-xhrresponsetypearraybuffer-xhrresponsetypeblob-hasevent-mq-prefixed-prefixedcss-dontmin-cssclassprefix:has-
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': "has-",
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;

  /**
   * Modernizr.hasEvent() detects support for a given event
   *
   * @memberof Modernizr
   * @name Modernizr.hasEvent
   * @optionName Modernizr.hasEvent()
   * @optionProp hasEvent
   * @access public
   * @function hasEvent
   * @param  {string|*} eventName - the name of an event to test for (e.g. "resize")
   * @param  {Element|string} [element=HTMLDivElement] - is the element|document|window|tagName to test on
   * @returns {boolean}
   * @example
   *  `Modernizr.hasEvent` lets you determine if the browser supports a supplied event.
   *  By default, it does this detection on a div element
   *
   * ```js
   *  hasEvent('blur') // true;
   * ```
   *
   * However, you are able to give an object as a second argument to hasEvent to
   * detect an event on something other than a div.
   *
   * ```js
   *  hasEvent('devicelight', window) // true;
   * ```
   *
   */

  var hasEvent = (function() {

    // Detect whether event support can be detected via `in`. Test on a DOM element
    // using the "blur" event b/c it should always exist. bit.ly/event-detection
    var needsFallback = !('onblur' in document.documentElement);

    function inner(eventName, element) {

      var isSupported;
      if (!eventName) { return false; }
      if (!element || typeof element === 'string') {
        element = createElement(element || 'div');
      }

      // Testing via the `in` operator is sufficient for modern browsers and IE.
      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
      // "resize", whereas `in` "catches" those.
      eventName = 'on' + eventName;
      isSupported = eventName in element;

      // Fallback technique for old Firefox - bit.ly/event-detection
      if (!isSupported && needsFallback) {
        if (!element.setAttribute) {
          // Switch to generic element if it lacks `setAttribute`.
          // It could be the `document`, `window`, or something else.
          element = createElement('div');
        }

        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] === 'function';

        if (element[eventName] !== undefined) {
          // If property was created, "remove it" by setting value to `undefined`.
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }

      return isSupported;
    }
    return inner;
  })();


  ModernizrProto.hasEvent = hasEvent;
  

  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * Modernizr.mq tests a given media query, live against the current state of the window
   * adapted from matchMedia polyfill by Scott Jehl and Paul Irish
   * gist.github.com/786768
   *
   * @memberof Modernizr
   * @name Modernizr.mq
   * @optionName Modernizr.mq()
   * @optionProp mq
   * @access public
   * @function mq
   * @param {string} mq - String of the media query we want to test
   * @returns {boolean}
   * @example
   * Modernizr.mq allows for you to programmatically check if the current browser
   * window state matches a media query.
   *
   * ```js
   *  var query = Modernizr.mq('(min-width: 900px)');
   *
   *  if (query) {
   *    // the browser window is larger than 900px
   *  }
   * ```
   *
   * Only valid media queries are supported, therefore you must always include values
   * with your media query
   *
   * ```js
   * // good
   *  Modernizr.mq('(min-width: 900px)');
   *
   * // bad
   *  Modernizr.mq('min-width');
   * ```
   *
   * If you would just like to test that media queries are supported in general, use
   *
   * ```js
   *  Modernizr.mq('only all'); // true if MQ are supported, false if not
   * ```
   *
   *
   * Note that if the browser does not support media queries (e.g. old IE) mq will
   * always return false.
   */

  var mq = (function() {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if (matchMedia) {
      return function(mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }

    return function(mq) {
      var bool = false;

      injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
        bool = (window.getComputedStyle ?
                window.getComputedStyle(node, null) :
                node.currentStyle).position == 'absolute';
      });

      return bool;
    };
  })();


  ModernizrProto.mq = mq;

  

  /**
   * If the browsers follow the spec, then they would expose vendor-specific style as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following, which would be technically incorrect:
   *   elem.style.webkitBorderRadius

   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';
  

  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  


  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  }
  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    var elems = ['modernizr', 'tspan'];
    while (!mStyle.style) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  

  /**
   * atRule returns a given CSS property at-rule (eg @keyframes), possibly in
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @memberof Modernizr
   * @name Modernizr.atRule
   * @optionName Modernizr.atRule()
   * @optionProp atRule
   * @access public
   * @function atRule
   * @param {string} prop - String name of the @-rule to test for
   * @returns {string|boolean} The string representing the (possibly prefixed)
   * valid version of the @-rule, or `false` when it is unsupported.
   * @example
   * ```js
   *  var keyframes = Modernizr.atRule('@keyframes');
   *
   *  if (keyframes) {
   *    // keyframes are supported
   *    // could be `@-webkit-keyframes` or `@keyframes`
   *  } else {
   *    // keyframes === `false`
   *  }
   * ```
   *
   */

  var atRule = function(prop) {
    var length = prefixes.length;
    var cssrule = window.CSSRule;
    var rule;

    if (typeof cssrule === 'undefined') {
      return undefined;
    }

    if (!prop) {
      return false;
    }

    // remove literal @ from beginning of provided property
    prop = prop.replace(/^@/, '');

    // CSSRules use underscores instead of dashes
    rule = prop.replace(/-/g, '_').toUpperCase() + '_RULE';

    if (rule in cssrule) {
      return '@' + prop;
    }

    for (var i = 0; i < length; i++) {
      // prefixes gives us something like -o-, and we want O_
      var prefix = prefixes[i];
      var thisRule = prefix.toUpperCase() + '_' + rule;

      if (thisRule in cssrule) {
        return '@-' + prefix.toLowerCase() + '-' + prop;
      }
    }

    return false;
  };

  ModernizrProto.atRule = atRule;

  

  /**
   * prefixed returns the prefixed or nonprefixed property name variant of your input
   *
   * @memberof Modernizr
   * @name Modernizr.prefixed
   * @optionName Modernizr.prefixed()
   * @optionProp prefixed
   * @access public
   * @function prefixed
   * @param {string} prop - String name of the property to test for
   * @param {object} [obj] - An object to test for the prefixed properties on
   * @param {HTMLElement} [elem] - An element used to test specific properties against
   * @returns {string|false} The string representing the (possibly prefixed) valid
   * version of the property, or `false` when it is unsupported.
   * @example
   *
   * Modernizr.prefixed takes a string css value in the DOM style camelCase (as
   * opposed to the css style kebab-case) form and returns the (possibly prefixed)
   * version of that property that the browser actually supports.
   *
   * For example, in older Firefox...
   * ```js
   * prefixed('boxSizing')
   * ```
   * returns 'MozBoxSizing'
   *
   * In newer Firefox, as well as any other browser that support the unprefixed
   * version would simply return `boxSizing`. Any browser that does not support
   * the property at all, it will return `false`.
   *
   * By default, prefixed is checked against a DOM element. If you want to check
   * for a property on another object, just pass it as a second argument
   *
   * ```js
   * var rAF = prefixed('requestAnimationFrame', window);
   *
   * raf(function() {
   *  renderFunction();
   * })
   * ```
   *
   * Note that this will return _the actual function_ - not the name of the function.
   * If you need the actual name of the property, pass in `false` as a third argument
   *
   * ```js
   * var rAFProp = prefixed('requestAnimationFrame', window, false);
   *
   * rafProp === 'WebkitRequestAnimationFrame' // in older webkit
   * ```
   *
   * One common use case for prefixed is if you're trying to determine which transition
   * end event to bind to, you might do something like...
   * ```js
   * var transEndEventNames = {
   *     'WebkitTransition' : 'webkitTransitionEnd', * Saf 6, Android Browser
   *     'MozTransition'    : 'transitionend',       * only for FF < 15
   *     'transition'       : 'transitionend'        * IE10, Opera, Chrome, FF 15+, Saf 7+
   * };
   *
   * var transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
   * ```
   *
   * If you want a similar lookup, but in kebab-case, you can use [prefixedCSS](#modernizr-prefixedcss).
   */

  var prefixed = ModernizrProto.prefixed = function(prop, obj, elem) {
    if (prop.indexOf('@') === 0) {
      return atRule(prop);
    }

    if (prop.indexOf('-') != -1) {
      // Convert kebab-case to camelCase
      prop = cssToDOM(prop);
    }
    if (!obj) {
      return testPropsAll(prop, 'pfx');
    } else {
      // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
      return testPropsAll(prop, obj, elem);
    }
  };

  

  /**
   * prefixedCSS is just like [prefixed](#modernizr-prefixed), but the returned values are in
   * kebab-case (e.g. `box-sizing`) rather than camelCase (boxSizing).
   *
   * @memberof Modernizr
   * @name Modernizr.prefixedCSS
   * @optionName Modernizr.prefixedCSS()
   * @optionProp prefixedCSS
   * @access public
   * @function prefixedCSS
   * @param {string} prop - String name of the property to test for
   * @returns {string|false} The string representing the (possibly prefixed)
   * valid version of the property, or `false` when it is unsupported.
   * @example
   *
   * `Modernizr.prefixedCSS` is like `Modernizr.prefixed`, but returns the result
   * in hyphenated form
   *
   * ```js
   * Modernizr.prefixedCSS('transition') // '-moz-transition' in old Firefox
   * ```
   *
   * Since it is only useful for CSS style properties, it can only be tested against
   * an HTMLElement.
   *
   * Properties can be passed as both the DOM style camelCase or CSS style kebab-case.
   */

  var prefixedCSS = ModernizrProto.prefixedCSS = function(prop) {
    var prefixedProp = prefixed(prop);
    return prefixedProp && domToCSS(prefixedProp);
  };
  
/*!
{
  "name": "Canvas",
  "property": "canvas",
  "caniuse": "canvas",
  "tags": ["canvas", "graphics"],
  "polyfills": ["flashcanvas", "excanvas", "slcanvas", "fxcanvas"]
}
!*/
/* DOC
Detects support for the `<canvas>` element for 2D drawing.
*/

  // On the S60 and BB Storm, getContext exists, but always returns undefined
  // so we actually have to call getContext() to verify
  // github.com/Modernizr/Modernizr/issues/issue/97/
  Modernizr.addTest('canvas', function() {
    var elem = createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  });

/*!
{
  "name": "canvas blending support",
  "property": "canvasblending",
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
      "name": "HTML5 Spec",
      "href": "https://dvcs.w3.org/hg/FXTF/rawfile/tip/compositing/index.html#blending"
    },
    {
      "name": "Article",
      "href": "https://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas"
    }]
}
!*/
/* DOC
Detects if Photoshop style blending modes are available in canvas.
*/


  Modernizr.addTest('canvasblending', function() {
    if (Modernizr.canvas === false) {
      return false;
    }
    var ctx = createElement('canvas').getContext('2d');
    // firefox 3 throws an error when setting an invalid `globalCompositeOperation`
    try {
      ctx.globalCompositeOperation = 'screen';
    } catch (e) {}

    return ctx.globalCompositeOperation === 'screen';
  });


/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "builderAliases": ["canvas_todataurl_type"],
  "async" : false,
  "notes": [{
    "name": "MDN article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL"
  }]
}
!*/


  var canvas = createElement('canvas');

  Modernizr.addTest('todataurljpeg', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
  });
  Modernizr.addTest('todataurlpng', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
  });
  Modernizr.addTest('todataurlwebp', function() {
    var supports = false;

    // firefox 3 throws an error when you use an "invalid" toDataUrl
    try {
      supports = !!Modernizr.canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {}

    return supports;
  });


/*!
{
  "name": "canvas winding support",
  "property": ["canvaswinding"],
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
    "name": "Article",
    "href": "https://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/"
  }]
}
!*/
/* DOC
Determines if winding rules, which controls if a path can go clockwise or counterclockwise
*/


  Modernizr.addTest('canvaswinding', function() {
    if (Modernizr.canvas === false) {
      return false;
    }
    var ctx = createElement('canvas').getContext('2d');

    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    return ctx.isPointInPath(5, 5, 'evenodd') === false;
  });


/*!
{
  "name": "Canvas text",
  "property": "canvastext",
  "caniuse": "canvas-text",
  "tags": ["canvas", "graphics"],
  "polyfills": ["canvastext"]
}
!*/
/* DOC
Detects support for the text APIs for `<canvas>` elements.
*/

  Modernizr.addTest('canvastext',  function() {
    if (Modernizr.canvas  === false) {
      return false;
    }
    return typeof createElement('canvas').getContext('2d').fillText == 'function';
  });


  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;
  
/*!
{
  "name": "CSS Animations",
  "property": "cssanimations",
  "caniuse": "css-animation",
  "polyfills": ["transformie", "csssandpaper"],
  "tags": ["css"],
  "warnings": ["Android < 4 will pass this test, but can only animate a single property at a time"],
  "notes": [{
    "name" : "Article: 'Dispelling the Android CSS animation myths'",
    "href": "https://goo.gl/OGw5Gm"
  }]
}
!*/
/* DOC
Detects whether or not elements can be animated using CSS
*/

  Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

/*!
{
  "name": "CSS Background Blend Mode",
  "property": "backgroundblendmode",
  "caniuse": "css-backgroundblendmode",
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Blend Modes could be the next big thing in Web Design",
      "href": " https://medium.com/@bennettfeely/css-blend-modes-could-be-the-next-big-thing-in-web-design-6b51bf53743a"
    }, {
      "name": "Demo",
      "href": "http://bennettfeely.com/gradients/"
    }
  ]
}
!*/
/* DOC
Detects the ability for the browser to composite backgrounds using blending modes similar to ones found in Photoshop or Illustrator.
*/

  Modernizr.addTest('backgroundblendmode', prefixed('backgroundBlendMode', 'text'));

/*!
{
  "name": "CSS Background Clip Text",
  "property": "backgroundcliptext",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Tricks Article",
      "href": "https://css-tricks.com/image-under-text/"
    },
    {
      "name": "MDN Docs",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip"
    },
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/199"
    }
  ]
}
!*/
/* DOC
Detects the ability to control specifies whether or not an element's background
extends beyond its border in CSS
*/

  Modernizr.addTest('backgroundcliptext', function() {
    return testAllProps('backgroundClip', 'text');
  });

/*!
{
  "name": "Background Position Shorthand",
  "property": "bgpositionshorthand",
  "tags": ["css"],
  "builderAliases": ["css_backgroundposition_shorthand"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/background-position"
  }, {
    "name": "W3 Spec",
    "href": "https://www.w3.org/TR/css3-background/#background-position"
  }, {
    "name": "Demo",
    "href": "https://jsfiddle.net/Blink/bBXvt/"
  }]
}
!*/
/* DOC
Detects if you can use the shorthand method to define multiple parts of an
element's background-position simultaniously.

eg `background-position: right 10px bottom 10px`
*/

  Modernizr.addTest('bgpositionshorthand', function() {
    var elem = createElement('a');
    var eStyle = elem.style;
    var val = 'right 10px bottom 10px';
    eStyle.cssText = 'background-position: ' + val + ';';
    return (eStyle.backgroundPosition === val);
  });

/*!
{
  "name": "Background Position XY",
  "property": "bgpositionxy",
  "tags": ["css"],
  "builderAliases": ["css_backgroundposition_xy"],
  "authors": ["Allan Lei", "Brandom Aaron"],
  "notes": [{
    "name": "Demo",
    "href": "https://jsfiddle.net/allanlei/R8AYS/"
  }, {
    "name": "Adapted From",
    "href": "https://github.com/brandonaaron/jquery-cssHooks/blob/master/bgpos.js"
  }]
}
!*/
/* DOC
Detects the ability to control an element's background position using css
*/

  Modernizr.addTest('bgpositionxy', function() {
    return testAllProps('backgroundPositionX', '3px', true) && testAllProps('backgroundPositionY', '5px', true);
  });

/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "tags": ["css"],
  "builderAliases": ["css_backgroundrepeat"],
  "authors": ["Ryan Seddon"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat"
  }, {
    "name": "Test Page",
    "href": "https://jsbin.com/uzesun/"
  }, {
    "name": "Demo",
    "href": "https://jsfiddle.net/ryanseddon/yMLTQ/6/"
  }]
}
!*/
/* DOC
Detects the ability to use round and space as properties for background-repeat
*/

  // Must value-test these
  Modernizr.addTest('bgrepeatround', testAllProps('backgroundRepeat', 'round'));
  Modernizr.addTest('bgrepeatspace', testAllProps('backgroundRepeat', 'space'));

/*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - https://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/

  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize', '100%', true));

/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "builderAliases": ["css_backgroundsizecover"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/

  // Must test value, as this specifically tests the `cover` value
  Modernizr.addTest('bgsizecover', testAllProps('backgroundSize', 'cover'));

/*!
{
  "name": "Border Radius",
  "property": "borderradius",
  "caniuse": "border-radius",
  "polyfills": ["css3pie"],
  "tags": ["css"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "https://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/

  Modernizr.addTest('borderradius', testAllProps('borderRadius', '0px', true));

/*!
{
  "name": "Box Shadow",
  "property": "boxshadow",
  "caniuse": "css-boxshadow",
  "tags": ["css"],
  "knownBugs": [
    "WebOS false positives on this test.",
    "The Kindle Silk browser false positives"
  ]
}
!*/

  Modernizr.addTest('boxshadow', testAllProps('boxShadow', '1px 1px', true));

/*!
{
  "name": "Box Sizing",
  "property": "boxsizing",
  "caniuse": "css3-boxsizing",
  "polyfills": ["borderboxmodel", "boxsizingpolyfill", "borderbox"],
  "tags": ["css"],
  "builderAliases": ["css_boxsizing"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/248"
  }]
}
!*/

  Modernizr.addTest('boxsizing', testAllProps('boxSizing', 'border-box', true) && (document.documentMode === undefined || document.documentMode > 7));


  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */

  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : []);

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  
/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "tags": ["css"],
  "builderAliases": ["css_calc"],
  "authors": ["@calvein"]
}
!*/
/* DOC
Method of allowing calculated values for length units. For example:

```css
//lem {
  width: calc(100% - 3em);
}
```
*/

  Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = createElement('a');

    el.style.cssText = prop + prefixes.join(value + prop);

    return !!el.style.length;
  });

/*!
{
  "name": "CSS Font ch Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "csschunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/

  Modernizr.addTest('csschunit', function() {
    var elemStyle = modElem.elem.style;
    var supports;
    try {
      elemStyle.fontSize = '3ch';
      supports = elemStyle.fontSize.indexOf('ch') !== -1;
    } catch (e) {
      supports = false;
    }
    return supports;
  });

/*!
{
  "name": "CSS Cubic Bezier Range",
  "property": "cubicbezierrange",
  "tags": ["css"],
  "builderAliases": ["css_cubicbezierrange"],
  "doc" : null,
  "authors": ["@calvein"],
  "warnings": ["cubic-bezier values can't be > 1 for Webkit until [bug #45761](https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "http://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/

  Modernizr.addTest('cubicbezierrange', function() {
    var el = createElement('a');
    el.style.cssText = prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); ');
    return !!el.style.length;
  });

/*!
{
  "name": "CSS text-overflow ellipsis",
  "property": "ellipsis",
  "caniuse": "text-overflow",
  "polyfills": [
    "text-overflow"
  ],
  "tags": ["css"]
}
!*/

  Modernizr.addTest('ellipsis', testAllProps('textOverflow', 'ellipsis'));

/*!
{
  "name": "CSS Font ex Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "cssexunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/

  Modernizr.addTest('cssexunit', function() {
    var elemStyle = modElem.elem.style;
    var supports;
    try {
      elemStyle.fontSize = '3ex';
      supports = elemStyle.fontSize.indexOf('ex') !== -1;
    } catch (e) {
      supports = false;
    }
    return supports;
  });

/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
  ]
}
!*/
/* DOC
Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
*/

  Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

/*!
{
  "name": "Flex Line Wrapping",
  "property": "flexwrap",
  "tags": ["css", "flexbox"],
  "notes": [{
    "name": "W3C Flexible Box Layout spec",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "Does not imply a modern implementation – see documentation."
  ]
}
!*/
/* DOC
Detects support for the `flex-wrap` CSS property, part of Flexbox, which isn’t present in all Flexbox implementations (notably Firefox).

This featured in both the 'tweener' syntax (implemented by IE10) and the 'modern' syntax (implemented by others). This detect will return `true` for either of these implementations, as long as the `flex-wrap` property is supported. So to ensure the modern syntax is supported, use together with `Modernizr.flexbox`:

```javascript
if (Modernizr.flexbox && Modernizr.flexwrap) {
  // Modern Flexbox with `flex-wrap` supported
}
else {
  // Either old Flexbox syntax, or `flex-wrap` not supported
}
```
*/

  Modernizr.addTest('flexwrap', testAllProps('flexWrap', 'wrap', true));


  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  
/*!
{
  "name": "@font-face",
  "property": "fontface",
  "authors": ["Diego Perini", "Mat Marquis"],
  "tags": ["css"],
  "knownBugs": [
    "False Positive: WebOS https://github.com/Modernizr/Modernizr/issues/342",
    "False Postive: WP7 https://github.com/Modernizr/Modernizr/issues/538"
  ],
  "notes": [{
    "name": "@font-face detection routine by Diego Perini",
    "href": "http://javascript.nwbox.com/CSSSupport/"
  },{
    "name": "Filament Group @font-face compatibility research",
    "href": "https://docs.google.com/presentation/d/1n4NyG4uPRjAA8zn_pSQ_Ket0RhcWC6QlZ6LMjKeECo0/edit#slide=id.p"
  },{
    "name": "Filament Grunticon/@font-face device testing results",
    "href": "https://docs.google.com/spreadsheet/ccc?key=0Ag5_yGvxpINRdHFYeUJPNnZMWUZKR2ItMEpRTXZPdUE#gid=0"
  },{
    "name": "CSS fonts on Android",
    "href": "https://stackoverflow.com/questions/3200069/css-fonts-on-android"
  },{
    "name": "@font-face and Android",
    "href": "http://archivist.incutio.com/viewlist/css-discuss/115960"
  }]
}
!*/

  var blacklist = (function() {
    var ua = navigator.userAgent;
    var wkvers = ua.match(/applewebkit\/([0-9]+)/gi) && parseFloat(RegExp.$1);
    var webos = ua.match(/w(eb)?osbrowser/gi);
    var wppre8 = ua.match(/windows phone/gi) && ua.match(/iemobile\/([0-9])+/gi) && parseFloat(RegExp.$1) >= 9;
    var oldandroid = wkvers < 533 && ua.match(/android/gi);
    return webos || oldandroid || wppre8;
  }());
  if (blacklist) {
    Modernizr.addTest('fontface', false);
  } else {
    testStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
      var style = document.getElementById('smodernizr');
      var sheet = style.sheet || style.styleSheet;
      var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
      var bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
      Modernizr.addTest('fontface', bool);
    });
  }
;
/*!
{
  "name": "CSS Generated Content",
  "property": "generatedcontent",
  "tags": ["css"],
  "warnings": ["Android won't return correct height for anything below 7px #738"],
  "notes": [{
    "name": "W3C CSS Selectors Level 3 spec",
    "href": "https://www.w3.org/TR/css3-selectors/#gen-content"
  },{
    "name": "MDN article on :before",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  },{
    "name": "MDN article on :after",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  }]
}
!*/

  testStyles('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function(node) {
    Modernizr.addTest('generatedcontent', node.offsetHeight >= 7);
  });

/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
  "notes": [{
    "name": "Webkit Gradient Syntax",
    "href": "https://webkit.org/blog/175/introducing-css-gradients/"
  },{
    "name": "Linear Gradient Syntax",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient"
  },{
    "name": "W3C Gradient Spec",
    "href": "https://drafts.csswg.org/css-images-3/#gradients"
  }]
}
!*/


  Modernizr.addTest('cssgradients', function() {

    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var css = '';
    var angle;

    for (var i = 0, len = prefixes.length - 1; i < len; i++) {
      angle = (i === 0 ? 'to ' : '');
      css += str1 + prefixes[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
    }

    if (Modernizr._config.usePrefixes) {
    // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
      css += str1 + '-webkit-' + str2;
    }

    var elem = createElement('a');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });

/*!
{
  "name": "CSS HSLA Colors",
  "caniuse": "css3-colors",
  "property": "hsla",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('hsla', function() {
    var style = createElement('a').style;
    style.cssText = 'background-color:hsla(120,40%,100%,.5)';
    return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
  });

/*!
{
  "name": "CSS :last-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "lastchild",
  "tags": ["css"],
  "builderAliases": ["css_lastchild"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/304"
  }]
}
!*/

  testStyles('#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}', function(elem) {
    Modernizr.addTest('lastchild', elem.lastChild.offsetWidth > elem.firstChild.offsetWidth);
  }, 2);

/*!
{
  "name": "CSS Media Queries",
  "caniuse": "css-mediaqueries",
  "property": "mediaqueries",
  "tags": ["css"],
  "builderAliases": ["css_mediaqueries"]
}
!*/

  Modernizr.addTest('mediaqueries', mq('only all'));

/*!
{
  "name": "CSS Multiple Backgrounds",
  "caniuse": "multibackgrounds",
  "property": "multiplebgs",
  "tags": ["css"]
}
!*/

  // Setting multiple images AND a color on the background shorthand property
  // and then querying the style.background property value for the number of
  // occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

  Modernizr.addTest('multiplebgs', function() {
    var style = createElement('a').style;
    style.cssText = 'background:url(https://),url(https://),red url(https://)';

    // If the UA supports multiple backgrounds, there should be three occurrences
    // of the string "url(" in the return value for elemStyle.background
    return (/(url\s*\(.*?){3}/).test(style.background);
  });

/*!
{
  "name": "CSS :nth-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "nthchild",
  "tags": ["css"],
  "notes": [
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/pull/685"
    },
    {
      "name": "Sitepoint :nth-child documentation",
      "href": "http://reference.sitepoint.com/css/pseudoclass-nthchild"
    }
  ],
  "authors": ["@emilchristensen"],
  "warnings": ["Known false negative in Safari 3.1 and Safari 3.2.2"]
}
!*/
/* DOC
Detects support for the ':nth-child()' CSS pseudo-selector.
*/

  // 5 `<div>` elements with `1px` width are created.
  // Then every other element has its `width` set to `2px`.
  // A Javascript loop then tests if the `<div>`s have the expected width
  // using the modulus operator.
  testStyles('#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}', function(elem) {
    var elems = elem.getElementsByTagName('div');
    var correctWidths = true;

    for (var i = 0; i < 5; i++) {
      correctWidths = correctWidths && elems[i].offsetWidth === i % 2 + 1;
    }
    Modernizr.addTest('nthchild', correctWidths);
  }, 5);

/*!
{
  "name": "CSS Object Fit",
  "caniuse": "object-fit",
  "property": "objectfit",
  "tags": ["css"],
  "builderAliases": ["css_objectfit"],
  "notes": [{
    "name": "Opera Article on Object Fit",
    "href": "https://dev.opera.com/articles/css3-object-fit-object-position/"
  }]
}
!*/

  Modernizr.addTest('objectfit', !!prefixed('objectFit'), {aliases: ['object-fit']});

/*!
{
  "name": "CSS Opacity",
  "caniuse": "css-opacity",
  "property": "opacity",
  "tags": ["css"]
}
!*/

  // Browsers that actually have CSS Opacity implemented have done so
  // according to spec, which means their return values are within the
  // range of [0.0,1.0] - including the leading zero.

  Modernizr.addTest('opacity', function() {
    var style = createElement('a').style;
    style.cssText = prefixes.join('opacity:.55;');

    // The non-literal . in this regex is intentional:
    // German Chrome returns this value as 0,55
    // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
    return (/^0.55$/).test(style.opacity);
  });

/*!
{
  "name": "CSS Pointer Events",
  "caniuse": "pointer-events",
  "property": "csspointerevents",
  "authors": ["ausi"],
  "tags": ["css"],
  "builderAliases": ["css_pointerevents"],
  "notes": [
    {
      "name": "MDN Docs",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events"
    },{
      "name": "Test Project Page",
      "href": "https://ausi.github.com/Feature-detection-technique-for-pointer-events/"
    },{
      "name": "Test Project Wiki",
      "href": "https://github.com/ausi/Feature-detection-technique-for-pointer-events/wiki"
    },
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/80"
    }
  ]
}
!*/

  Modernizr.addTest('csspointerevents', function() {
    var style = createElement('a').style;
    style.cssText = 'pointer-events:auto';
    return style.pointerEvents === 'auto';
  });

/*!
{
  "name": "CSS position: sticky",
  "property": "csspositionsticky",
  "tags": ["css"],
  "builderAliases": ["css_positionsticky"],
  "notes": [{
    "name": "Chrome bug report",
    "href":"https://code.google.com/p/chromium/issues/detail?id=322972"
  }],
  "warnings": [ "using position:sticky on anything but top aligned elements is buggy in Chrome < 37 and iOS <=7+" ]
}
!*/

  // Sticky positioning - constrains an element to be positioned inside the
  // intersection of its container box, and the viewport.
  Modernizr.addTest('csspositionsticky', function() {
    var prop = 'position:';
    var value = 'sticky';
    var el = createElement('a');
    var mStyle = el.style;

    mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

    return mStyle.position.indexOf(value) !== -1;
  });

/*!
{
  "name": "CSS Generated Content Animations",
  "property": "csspseudoanimations",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csspseudoanimations', function() {
    var result = false;

    if (!Modernizr.cssanimations || !window.getComputedStyle) {
      return result;
    }

    var styles = [
      '@', Modernizr._prefixes.join('keyframes csspseudoanimations { from { font-size: 10px; } }@').replace(/\@$/, ''),
      '#modernizr:before { content:" "; font-size:5px;',
      Modernizr._prefixes.join('animation:csspseudoanimations 1ms infinite;'),
      '}'
    ].join('');

    Modernizr.testStyles(styles, function(elem) {
      result = window.getComputedStyle(elem, ':before').getPropertyValue('font-size') === '10px';
    });

    return result;
  });

/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "caniuse": "css-transitions",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csstransitions', testAllProps('transition', 'all', true));

/*!
{
  "name": "CSS Generated Content Transitions",
  "property": "csspseudotransitions",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csspseudotransitions', function() {
    var result = false;

    if (!Modernizr.csstransitions || !window.getComputedStyle) {
      return result;
    }

    var styles =
      '#modernizr:before { content:" "; font-size:5px;' + Modernizr._prefixes.join('transition:0s 100s;') + '}' +
      '#modernizr.trigger:before { font-size:10px; }';

    Modernizr.testStyles(styles, function(elem) {
      // Force rendering of the element's styles so that the transition will trigger
      window.getComputedStyle(elem, ':before').getPropertyValue('font-size');
      elem.className += 'trigger';
      result = window.getComputedStyle(elem, ':before').getPropertyValue('font-size') === '5px';
    });

    return result;
  });

/*!
{
  "name": "CSS Font rem Units",
  "caniuse": "rem",
  "authors": ["nsfmc"],
  "property": "cssremunit",
  "tags": ["css"],
  "builderAliases": ["css_remunit"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#relative0"
  },{
    "name": "Font Size with rem by Jonathan Snook",
    "href": "http://snook.ca/archives/html_and_css/font-size-with-rem"
  }]
}
!*/

  // "The 'rem' unit ('root em') is relative to the computed
  // value of the 'font-size' value of the root element."
  // you can test by checking if the prop was ditched

  Modernizr.addTest('cssremunit', function() {
    var style = createElement('a').style;
    try {
      style.fontSize = '3rem';
    }
    catch (e) {}
    return (/rem/).test(style.fontSize);
  });

/*!
{
  "name": "CSS UI Resize",
  "property": "cssresize",
  "caniuse": "css-resize",
  "tags": ["css"],
  "builderAliases": ["css_resize"],
  "notes": [{
    "name": "W3C Specification",
    "href": "https://www.w3.org/TR/css3-ui/#resize"
  },{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/resize"
  }]
}
!*/
/* DOC
Test for CSS 3 UI "resize" property
*/

  Modernizr.addTest('cssresize', testAllProps('resize', 'both', true));

/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "https://css-tricks.com/rgba-browser-support/"
  }]
}
!*/

  Modernizr.addTest('rgba', function() {
    var style = createElement('a').style;
    style.cssText = 'background-color:rgba(150,255,150,.5)';

    return ('' + style.backgroundColor).indexOf('rgba') > -1;
  });

/*!
{
  "name": "CSS general sibling selector",
  "caniuse": "css-sel3",
  "property": "siblinggeneral",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/889"
  }]
}
!*/

  Modernizr.addTest('siblinggeneral', function() {
    return testStyles('#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}', function(elem) {
      return elem.lastChild.offsetWidth == 200;
    }, 2);
  });

/*!
{
  "name": "CSS Subpixel Fonts",
  "property": "subpixelfont",
  "tags": ["css"],
  "builderAliases": ["css_subpixelfont"],
  "authors": [
    "@derSchepp",
    "@gerritvanaaken",
    "@rodneyrehm",
    "@yatil",
    "@ryanseddon"
  ],
  "notes": [{
    "name": "Origin Test",
    "href": "https://github.com/gerritvanaaken/subpixeldetect"
  }]
}
!*/

  /*
   * (to infer if GDI or DirectWrite is used on Windows)
   */
  testStyles(
    '#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}',
  function(elem) {
    var subpixel = elem.firstChild;
    subpixel.innerHTML = 'This is a text written in Arial';
    Modernizr.addTest('subpixelfont', window.getComputedStyle ?
      window.getComputedStyle(subpixel, null).getPropertyValue('width') !== '44px'
    : false);
  }, 1, ['subpixel']);

/*!
{
  "name": "CSS Supports",
  "property": "supports",
  "caniuse": "css-featurequeries",
  "tags": ["css"],
  "builderAliases": ["css_supports"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
  },{
    "name": "Related Github Issue",
    "href": "github.com/Modernizr/Modernizr/issues/648"
  },{
    "name": "W3 Info",
    "href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
  }]
}
!*/

  var newSyntax = 'CSS' in window && 'supports' in window.CSS;
  var oldSyntax = 'supportsCSS' in window;
  Modernizr.addTest('supports', newSyntax || oldSyntax);

/*!
{
  "name": "CSS :target pseudo-class",
  "caniuse": "css-sel3",
  "property": "target",
  "tags": ["css"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:target"
  }],
  "authors": ["@zachleat"],
  "warnings": ["Opera Mini supports :target but doesn't update the hash for anchor links."]
}
!*/
/* DOC
Detects support for the ':target' CSS pseudo-class.
*/

  // querySelector
  Modernizr.addTest('target', function() {
    var doc = window.document;
    if (!('querySelectorAll' in doc)) {
      return false;
    }

    try {
      doc.querySelectorAll(':target');
      return true;
    } catch (e) {
      return false;
    }
  });

/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csstransforms', function() {
    // Android < 3.0 is buggy, so we sniff and blacklist
    // http://git.io/hHzL7w
    return navigator.userAgent.indexOf('Android 2.') === -1 &&
           testAllProps('transform', 'scale(1)', true);
  });

/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/

  Modernizr.addTest('csstransforms3d', function() {
    var ret = !!testAllProps('perspective', '1px', true);
    var usePrefix = Modernizr._config.usePrefixes;

    // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
    //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    //   some conditions. As a result, Webkit typically recognizes the syntax but
    //   will sometimes throw a false positive, thus we must do a more thorough check:
    if (ret && (!usePrefix || 'webkitPerspective' in docElement.style)) {
      var mq;
      var defaultStyle = '#modernizr{width:0;height:0}';
      // Use CSS Conditional Rules if available
      if (Modernizr.supports) {
        mq = '@supports (perspective: 1px)';
      } else {
        // Otherwise, Webkit allows this media query to succeed only if the feature is enabled.
        // `@media (transform-3d),(-webkit-transform-3d){ ... }`
        mq = '@media (transform-3d)';
        if (usePrefix) {
          mq += ',(-webkit-transform-3d)';
        }
      }

      mq += '{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}';

      testStyles(defaultStyle + mq, function(elem) {
        ret = elem.offsetWidth === 7 && elem.offsetHeight === 18;
      });
    }

    return ret;
  });

/*!
{
  "name": "CSS Transform Style preserve-3d",
  "property": "preserve3d",
  "authors": ["edmellum"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/762"
  }]
}
!*/
/* DOC
Detects support for `transform-style: preserve-3d`, for getting a proper 3D perspective on elements.
*/

  Modernizr.addTest('preserve3d', testAllProps('transformStyle', 'preserve-3d'));

/*!
{
  "name": "CSS user-select",
  "property": "userselect",
  "caniuse": "user-select-none",
  "authors": ["ryan seddon"],
  "tags": ["css"],
  "builderAliases": ["css_userselect"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/250"
  }]
}
!*/

  //https://github.com/Modernizr/Modernizr/issues/250
  Modernizr.addTest('userselect', testAllProps('userSelect', 'none', true));

/*!
{
  "name": "CSS vh unit",
  "property": "cssvhunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vhunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "Similar JSFiddle",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/

  testStyles('#modernizr { height: 50vh; }', function(elem) {
    var height = parseInt(window.innerHeight / 2, 10);
    var compStyle = parseInt((window.getComputedStyle ?
                              getComputedStyle(elem, null) :
                              elem.currentStyle).height, 10);
    Modernizr.addTest('cssvhunit', compStyle == height);
  });


  /**
   * roundedEquals takes two integers and checks if the first is within 1 of the second
   *
   * @access private
   * @function roundedEquals
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */

  function roundedEquals(a, b) {
    return a - 1 === b || a === b || a + 1 === b;
  }

  ;
/*!
{
  "name": "CSS vmax unit",
  "property": "cssvmaxunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vmaxunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JDsWQ/4/"
  }]
}
!*/

  testStyles('#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}', function(node) {
    var elem = node.childNodes[2];
    var scroller = node.childNodes[1];
    var fullSizeElem = node.childNodes[0];
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = fullSizeElem.clientWidth / 100;
    var one_vh = fullSizeElem.clientHeight / 100;
    var expectedWidth = parseInt(Math.max(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle).width, 10);

    Modernizr.addTest('cssvmaxunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 3);

/*!
{
  "name": "CSS vmin unit",
  "property": "cssvminunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vminunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JRmdq/8/"
  }]
}
!*/

  testStyles('#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}', function(node) {
    var elem = node.childNodes[2];
    var scroller = node.childNodes[1];
    var fullSizeElem = node.childNodes[0];
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = fullSizeElem.clientWidth / 100;
    var one_vh = fullSizeElem.clientHeight / 100;
    var expectedWidth = parseInt(Math.min(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle).width, 10);

    Modernizr.addTest('cssvminunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 3);

/*!
{
  "name": "CSS vw unit",
  "property": "cssvwunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vwunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/

  testStyles('#modernizr { width: 50vw; }', function(elem) {
    var width = parseInt(window.innerWidth / 2, 10);
    var compStyle = parseInt((window.getComputedStyle ?
                              getComputedStyle(elem, null) :
                              elem.currentStyle).width, 10);

    Modernizr.addTest('cssvwunit', compStyle == width);
  });

/*!
{
  "name": "will-change",
  "property": "willchange",
  "notes": [{
    "name": "Spec",
    "href": "https://drafts.csswg.org/css-will-change/"
  }]
}
!*/
/* DOC
Detects support for the `will-change` css property, which formally signals to the
browser that an element will be animating.
*/

  Modernizr.addTest('willchange', 'willChange' in docElement.style);

/*!
{
  "name": "classList",
  "caniuse": "classlist",
  "property": "classlist",
  "tags": ["dom"],
  "builderAliases": ["dataview_api"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/DOM/element.classList"
  }]
}
!*/

  Modernizr.addTest('classlist', 'classList' in docElement);

/*!
{
  "name": "Document Fragment",
  "property": "documentfragment",
  "notes": [{
    "name": "W3C DOM Level 1 Reference",
    "href": "https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-B63ED1A3"
  }, {
    "name": "SitePoint Reference",
    "href": "http://reference.sitepoint.com/javascript/DocumentFragment"
  }, {
    "name": "QuirksMode Compatibility Tables",
    "href": "http://www.quirksmode.org/m/w3c_core.html#t112"
  }],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": ["false-positive on Blackberry 9500, see QuirksMode note"],
  "tags": []
}
!*/
/* DOC
Append multiple elements to the DOM within a single insertion.
*/

  Modernizr.addTest('documentfragment', function() {
    return 'createDocumentFragment' in document &&
      'appendChild' in docElement;
  });

/*!
{
  "name": "DOM4 MutationObserver",
  "property": "mutationobserver",
  "caniuse": "mutationobserver",
  "tags": ["dom"],
  "authors": ["Karel Sedláček (@ksdlck)"],
  "polyfills": ["mutationobservers"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver"
  }]
}
!*/
/* DOC

Determines if DOM4 MutationObserver support is available.

*/

  Modernizr.addTest('mutationobserver',
    !!window.MutationObserver || !!window.WebKitMutationObserver);

/*!
{
  "name": "ES6 Array",
  "property": "es6array",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Array per specification.
*/

  Modernizr.addTest('es6array', !!(Array.prototype &&
    Array.prototype.copyWithin &&
    Array.prototype.fill &&
    Array.prototype.find &&
    Array.prototype.findIndex &&
    Array.prototype.keys &&
    Array.prototype.entries &&
    Array.prototype.values &&
    Array.from &&
    Array.of));

/*!
{
  "name": "ES5 String.prototype.contains",
  "property": "contains",
  "authors": ["Robert Kowalski"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 `String.prototype.contains` per specification.
*/

  Modernizr.addTest('contains', is(String.prototype.contains, 'function'));

/*!
{
  "name": "ES6 Generators",
  "property": "generators",
  "authors": ["Michael Kachanovskyi"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Generators per specification.
*/

  Modernizr.addTest('generators', function() {
    try {
      /* jshint evil: true */
      new Function('function* test() {}')();
    } catch (e) {
      return false;
    }
    return true;
  });

/*!
{
  "name": "ES6 Math",
  "property": "es6math",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Math per specification.
*/

  Modernizr.addTest('es6math', !!(Math &&
    Math.clz32 &&
    Math.cbrt &&
    Math.imul &&
    Math.sign &&
    Math.log10 &&
    Math.log2 &&
    Math.log1p &&
    Math.expm1 &&
    Math.cosh &&
    Math.sinh &&
    Math.tanh &&
    Math.acosh &&
    Math.asinh &&
    Math.atanh &&
    Math.hypot &&
    Math.trunc &&
    Math.fround));

/*!
{
  "name": "ES6 Number",
  "property": "es6number",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Number per specification.
*/

  Modernizr.addTest('es6number', !!(Number.isFinite &&
    Number.isInteger &&
    Number.isSafeInteger &&
    Number.isNaN &&
    Number.parseInt &&
    Number.parseFloat &&
    Number.isInteger(Number.MAX_SAFE_INTEGER) &&
    Number.isInteger(Number.MIN_SAFE_INTEGER) &&
    Number.isFinite(Number.EPSILON)));

/*!
{
  "name": "ES6 Object",
  "property": "es6object",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Object per specification.
*/

  Modernizr.addTest('es6object', !!(Object.assign &&
    Object.is &&
    Object.setPrototypeOf));

/*!
{
  "name": "ES6 Promises",
  "property": "promises",
  "caniuse": "promises",
  "polyfills": ["es6promises"],
  "authors": ["Krister Kari", "Jake Archibald"],
  "tags": ["es6"],
  "notes": [{
    "name": "The ES6 promises spec",
    "href": "https://github.com/domenic/promises-unwrapping"
  },{
    "name": "Chromium dashboard - ES6 Promises",
    "href": "https://www.chromestatus.com/features/5681726336532480"
  },{
    "name": "JavaScript Promises: There and back again - HTML5 Rocks",
    "href": "http://www.html5rocks.com/en/tutorials/es6/promises/"
  }]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Promises per specification.
*/

  Modernizr.addTest('promises', function() {
    return 'Promise' in window &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in window.Promise &&
    'reject' in window.Promise &&
    'all' in window.Promise &&
    'race' in window.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new window.Promise(function(r) { resolve = r; });
      return typeof resolve === 'function';
    }());
  });

/*!
{
  "name": "ES6 String",
  "property": "es6string",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 String per specification.
*/

  Modernizr.addTest('es6string', !!(String.fromCodePoint &&
    String.raw &&
    String.prototype.codePointAt &&
    String.prototype.repeat &&
    String.prototype.startsWith &&
    String.prototype.endsWith &&
    String.prototype.contains));

/*!
{
  "name": "Orientation and Motion Events",
  "property": ["devicemotion", "deviceorientation"],
  "caniuse": "deviceorientation",
  "notes": [{
    "name": "W3C Editor's Draft",
    "href": "http://w3c.github.io/deviceorientation/spec-source-orientation.html"
  },{
    "name": "Implementation by iOS Safari (Orientation)",
    "href": "http://goo.gl/fhce3"
  },{
    "name": "Implementation by iOS Safari (Motion)",
    "href": "http://goo.gl/rLKz8"
  }],
  "authors": ["Shi Chuan"],
  "tags": ["event"],
  "builderAliases": ["event_deviceorientation_motion"]
}
!*/
/* DOC
Part of Device Access aspect of HTML5, same category as geolocation.

`devicemotion` tests for Device Motion Event support, returns boolean value true/false.

`deviceorientation` tests for Device Orientation Event support, returns boolean value true/false
*/

  Modernizr.addTest('devicemotion', 'DeviceMotionEvent' in window);
  Modernizr.addTest('deviceorientation', 'DeviceOrientationEvent' in window);

/*!
{
  "name": "Fullscreen API",
  "property": "fullscreen",
  "caniuse": "fullscreen",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en/API/Fullscreen"
  }],
  "polyfills": ["screenfulljs"],
  "builderAliases": ["fullscreen_api"]
}
!*/
/* DOC
Detects support for the ability to make the current website take over the user's entire screen
*/

  // github.com/Modernizr/Modernizr/issues/739
  Modernizr.addTest('fullscreen', !!(prefixed('exitFullscreen', document, false) || prefixed('cancelFullScreen', document, false)));

/*!
{
  "name": "Hashchange event",
  "property": "hashchange",
  "caniuse": "hashchange",
  "tags": ["history"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.onhashchange"
  }],
  "polyfills": [
    "jquery-hashchange",
    "moo-historymanager",
    "jquery-ajaxy",
    "hasher",
    "shistory"
  ]
}
!*/
/* DOC
Detects support for the `hashchange` event, fired when the current location fragment changes.
*/

  Modernizr.addTest('hashchange', function() {
    if (hasEvent('hashchange', window) === false) {
      return false;
    }

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    return (document.documentMode === undefined || document.documentMode > 7);
  });

/*!
{
  "name": "Hidden Scrollbar",
  "property": "hiddenscroll",
  "authors": ["Oleg Korsunsky"],
  "tags": ["overlay"],
  "notes": [{
    "name": "Overlay Scrollbar description",
    "href": "https://developer.apple.com/library/mac/releasenotes/MacOSX/WhatsNewInOSX/Articles/MacOSX10_7.html#//apple_ref/doc/uid/TP40010355-SW39"
  },{
    "name": "Video example of overlay scrollbars",
    "href": "https://gfycat.com/FoolishMeaslyAtlanticsharpnosepuffer"
  }]
}
!*/
/* DOC
Detects overlay scrollbars (when scrollbars on overflowed blocks are visible). This is found most commonly on mobile and OS X.
*/

  Modernizr.addTest('hiddenscroll', function() {
    return testStyles('#modernizr {width:100px;height:100px;overflow:scroll}', function(elem) {
      return elem.offsetWidth === elem.clientWidth;
    });
  });

/*!
{
  "name": "History API",
  "property": "history",
  "caniuse": "history",
  "tags": ["history"],
  "authors": ["Hay Kranen", "Alexander Farkas"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/html51/browsers.html#the-history-interface"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.history"
  }],
  "polyfills": ["historyjs", "html5historyapi"]
}
!*/
/* DOC
Detects support for the History API for manipulating the browser session history.
*/

  Modernizr.addTest('history', function() {
    // Issue #733
    // The stock browser on Android 2.2 & 2.3, and 4.0.x returns positive on history support
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(
    var ua = navigator.userAgent;

    // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
    if ((ua.indexOf('Android 2.') !== -1 ||
        (ua.indexOf('Android 4.0') !== -1)) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
      return false;
    }

    // Return the regular check
    return (window.history && 'pushState' in window.history);
  });


  /**
   * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
   *
   * @author kangax
   * @access private
   * @function hasOwnProp
   * @param {object} object - The object to check for a property
   * @param {string} property - The property to check for
   * @returns {boolean}
   */

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    /* istanbul ignore else */
    /* we have no way of testing IE 5.5 or safari 2,
     * so just assume the else gets hit */
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  ;


   // _l tracks listeners for async tests, as well as tests that execute after the initial run
  ModernizrProto._l = {};

  /**
   * Modernizr.on is a way to listen for the completion of async tests. Being
   * asynchronous, they may not finish before your scripts run. As a result you
   * will get a possibly false negative `undefined` value.
   *
   * @memberof Modernizr
   * @name Modernizr.on
   * @access public
   * @function on
   * @param {string} feature - String name of the feature detect
   * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
   * @example
   *
   * ```js
   * Modernizr.on('flash', function( result ) {
   *   if (result) {
   *    // the browser has flash
   *   } else {
   *     // the browser does not have flash
   *   }
   * });
   * ```
   */

  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }

    // Push this test on to the listener list
    this._l[feature].push(cb);

    // If it's already been resolved, trigger it on next tick
    if (Modernizr.hasOwnProperty(feature)) {
      // Next Tick
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  /**
   * _trigger is the private function used to signal test completion and run any
   * callbacks registered through [Modernizr.on](#modernizr-on)
   *
   * @memberof Modernizr
   * @name Modernizr._trigger
   * @access private
   * @function _trigger
   * @param {string} feature - string name of the feature detect
   * @param {function|boolean} [res] - A feature detection function, or the boolean =
   * result of a feature detection function
   */

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    // Don't trigger these again
    delete this._l[feature];
  };

  /**
   * addTest allows you to define your own feature detects that are not currently
   * included in Modernizr (under the covers it's the exact same code Modernizr
   * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
   * will be added onto the Modernizr object, as well as an appropriate className set on
   * the html element when configured to do so
   *
   * @memberof Modernizr
   * @name Modernizr.addTest
   * @optionName Modernizr.addTest()
   * @optionProp addTest
   * @access public
   * @function addTest
   * @param {string|object} feature - The string name of the feature detect, or an
   * object of feature detect names and test
   * @param {function|boolean} test - Function returning true if feature is supported,
   * false if not. Otherwise a boolean representing the results of a feature detection
   * @example
   *
   * The most common way of creating your own feature detects is by calling
   * `Modernizr.addTest` with a string (preferably just lowercase, without any
   * punctuation), and a function you want executed that will return a boolean result
   *
   * ```js
   * Modernizr.addTest('itsTuesday', function() {
   *  var d = new Date();
   *  return d.getDay() === 2;
   * });
   * ```
   *
   * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
   * and to `false` every other day of the week. One thing to notice is that the names of
   * feature detect functions are always lowercased when added to the Modernizr object. That
   * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
   *
   *
   *  Since we only look at the returned value from any feature detection function,
   *  you do not need to actually use a function. For simple detections, just passing
   *  in a statement that will return a boolean value works just fine.
   *
   * ```js
   * Modernizr.addTest('hasJquery', 'jQuery' in window);
   * ```
   *
   * Just like before, when the above runs `Modernizr.hasjquery` will be true if
   * jQuery has been included on the page. Not using a function saves a small amount
   * of overhead for the browser, as well as making your code much more readable.
   *
   * Finally, you also have the ability to pass in an object of feature names and
   * their tests. This is handy if you want to add multiple detections in one go.
   * The keys should always be a string, and the value can be either a boolean or
   * function that returns a boolean.
   *
   * ```js
   * var detects = {
   *  'hasjquery': 'jQuery' in window,
   *  'itstuesday': function() {
   *    var d = new Date();
   *    return d.getDay() === 2;
   *  }
   * }
   *
   * Modernizr.addTest(detects);
   * ```
   *
   * There is really no difference between the first methods and this one, it is
   * just a convenience to let you write more readable code.
   */

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];

      // Again, we don't check for parent test existence. Get that right, though.
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }

      if (typeof last != 'undefined') {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      // Set the value (this is the magic, right here).
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        // cast to a Boolean, if not one already
        /* jshint -W053 */
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }

        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }

      // Set a single class (either `feature` or `no-feature`)
      /* jshint -W041 */
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);
      /* jshint +W041 */

      // Trigger the event
      Modernizr._trigger(feature, test);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  

/*!
{
  "name": "sizes attribute",
  "async": true,
  "property": "sizes",
  "tags": ["image"],
  "authors": ["Mat Marquis"],
  "notes": [{
    "name": "Spec",
    "href": "http://picture.responsiveimages.org/#parse-sizes-attr"
    },{
    "name": "Usage Details",
    "href": "http://ericportis.com/posts/2014/srcset-sizes/"
    }]
}
!*/
/* DOC
Test for the `sizes` attribute on images
*/

  Modernizr.addAsyncTest(function() {
    var width1, width2, test;
    var image = createElement('img');
    // in a perfect world this would be the test...
    var isSizes = 'sizes' in image;

    // ... but we need to deal with Safari 9...
    if (!isSizes && ('srcset' in  image)) {
      width2 = 'data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==';
      width1 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

      test = function() {
        addTest('sizes', image.width == 2);
      };

      image.onload = test;
      image.onerror = test;
      image.setAttribute('sizes', '9px');

      image.srcset = width1 + ' 1w,' + width2 + ' 8w';
      image.src = width1;
    } else {
      addTest('sizes', isSizes);
    }
  });

/*!
{
  "name": "srcset attribute",
  "property": "srcset",
  "tags": ["image"],
  "notes": [{
    "name": "Smashing Magazine Article",
    "href": "https://en.wikipedia.org/wiki/APNG"
    },{
    "name": "Generate multi-resolution images for srcset with Grunt",
    "href": "https://addyosmani.com/blog/generate-multi-resolution-images-for-srcset-with-grunt/"
    }]
}
!*/
/* DOC
Test for the srcset attribute of images
*/

  Modernizr.addTest('srcset', 'srcset' in createElement('img'));

/*!
{
  "name": "JSON",
  "property": "json",
  "caniuse": "json",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Glossary/JSON"
  }],
  "polyfills": ["json2"]
}
!*/
/* DOC
Detects native support for JSON handling functions.
*/

  // this will also succeed if you've loaded the JSON2.js polyfill ahead of time
  //   ... but that should be obvious. :)

  Modernizr.addTest('json', 'JSON' in window && 'parse' in JSON && 'stringify' in JSON);

/*!
{
  "name": "XHR responseType",
  "property": "xhrresponsetype",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType.
*/

  Modernizr.addTest('xhrresponsetype', (function() {
    if (typeof XMLHttpRequest == 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    return 'response' in xhr;
  }()));


  /**
   * http://mathiasbynens.be/notes/xhr-responsetype-json#comment-4
   *
   * @access private
   * @function testXhrType
   * @param {string} type - String name of the XHR type you want to detect
   * @returns {boolean}
   * @author Mathias Bynens
   */

  /* istanbul ignore next */
  var testXhrType = function(type) {
    if (typeof XMLHttpRequest == 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    try {
      xhr.responseType = type;
    } catch (error) {
      return false;
    }
    return 'response' in xhr && xhr.responseType == type;
  };

  
/*!
{
  "name": "XHR responseType='arraybuffer'",
  "property": "xhrresponsetypearraybuffer",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
*/

  Modernizr.addTest('xhrresponsetypearraybuffer', testXhrType('arraybuffer'));

/*!
{
  "name": "XHR responseType='blob'",
  "property": "xhrresponsetypeblob",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='blob'.
*/

  Modernizr.addTest('xhrresponsetypeblob', testXhrType('blob'));

/*!
{
  "name": "XML HTTP Request Level 2 XHR2",
  "property": "xhr2",
  "tags": ["network"],
  "builderAliases": ["network_xhr2"],
  "notes": [{
    "name": "W3 Spec",
    "href": "https://www.w3.org/TR/XMLHttpRequest2/"
  },{
    "name": "Details on Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/385"
  }]
}
!*/
/* DOC
Tests for XHR2.
*/

  // all three of these details report consistently across all target browsers:
  //   !!(window.ProgressEvent);
  //   'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest
  Modernizr.addTest('xhr2', 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest());

/*!
{
  "name": "Page Visibility API",
  "property": "pagevisibility",
  "caniuse": "pagevisibility",
  "tags": ["performance"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API"
  },{
    "name": "W3C spec",
    "href": "https://www.w3.org/TR/2011/WD-page-visibility-20110602/"
  },{
    "name": "HTML5 Rocks tutorial",
    "href": "http://www.html5rocks.com/en/tutorials/pagevisibility/intro/"
  }],
  "polyfills": ["visibilityjs", "visiblyjs", "jquery-visibility"]
}
!*/
/* DOC
Detects support for the Page Visibility API, which can be used to disable unnecessary actions and otherwise improve user experience.
*/

  Modernizr.addTest('pagevisibility', !!prefixed('hidden', document, false));

/*!
{
  "name": "Navigation Timing API",
  "property": "performance",
  "caniuse": "nav-timing",
  "tags": ["performance"],
  "authors": ["Scott Murphy (@uxder)"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/navigation-timing/"
  },{
    "name": "HTML5 Rocks article",
    "href": "http://www.html5rocks.com/en/tutorials/webperformance/basics/"
  }],
  "polyfills": ["perfnow"]
}
!*/
/* DOC
Detects support for the Navigation Timing API, for measuring browser and connection performance.
*/

  Modernizr.addTest('performance', !!prefixed('performance', window));

/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [
    {
      "name": "W3C spec",
      "href": "https://www.w3.org/TR/pointerevents/"
    }
  ],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["handjs"]
}
!*/
/* DOC
Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+.
*/

  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
  Modernizr.addTest('pointerevents', function() {
    // Cannot use `.prefixed()` for events, so test each prefix
    var bool = false,
    i = domPrefixes.length;

    // Don't forget un-prefixed...
    bool = Modernizr.hasEvent('pointerdown');

    while (i-- && !bool) {
      if (hasEvent(domPrefixes[i] + 'pointerdown')) {
        bool = true;
      }
    }
    return bool;
  });

/*!
{
  "name": "postMessage",
  "property": "postmessage",
  "caniuse": "x-doc-messaging",
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/html5/comms.html#posting-messages"
  }],
  "polyfills": ["easyxdm", "postmessage-jquery"]
}
!*/
/* DOC
Detects support for the `window.postMessage` protocol for cross-document messaging.
*/

  Modernizr.addTest('postmessage', 'postMessage' in window);

/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"],
  "notes": [{
    "name" : "W3C Selectors reference",
    "href": "https://www.w3.org/TR/selectors-api/#queryselectorall"
  }],
  "polyfills": ["css-selector-engine"]
}
!*/
/* DOC
Detects support for querySelector.
*/

  Modernizr.addTest('queryselector', 'querySelector' in document && 'querySelectorAll' in document);

/*!
{
  "name": "requestAnimationFrame",
  "property": "requestanimationframe",
  "aliases": ["raf"],
  "caniuse": "requestanimationframe",
  "tags": ["animation"],
  "authors": ["Addy Osmani"],
  "notes": [{
    "name": "W3C spec",
    "href": "https://www.w3.org/TR/animation-timing/"
  }],
  "polyfills": ["raf"]
}
!*/
/* DOC
Detects support for the `window.requestAnimationFrame` API, for offloading animation repainting to the browser for optimized performance.
*/

  Modernizr.addTest('requestanimationframe', !!prefixed('requestAnimationFrame', window), {aliases: ['raf']});

/*!
{
  "name": "script[async]",
  "property": "scriptasync",
  "caniuse": "script-async",
  "tags": ["script"],
  "builderAliases": ["script_async"],
  "authors": ["Theodoor van Donge"]
}
!*/
/* DOC
Detects support for the `async` attribute on the `<script>` element.
*/

  Modernizr.addTest('scriptasync', 'async' in createElement('script'));

/*!
{
  "name": "script[defer]",
  "property": "scriptdefer",
  "caniuse": "script-defer",
  "tags": ["script"],
  "builderAliases": ["script_defer"],
  "authors": ["Theodoor van Donge"],
  "warnings": ["Browser implementation of the `defer` attribute vary: https://stackoverflow.com/questions/3952009/defer-attribute-chrome#answer-3982619"],
  "knownBugs": ["False positive in Opera 12"]
}
!*/
/* DOC
Detects support for the `defer` attribute on the `<script>` element.
*/

  Modernizr.addTest('scriptdefer', 'defer' in createElement('script'));

/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
/* DOC
Detects support for SVG in `<embed>` or `<object>` elements.
*/

  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

/*!
{
  "name": "SVG as an <img> tag source",
  "property": "svgasimg",
  "caniuse" : "svg-img",
  "tags": ["svg"],
  "authors": ["Chris Coyier"],
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element"
  }]
}
!*/


  // Original Async test by Stu Cox
  // https://gist.github.com/chriscoyier/8774501

  // Now a Sync test based on good results here
  // http://codepen.io/chriscoyier/pen/bADFx

  // Note http://www.w3.org/TR/SVG11/feature#Image is *supposed* to represent
  // support for the `<image>` tag in SVG, not an SVG file linked from an `<img>`
  // tag in HTML – but it’s a heuristic which works
  Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));


  /**
   * Object.prototype.toString can be used with every object and allows you to
   * get its class easily. Abstracting it off of an object prevents situations
   * where the toString property has been overridden
   *
   * @access private
   * @function toStringFn
   * @returns {function} An abstracted toString function
   */

  var toStringFn = ({}).toString;
  
/*!
{
  "name": "SVG clip paths",
  "property": "svgclippaths",
  "tags": ["svg"],
  "notes": [{
    "name": "Demo",
    "href": "http://srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg"
  }]
}
!*/
/* DOC
Detects support for clip paths in SVG (only, not on HTML content).

See [this discussion](https://github.com/Modernizr/Modernizr/issues/213) regarding applying SVG clip paths to HTML content.
*/

  Modernizr.addTest('svgclippaths', function() {
    return !!document.createElementNS &&
      /SVGClipPath/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')));
  });

/*!
{
  "name": "SVG filters",
  "property": "svgfilters",
  "caniuse": "svg-filters",
  "tags": ["svg"],
  "builderAliases": ["svg_filters"],
  "authors": ["Erik Dahlstrom"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/filters.html"
  }]
}
!*/

  // Should fail in Safari: https://stackoverflow.com/questions/9739955/feature-detecting-support-for-svg-filters.
  Modernizr.addTest('svgfilters', function() {
    var result = false;
    try {
      result = 'SVGFEColorMatrixElement' in window &&
        SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
    }
    catch (e) {}
    return result;
  });

/*!
{
  "name": "SVG foreignObject",
  "property": "svgforeignobject",
  "tags": ["svg"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/extend.html"
  }]
}
!*/
/* DOC
Detects support for foreignObject tag in SVG.
*/

  Modernizr.addTest('svgforeignobject', function() {
    return !!document.createElementNS &&
      /SVGForeignObject/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')));
  });

/*!
{
  "name": "Inline SVG",
  "property": "inlinesvg",
  "caniuse": "svg-html5",
  "tags": ["svg"],
  "notes": [{
    "name": "Test page",
    "href": "https://paulirish.com/demo/inline-svg"
  }, {
    "name": "Test page and results",
    "href": "https://codepen.io/eltonmesquita/full/GgXbvo/"
  }],
  "polyfills": ["inline-svg-polyfill"],
  "knownBugs": ["False negative on some Chromia browsers."]
}
!*/
/* DOC
Detects support for inline SVG in HTML (not within XHTML).
*/

  Modernizr.addTest('inlinesvg', function() {
    var div = createElement('div');
    div.innerHTML = '<svg/>';
    return (typeof SVGRect != 'undefined' && div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
  });

/*!
{
  "name": "SVG SMIL animation",
  "property": "smil",
  "caniuse": "svg-smil",
  "tags": ["svg"],
  "notes": [{
  "name": "W3C Synchronised Multimedia spec",
  "href": "https://www.w3.org/AudioVideo/"
  }]
}
!*/

  // SVG SMIL animation
  Modernizr.addTest('smil', function() {
    return !!document.createElementNS &&
      /SVGAnimate/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'animate')));
  });

/*!
{
  "name": "Template strings",
  "property": "templatestrings",
  "notes": [{
    "name": "MDN Reference",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings#Browser_compatibility"
  }]
}
!*/
/* DOC
Template strings are string literals allowing embedded expressions.
*/

  Modernizr.addTest('templatestrings', function() {
    var supports;
    try {
      // A number of tools, including uglifyjs and require, break on a raw "`", so
      // use an eval to get around that.
      eval('``');
      supports = true;
    } catch (e) {}
    return !!supports;
  });

/*!
{
  "name": "Blob URLs",
  "property": "bloburls",
  "caniuse": "bloburls",
  "notes": [{
    "name": "W3C Working Draft",
    "href": "https://www.w3.org/TR/FileAPI/#creating-revoking"
  }],
  "tags": ["file", "url"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Detects support for creating Blob URLs
*/

  var url = prefixed('URL', window, false);
  url = url && window[url];
  Modernizr.addTest('bloburls', url && 'revokeObjectURL' in url && 'createObjectURL' in url);

/*!
{
  "name": "Data URI",
  "property": "datauri",
  "caniuse": "datauri",
  "tags": ["url"],
  "builderAliases": ["url_data_uri"],
  "async": true,
  "notes": [{
    "name": "Wikipedia article",
    "href": "https://en.wikipedia.org/wiki/Data_URI_scheme"
  }],
  "warnings": ["Support in Internet Explorer 8 is limited to images and linked resources like CSS files, not HTML files"]
}
!*/
/* DOC
Detects support for data URIs. Provides a subproperty to report support for data URIs over 32kb in size:

```javascript
Modernizr.datauri           // true
Modernizr.datauri.over32kb  // false in IE8
```
*/

  // https://github.com/Modernizr/Modernizr/issues/14
  Modernizr.addAsyncTest(function() {
    /* jshint -W053 */

    // IE7 throw a mixed content warning on HTTPS for this test, so we'll
    // just blacklist it (we know it doesn't support data URIs anyway)
    // https://github.com/Modernizr/Modernizr/issues/362
    if (navigator.userAgent.indexOf('MSIE 7.') !== -1) {
      // Keep the test async
      setTimeout(function() {
        addTest('datauri', false);
      }, 10);
    }

    var datauri = new Image();

    datauri.onerror = function() {
      addTest('datauri', false);
    };
    datauri.onload = function() {
      if (datauri.width == 1 && datauri.height == 1) {
        testOver32kb();
      }
      else {
        addTest('datauri', false);
      }
    };

    datauri.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    // Once we have datauri, let's check to see if we can use data URIs over
    // 32kb (IE8 can't). https://github.com/Modernizr/Modernizr/issues/321
    function testOver32kb() {

      var datauriBig = new Image();

      datauriBig.onerror = function() {
        addTest('datauri', true);
        Modernizr.datauri = new Boolean(true);
        Modernizr.datauri.over32kb = false;
      };
      datauriBig.onload = function() {
        addTest('datauri', true);
        Modernizr.datauri = new Boolean(true);
        Modernizr.datauri.over32kb = (datauriBig.width == 1 && datauriBig.height == 1);
      };

      var base64str = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      while (base64str.length < 33000) {
        base64str = '\r\n' + base64str;
      }
      datauriBig.src = 'data:image/gif;base64,' + base64str;
    }

  });

/*!
{
  "name": "HTML5 Video",
  "property": "video",
  "caniuse": "video",
  "tags": ["html5"],
  "knownBugs": [
    "Without QuickTime, `Modernizr.video.h264` will be `undefined`; https://github.com/Modernizr/Modernizr/issues/546"
  ],
  "polyfills": [
    "html5media",
    "mediaelementjs",
    "sublimevideo",
    "videojs",
    "leanbackplayer",
    "videoforeverybody"
  ]
}
!*/
/* DOC
Detects support for the video element, as well as testing what types of content it supports.

Subproperties are provided to describe support for `ogg`, `h264` and `webm` formats, e.g.:

```javascript
Modernizr.video         // true
Modernizr.video.ogg     // 'probably'
```
*/

  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

  Modernizr.addTest('video', function() {
    /* jshint -W053 */
    var elem = createElement('video');
    var bool = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
      if (bool = !!elem.canPlayType) {
        bool = new Boolean(bool);
        bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

        // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
        bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');

        bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');

        bool.vp9 = elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');

        bool.hls = elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
      }
    } catch (e) {}

    return bool;
  });

/*!
{
  "name": "Video Autoplay",
  "property": "videoautoplay",
  "tags": ["video"],
  "async" : true,
  "warnings": ["This test is very large – only include it if you absolutely need it"],
  "knownBugs": ["crashes with an alert on iOS7 when added to homescreen"]
}
!*/
/* DOC
Checks for support of the autoplay attribute of the video element.
*/


  Modernizr.addAsyncTest(function() {
    var timeout;
    var waitTime = 300;
    var elem = createElement('video');
    var elemStyle = elem.style;

    function testAutoplay(arg) {
      clearTimeout(timeout);
      elem.removeEventListener('playing', testAutoplay, false);
      addTest('videoautoplay', arg && arg.type === 'playing' || elem.currentTime !== 0);
      elem.parentNode.removeChild(elem);
    }

    //skip the test if video itself, or the autoplay
    //element on it isn't supported
    if (!Modernizr.video || !('autoplay' in elem)) {
      addTest('videoautoplay', false);
      return;
    }

    elemStyle.position = 'absolute';
    elemStyle.height = 0;
    elemStyle.width = 0;

    try {
      if (Modernizr.video.ogg) {
        elem.src = 'data:video/ogg;base64,T2dnUwACAAAAAAAAAABmnCATAAAAAHDEixYBKoB0aGVvcmEDAgEAAQABAAAQAAAQAAAAAAAFAAAAAQAAAAAAAAAAAGIAYE9nZ1MAAAAAAAAAAAAAZpwgEwEAAAACrA7TDlj///////////////+QgXRoZW9yYSsAAABYaXBoLk9yZyBsaWJ0aGVvcmEgMS4xIDIwMDkwODIyIChUaHVzbmVsZGEpAQAAABoAAABFTkNPREVSPWZmbXBlZzJ0aGVvcmEtMC4yOYJ0aGVvcmG+zSj3uc1rGLWpSUoQc5zmMYxSlKQhCDGMYhCEIQhAAAAAAAAAAAAAEW2uU2eSyPxWEvx4OVts5ir1aKtUKBMpJFoQ/nk5m41mUwl4slUpk4kkghkIfDwdjgajQYC8VioUCQRiIQh8PBwMhgLBQIg4FRba5TZ5LI/FYS/Hg5W2zmKvVoq1QoEykkWhD+eTmbjWZTCXiyVSmTiSSCGQh8PB2OBqNBgLxWKhQJBGIhCHw8HAyGAsFAiDgUCw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDAwPEhQUFQ0NDhESFRUUDg4PEhQVFRUOEBETFBUVFRARFBUVFRUVEhMUFRUVFRUUFRUVFRUVFRUVFRUVFRUVEAwLEBQZGxwNDQ4SFRwcGw4NEBQZHBwcDhATFhsdHRwRExkcHB4eHRQYGxwdHh4dGxwdHR4eHh4dHR0dHh4eHRALChAYKDM9DAwOExo6PDcODRAYKDlFOA4RFh0zV1A+EhYlOkRtZ00YIzdAUWhxXDFATldneXhlSFxfYnBkZ2MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEhIVGRoaGhoSFBYaGhoaGhUWGRoaGhoaGRoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhESFh8kJCQkEhQYIiQkJCQWGCEkJCQkJB8iJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQREhgvY2NjYxIVGkJjY2NjGBo4Y2NjY2MvQmNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRISEhUXGBkbEhIVFxgZGxwSFRcYGRscHRUXGBkbHB0dFxgZGxwdHR0YGRscHR0dHhkbHB0dHR4eGxwdHR0eHh4REREUFxocIBERFBcaHCAiERQXGhwgIiUUFxocICIlJRcaHCAiJSUlGhwgIiUlJSkcICIlJSUpKiAiJSUlKSoqEBAQFBgcICgQEBQYHCAoMBAUGBwgKDBAFBgcICgwQEAYHCAoMEBAQBwgKDBAQEBgICgwQEBAYIAoMEBAQGCAgAfF5cdH1e3Ow/L66wGmYnfIUbwdUTe3LMRbqON8B+5RJEvcGxkvrVUjTMrsXYhAnIwe0dTJfOYbWrDYyqUrz7dw/JO4hpmV2LsQQvkUeGq1BsZLx+cu5iV0e0eScJ91VIQYrmqfdVSK7GgjOU0oPaPOu5IcDK1mNvnD+K8LwS87f8Jx2mHtHnUkTGAurWZlNQa74ZLSFH9oF6FPGxzLsjQO5Qe0edcpttd7BXBSqMCL4k/4tFrHIPuEQ7m1/uIWkbDMWVoDdOSuRQ9286kvVUlQjzOE6VrNguN4oRXYGkgcnih7t13/9kxvLYKQezwLTrO44sVmMPgMqORo1E0sm1/9SludkcWHwfJwTSybR4LeAz6ugWVgRaY8mV/9SluQmtHrzsBtRF/wPY+X0JuYTs+ltgrXAmlk10xQHmTu9VSIAk1+vcvU4ml2oNzrNhEtQ3CysNP8UeR35wqpKUBdGdZMSjX4WVi8nJpdpHnbhzEIdx7mwf6W1FKAiucMXrWUWVjyRf23chNtR9mIzDoT/6ZLYailAjhFlZuvPtSeZ+2oREubDoWmT3TguY+JHPdRVSLKxfKH3vgNqJ/9emeEYikGXDFNzaLjvTeGAL61mogOoeG3y6oU4rW55ydoj0lUTSR/mmRhPmF86uwIfzp3FtiufQCmppaHDlGE0r2iTzXIw3zBq5hvaTldjG4CPb9wdxAme0SyedVKczJ9AtYbgPOzYKJvZZImsN7ecrxWZg5dR6ZLj/j4qpWsIA+vYwE+Tca9ounMIsrXMB4Stiib2SPQtZv+FVIpfEbzv8ncZoLBXc3YBqTG1HsskTTotZOYTG+oVUjLk6zhP8bg4RhMUNtfZdO7FdpBuXzhJ5Fh8IKlJG7wtD9ik8rWOJxy6iQ3NwzBpQ219mlyv+FLicYs2iJGSE0u2txzed++D61ZWCiHD/cZdQVCqkO2gJpdpNaObhnDfAPrT89RxdWFZ5hO3MseBSIlANppdZNIV/Rwe5eLTDvkfWKzFnH+QJ7m9QWV1KdwnuIwTNtZdJMoXBf74OhRnh2t+OTGL+AVUnIkyYY+QG7g9itHXyF3OIygG2s2kud679ZWKqSFa9n3IHD6MeLv1lZ0XyduRhiDRtrNnKoyiFVLcBm0ba5Yy3fQkDh4XsFE34isVpOzpa9nR8iCpS4HoxG2rJpnRhf3YboVa1PcRouh5LIJv/uQcPNd095ickTaiGBnWLKVWRc0OnYTSyex/n2FofEPnDG8y3PztHrzOLK1xo6RAml2k9owKajOC0Wr4D5x+3nA0UEhK2m198wuBHF3zlWWVKWLN1CHzLClUfuoYBcx4b1llpeBKmbayaR58njtE9onD66lUcsg0Spm2snsb+8HaJRn4dYcLbCuBuYwziB8/5U1C1DOOz2gZjSZtrLJk6vrLF3hwY4Io9xuT/ruUFRSBkNtUzTOWhjh26irLEPx4jPZL3Fo3QrReoGTTM21xYTT9oFdhTUIvjqTkfkvt0bzgVUjq/hOYY8j60IaO/0AzRBtqkTS6R5ellZd5uKdzzhb8BFlDdAcrwkE0rbXTOPB+7Y0FlZO96qFL4Ykg21StJs8qIW7h16H5hGiv8V2Cflau7QVDepTAHa6Lgt6feiEvJDM21StJsmOH/hynURrKxvUpQ8BH0JF7BiyG2qZpnL/7AOU66gt+reLEXY8pVOCQvSsBtqZTNM8bk9ohRcwD18o/WVkbvrceVKRb9I59IEKysjBeTMmmbA21xu/6iHadLRxuIzkLpi8wZYmmbbWi32RVAUjruxWlJ//iFxE38FI9hNKOoCdhwf5fDe4xZ81lgREhK2m1j78vW1CqkuMu/AjBNK210kzRUX/B+69cMMUG5bYrIeZxVSEZISmkzbXOi9yxwIfPgdsov7R71xuJ7rFcACjG/9PzApqFq7wEgzNJm2suWESPuwrQvejj7cbnQxMkxpm21lUYJL0fKmogPPqywn7e3FvB/FCNxPJ85iVUkCE9/tLKx31G4CgNtWTTPFhMvlu8G4/TrgaZttTChljfNJGgOT2X6EqpETy2tYd9cCBI4lIXJ1/3uVUllZEJz4baqGF64yxaZ+zPLYwde8Uqn1oKANtUrSaTOPHkhvuQP3bBlEJ/LFe4pqQOHUI8T8q7AXx3fLVBgSCVpMba55YxN3rv8U1Dv51bAPSOLlZWebkL8vSMGI21lJmmeVxPRwFlZF1CpqCN8uLwymaZyjbXHCRytogPN3o/n74CNykfT+qqRv5AQlHcRxYrC5KvGmbbUwmZY/29BvF6C1/93x4WVglXDLFpmbapmF89HKTogRwqqSlGbu+oiAkcWFbklC6Zhf+NtTLFpn8oWz+HsNRVSgIxZWON+yVyJlE5tq/+GWLTMutYX9ekTySEQPLVNQQ3OfycwJBM0zNtZcse7CvcKI0V/zh16Dr9OSA21MpmmcrHC+6pTAPHPwoit3LHHqs7jhFNRD6W8+EBGoSEoaZttTCZljfduH/fFisn+dRBGAZYtMzbVMwvul/T/crK1NQh8gN0SRRa9cOux6clC0/mDLFpmbarmF8/e6CopeOLCNW6S/IUUg3jJIYiAcDoMcGeRbOvuTPjXR/tyo79LK3kqqkbxkkMRAOB0GODPItnX3Jnxro/25Ud+llbyVVSN4ySGIgHA6DHBnkWzr7kz410f7cqO/Syt5KqpFVJwn6gBEvBM0zNtZcpGOEPiysW8vvRd2R0f7gtjhqUvXL+gWVwHm4XJDBiMpmmZtrLfPwd/IugP5+fKVSysH1EXreFAcEhelGmbbUmZY4Xdo1vQWVnK19P4RuEnbf0gQnR+lDCZlivNM22t1ESmopPIgfT0duOfQrsjgG4tPxli0zJmF5trdL1JDUIUT1ZXSqQDeR4B8mX3TrRro/2McGeUvLtwo6jIEKMkCUXWsLyZROd9P/rFYNtXPBli0z398iVUlVKAjFlY437JXImUTm2r/4ZYtMy61hf16RPJIU9nZ1MABAwAAAAAAAAAZpwgEwIAAABhp658BScAAAAAAADnUFBQXIDGXLhwtttNHDhw5OcpQRMETBEwRPduylKVB0HRdF0A';
      }
      else if (Modernizr.video.h264) {
        elem.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==';
      }
      else {
        addTest('videoautoplay', false);
        return;
      }
    }

    catch (e) {
      addTest('videoautoplay', false);
      return;
    }

    elem.setAttribute('autoplay', '');
    elem.style.cssText = 'display:none';
    docElement.appendChild(elem);
    // wait for the next tick to add the listener, otherwise the element may
    // not have time to play in high load situations (e.g. the test suite)
    setTimeout(function() {
      elem.addEventListener('playing', testAutoplay, false);
      timeout = setTimeout(testAutoplay, waitTime);
    }, 0);
  });

/*!
{
  "name": "Video Loop Attribute",
  "property": "videoloop",
  "tags": ["video", "media"]
}
!*/

  Modernizr.addTest('videoloop', 'loop' in createElement('video'));

/*!
{
  "name": "Video Preload Attribute",
  "property": "videopreload",
  "tags": ["video", "media"]
}
!*/

  Modernizr.addTest('videopreload', 'preload' in createElement('video'));


  // Run each test
  testRunner();

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);
},{}],"raf-polyfill":[function(require,module,exports){
(function() {
	var vendors = ["ms", "moz", "webkit", "o"], x = -1;
	for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] ||
				window[vendors[x] + "CancelRequestAnimationFrame"];
	}
	if (window.requestAnimationFrame) {
		console.log("Native window.requestAnimationFrame found ("+ (x? "prefix: " + vendors[x] : "unprefixed") +")");
	} else {
		console.warn("No native window.requestAnimationFrame found");
	}
	if (!window.requestAnimationFrame) {
		// (function() {
		// 	var FPS = 1000/60;
		// 	window.requestAnimationFrame = function (callback) {
		// 		return window.setTimeout(callback, FPS);
		// 	};
		// })();
		(function() {
			var lastTime = 0;
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function() {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		})();
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			window.clearTimeout(id);
		};
	}
})();

// module.exports = window.requestAnimationFrame;

},{}],"underscore":[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],"webfontloader":[function(require,module,exports){
/* Web Font Loader v1.6.24 - (c) Adobe Systems, Google. License: Apache 2.0 */
(function(){function aa(a,b,d){return a.call.apply(a.bind,arguments)}function ba(a,b,d){if(!a)throw Error();if(2<arguments.length){var c=Array.prototype.slice.call(arguments,2);return function(){var d=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(d,c);return a.apply(b,d)}}return function(){return a.apply(b,arguments)}}function p(a,b,d){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.m=b||a;this.c=this.m.document}var da=!!window.FontFace;function t(a,b,d,c){b=a.c.createElement(b);if(d)for(var e in d)d.hasOwnProperty(e)&&("style"==e?b.style.cssText=d[e]:b.setAttribute(e,d[e]));c&&b.appendChild(a.c.createTextNode(c));return b}function u(a,b,d){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(d,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,d){b=b||[];d=d||[];for(var c=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<c.length;g+=1)if(b[e]===c[g]){f=!0;break}f||c.push(b[e])}b=[];for(e=0;e<c.length;e+=1){f=!1;for(g=0;g<d.length;g+=1)if(c[e]===d[g]){f=!0;break}f||b.push(c[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var d=a.className.split(/\s+/),c=0,e=d.length;c<e;c++)if(d[c]==b)return!0;return!1}
function z(a){if("string"===typeof a.f)return a.f;var b=a.m.location.protocol;"about:"==b&&(b=a.a.location.protocol);return"https:"==b?"https:":"http:"}function ea(a){return a.m.location.hostname||a.a.location.hostname}
function A(a,b,d){function c(){k&&e&&f&&(k(g),k=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,k=d||null;da?(b.onload=function(){e=!0;c()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");c()}):setTimeout(function(){e=!0;c()},0);u(a,"head",b)}
function B(a,b,d,c){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,d&&d(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,d&&d(Error("Script load timeout")))},c||5E3);return f}return null};function C(){this.a=0;this.c=null}function D(a){a.a++;return function(){a.a--;E(a)}}function F(a,b){a.c=b;E(a)}function E(a){0==a.a&&a.c&&(a.c(),a.c=null)};function G(a){this.a=a||"-"}G.prototype.c=function(a){for(var b=[],d=0;d<arguments.length;d++)b.push(arguments[d].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function H(a,b){this.c=a;this.f=4;this.a="n";var d=(b||"n4").match(/^([nio])([1-9])$/i);d&&(this.a=d[1],this.f=parseInt(d[2],10))}function fa(a){return I(a)+" "+(a.f+"00")+" 300px "+J(a.c)}function J(a){var b=[];a=a.split(/,\s*/);for(var d=0;d<a.length;d++){var c=a[d].replace(/['"]/g,"");-1!=c.indexOf(" ")||/^\d/.test(c)?b.push("'"+c+"'"):b.push(c)}return b.join(",")}function K(a){return a.a+a.f}function I(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,d="n",c=null;a&&((c=a.match(/(normal|oblique|italic)/i))&&c[1]&&(d=c[1].substr(0,1).toLowerCase()),(c=a.match(/([1-9]00|normal|bold)/i))&&c[1]&&(/bold/i.test(c[1])?b=7:/[1-9]00/.test(c[1])&&(b=parseInt(c[1].substr(0,1),10))));return d+b};function ha(a,b){this.c=a;this.f=a.m.document.documentElement;this.h=b;this.a=new G("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);L(a,"loading")}function M(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),d=[],c=[a.a.c("wf","loading")];b||d.push(a.a.c("wf","inactive"));w(a.f,d,c)}L(a,"inactive")}function L(a,b,d){if(a.j&&a.h[b])if(d)a.h[b](d.c,K(d));else a.h[b]()};function ja(){this.c={}}function ka(a,b,d){var c=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&c.push(f(b[e],d))}return c};function N(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function O(a){u(a.c,"body",a.a)}function P(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+J(a.c)+";"+("font-style:"+I(a)+";font-weight:"+(a.f+"00")+";")};function Q(a,b,d,c,e,f){this.g=a;this.j=b;this.a=c;this.c=d;this.f=e||3E3;this.h=f||void 0}Q.prototype.start=function(){var a=this.c.m.document,b=this,d=q(),c=new Promise(function(c,e){function k(){q()-d>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?c():setTimeout(k,25)},function(){e()})}k()}),e=new Promise(function(a,c){setTimeout(c,b.f)});Promise.race([e,c]).then(function(){b.g(b.a)},function(){b.j(b.a)})};function R(a,b,d,c,e,f,g){this.v=a;this.B=b;this.c=d;this.a=c;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.o=this.j=this.h=this.g=null;this.g=new N(this.c,this.s);this.h=new N(this.c,this.s);this.j=new N(this.c,this.s);this.o=new N(this.c,this.s);a=new H(this.a.c+",serif",K(this.a));a=P(a);this.g.a.style.cssText=a;a=new H(this.a.c+",sans-serif",K(this.a));a=P(a);this.h.a.style.cssText=a;a=new H("serif",K(this.a));a=P(a);this.j.a.style.cssText=a;a=new H("sans-serif",K(this.a));a=
P(a);this.o.a.style.cssText=a;O(this.g);O(this.h);O(this.j);O(this.o)}var S={D:"serif",C:"sans-serif"},T=null;function U(){if(null===T){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);T=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return T}R.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.o.a.offsetWidth;this.A=q();la(this)};
function ma(a,b,d){for(var c in S)if(S.hasOwnProperty(c)&&b===a.f[S[c]]&&d===a.f[S[c]])return!0;return!1}function la(a){var b=a.g.a.offsetWidth,d=a.h.a.offsetWidth,c;(c=b===a.f.serif&&d===a.f["sans-serif"])||(c=U()&&ma(a,b,d));c?q()-a.A>=a.w?U()&&ma(a,b,d)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):na(a):V(a,a.v)}function na(a){setTimeout(p(function(){la(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.o.a);b(this.a)},a),0)};function W(a,b,d){this.c=a;this.a=b;this.f=0;this.o=this.j=!1;this.s=d}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,K(a).toString(),"active")],[b.a.c("wf",a.c,K(a).toString(),"loading"),b.a.c("wf",a.c,K(a).toString(),"inactive")]);L(b,"fontactive",a);this.o=!0;oa(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var d=y(b.f,b.a.c("wf",a.c,K(a).toString(),"active")),c=[],e=[b.a.c("wf",a.c,K(a).toString(),"loading")];d||c.push(b.a.c("wf",a.c,K(a).toString(),"inactive"));w(b.f,c,e)}L(b,"fontinactive",a);oa(this)};function oa(a){0==--a.f&&a.j&&(a.o?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),L(a,"active")):M(a.a))};function pa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}pa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;qa(this,new ha(this.c,a),a)};
function ra(a,b,d,c,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,k=c||null||{};if(0===d.length&&f)M(b.a);else{b.f+=d.length;f&&(b.j=f);var h,m=[];for(h=0;h<d.length;h++){var l=d[h],n=k[l.c],r=b.a,x=l;r.g&&w(r.f,[r.a.c("wf",x.c,K(x).toString(),"loading")]);L(r,"fontloading",x);r=null;null===X&&(X=window.FontFace?(x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent))?42<parseInt(x[1],10):!0:!1);X?r=new Q(p(b.g,b),p(b.h,b),b.c,l,b.s,n):r=new R(p(b.g,b),p(b.h,b),b.c,l,b.s,a,
n);m.push(r)}for(h=0;h<m.length;h++)m[h].start()}},0)}function qa(a,b,d){var c=[],e=d.timeout;ia(b);var c=ka(a.a,d,a.c),f=new W(a.c,b,e);a.h=c.length;b=0;for(d=c.length;b<d;b++)c[b].load(function(b,c,d){ra(a,f,b,c,d)})};function sa(a,b){this.c=a;this.a=b}function ta(a,b,d){var c=z(a.c);a=(a.a.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+a+"/"+b+".js"+(d?"?v="+d:"")}
sa.prototype.load=function(a){function b(){if(e["__mti_fntLst"+d]){var c=e["__mti_fntLst"+d](),g=[],k;if(c)for(var h=0;h<c.length;h++){var m=c[h].fontfamily;void 0!=c[h].fontStyle&&void 0!=c[h].fontWeight?(k=c[h].fontStyle+c[h].fontWeight,g.push(new H(m,k))):g.push(new H(m))}a(g)}else setTimeout(function(){b()},50)}var d=this.a.projectId,c=this.a.version;if(d){var e=this.c.m;B(this.c,ta(this,d,c),function(c){c?a([]):b()}).id="__MonotypeAPIScript__"+d}else a([])};function ua(a,b){this.c=a;this.a=b}ua.prototype.load=function(a){var b,d,c=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new C;b=0;for(d=c.length;b<d;b++)A(this.c,c[b],D(g));var k=[];b=0;for(d=e.length;b<d;b++)if(c=e[b].split(":"),c[1])for(var h=c[1].split(","),m=0;m<h.length;m+=1)k.push(new H(c[0],h[m]));else k.push(new H(c[0]));F(g,function(){a(k,f)})};function va(a,b,d){a?this.c=a:this.c=b+wa;this.a=[];this.f=[];this.g=d||""}var wa="//fonts.googleapis.com/css";function xa(a,b){for(var d=b.length,c=0;c<d;c++){var e=b[c].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function ya(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,d=[],c=0;c<b;c++)d.push(a.a[c].replace(/ /g,"+"));b=a.c+"?family="+d.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function za(a){this.f=a;this.a=[];this.c={}}
var Aa={latin:"BESbswy",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Ba={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ca={i:"i",italic:"i",n:"n",normal:"n"},Da=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Ea(a){for(var b=a.f.length,d=0;d<b;d++){var c=a.f[d].split(":"),e=c[0].replace(/\+/g," "),f=["n4"];if(2<=c.length){var g;var k=c[1];g=[];if(k)for(var k=k.split(","),h=k.length,m=0;m<h;m++){var l;l=k[m];if(l.match(/^[\w-]+$/)){var n=Da.exec(l.toLowerCase());if(null==n)l="";else{l=n[2];l=null==l||""==l?"n":Ca[l];n=n[1];if(null==n||""==n)n="4";else var r=Ba[n],n=r?r:isNaN(n)?"4":n.substr(0,1);l=[l,n].join("")}}else l="";l&&g.push(l)}0<g.length&&(f=g);3==c.length&&(c=c[2],g=[],c=c?c.split(","):
g,0<c.length&&(c=Aa[c[0]])&&(a.c[e]=c))}a.c[e]||(c=Aa[e])&&(a.c[e]=c);for(c=0;c<f.length;c+=1)a.a.push(new H(e,f[c]))}};function Fa(a,b){this.c=a;this.a=b}var Ga={Arimo:!0,Cousine:!0,Tinos:!0};Fa.prototype.load=function(a){var b=new C,d=this.c,c=new va(this.a.api,z(d),this.a.text),e=this.a.families;xa(c,e);var f=new za(e);Ea(f);A(d,ya(c),D(b));F(b,function(){a(f.a,f.c,Ga)})};function Ha(a,b){this.c=a;this.a=b}Ha.prototype.load=function(a){var b=this.a.id,d=this.c.m;b?B(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(d.Typekit&&d.Typekit.config&&d.Typekit.config.fn){b=d.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],k=b[f+1],h=0;h<k.length;h++)e.push(new H(g,k[h]));try{d.Typekit.load({events:!1,classes:!1,async:!0})}catch(m){}a(e)}},2E3):a([])};function Ia(a,b){this.c=a;this.f=b;this.a=[]}Ia.prototype.load=function(a){var b=this.f.id,d=this.c.m,c=this;b?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[b]=function(b,d){for(var g=0,k=d.fonts.length;g<k;++g){var h=d.fonts[g];c.a.push(new H(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(c.a)},B(this.c,z(this.c)+(this.f.api||"//f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new pa(window);Y.a.c.custom=function(a,b){return new ua(b,a)};Y.a.c.fontdeck=function(a,b){return new Ia(b,a)};Y.a.c.monotype=function(a,b){return new sa(b,a)};Y.a.c.typekit=function(a,b){return new Ha(b,a)};Y.a.c.google=function(a,b){return new Fa(b,a)};var Z={load:p(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());


},{}]},{},[39]);
