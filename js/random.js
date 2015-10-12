// the initial seed
Math.seed = 0;

// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
}


Math.opRand = function(options) {
  var min = options.min || 0
  var max = options.max || 1
  var step = options.step || 1

  var delta = (max - min) / step

  return (parseInt(Math.seededRandom(delta+1, 0)) * step + min)
}