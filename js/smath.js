document.smath = (function() {

  function id(x) { return x }

  Array.prototype.reduce = function(fn) {
    var result = this[0]
    for(var c = 1; c < this.length; ++c)
      result = fn(result, this[c])
    
    return result
  }


  Array.prototype.map = function (fn) {
    var result = []
    for(var c = 0; c < this.length; ++c)
      result.push(fn(this[c]))

    return result
  }

  Array.prototype.maxBy = function(fn) {
    return this.reduce(function(a,b) {
      return fn(a) >= fn(b) ? a : b
    })
  }

  Array.prototype.max = function() {
    return this.maxBy(id)
  }

  /** This function will pad snum with 
   *  zeroes until it reaches n characters
   */
  function pad_left_to(snum, n) {
    while (snum.length < n)
      snum = '0' + snum
    
    return snum
  }

  /** This function will pad n zeroes on the right
   *  side of the number
   */
  function pad_right(snum, n) {
    for(var c = 0; c < n; ++c) 
      snum += '0'

    return snum
  }


  /** This function will add a decimal point if not
   *  present and then fill them with zeros
   */
  function pad_decimals_to(snum, n) {
    var places = decimal_places(snum)

    if (places >= n)
      return snum

    if (snum.indexOf('.') == -1) {
      snum += '.'
    }

    return pad_right(snum, n-places)
  }

  function decimal_places(snum) {
    if (snum.indexOf('.') == -1)
      return 0
    else
      return snum.length - snum.indexOf('.') - 1
  }

  function normalize(snum) {
    //cut off initial zeroes
    while(snum[0] == '0') {
      snum = snum.substr(1)
    }

    //cut off trailing zeroes
    if (snum.indexOf('.') != -1) {
      while(snum[snum.length-1] == '0') {
        snum = snum.substr(0, snum.length-1)
      }

      if (snum[snum.length-1] == '.')
        snum = snum.substr(0, snum.length-1)
    }

    return snum
  }

  function snum(num) { return ''+num }

  function add(num1, num2) {
    var snums = [num1,num2].map(snum)
    var maxdecimals = snums.map(decimal_places).max()
    snums = snums.map(function(s) { return pad_decimals_to(s,maxdecimals) })
    var maxLength = snums.map(function(x) { return x.length }).max() + 1
    //Pad to length + 1 for carry
    snums = snums.map(function(s) { return pad_left_to(s,maxLength) })
    var carry = 0
    var sresult = ''
    if (maxdecimals > 0) { //Decimal addition
      for(var c = 0; c < maxdecimals; ++c) {
        var ints = snums.map(function(s) { return s[maxLength-1-c] }).map(parseInt)
        ints.push(carry)
        var res = ints.reduce(function(a,b) { return a+b })
        sresult = (res%10) + sresult
        carry = parseInt(res/10)
      }
      sresult = '.' + sresult
    }

    var realLength = maxLength - sresult.length

    for(var c = 0; c < realLength; ++c) {
      var ints = snums.map(function(s) { return s[realLength-1-c] }).map(parseInt)
      ints.push(carry)
      var res = ints.reduce(function(a,b) { return a+b })
      sresult = (res%10) + sresult
      carry = parseInt(res/10)
    }

    return normalize(sresult)
  }



  var smath = {
    'add':add,


    'norm':normalize

  }

  return smath;
})()