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

  Array.prototype.sum = function() {
    return this.reduce(function(a,b) {return a+b})
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


  function pad_left(snum, n) {
    for(var c = 0; c < n; ++c) 
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

  function remove_decimals(snum) {
    var res = ''
    for(var c = 0; c < snum.length; ++c) {
      if (snum[c] != '.') {
        res += snum[c]
      }
    }

    return res
  }

  /** Shift the decimal point by n pos to the left
   *
   */
  function shift_decimal_left(snum, n) {
    if (n == 0)
      return snum

    if (snum.indexOf('.') == -1) {
      snum += '.'
    }

    var decimalPos = snum.indexOf('.')

    var reals = decimalPos
    if (reals <= n) { //add enough places
      snum = pad_left(snum, n-reals+1)
      reals = snum.indexOf('.')
    }

    var sresult = ''
    //Copy places after the point 
    while(snum[snum.length-1] != '.') {
      sresult = snum[snum.length-1] + sresult
      snum = snum.substr(0, snum.length-1)
    }

    //Remove decimal point
    snum = snum.substr(0, snum.length-1)

    //Now copy n numbers from snum
    for(var c = 0; c < n; ++c) {
      sresult = snum[snum.length-1] + sresult
      snum = snum.substr(0, snum.length-1)
    }

    //Now add decimal place
    sresult = '.' + sresult

    //Copy remaining places
    while(snum.length > 0) {
      sresult = snum[snum.length-1] + sresult
      snum = snum.substr(0, snum.length-1)
    }

    return sresult
  }


  function normalize(snum) {
    //cut off initial zeroes
    while(snum[0] == '0' && snum.length > 1 && snum[1] != '.') {
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


  function add_all(snums) {
    var maxdecimals = snums.map(decimal_places).max()
    snums = snums.map(function(s) { return pad_decimals_to(s,maxdecimals) })
    var maxLength = snums.map(function(x) { return x.length }).max() + 3
    //Pad to length + 3 for carry (should be enoug in most cases)
    snums = snums.map(function(s) { return pad_left_to(s,maxLength) })
    var carry = 0
    var sresult = ''
    if (maxdecimals > 0) { //Decimal addition
      for(var c = 0; c < maxdecimals; ++c) {
        var ints = snums.map(function(s) { return s[maxLength-1-c] }).map(parseInt)
        ints.push(carry)
        var res = ints.sum()
        sresult = (res%10) + sresult
        carry = parseInt(res/10)
      }
      sresult = '.' + sresult
    }

    var realLength = maxLength - sresult.length

    for(var c = 0; c < realLength; ++c) {
      var ints = snums.map(function(s) { return s[realLength-1-c] }).map(parseInt)
      ints.push(carry)
      var res = ints.sum()
      sresult = (res%10) + sresult
      carry = parseInt(res/10)
    }

    return normalize(sresult)
  }

  function add(num1, num2) {
    var snums = [num1,num2].map(snum)
    return add_all(snums)
  }

  function h_mult(sn1,sn2) {
    return ''+(parseInt(sn1) * parseInt(sn2))
  }

  function multiply(num1, num2) {
    var snums = [num1,num2].map(snum)
    var totalDecimals = snums.map(decimal_places).sum()
    snums = snums.map(remove_decimals)

    //...
    var summands = []

    var snum1 = snums[0]
    var snum2 = snums[1]
    var sl1 = snum1.length
    var sl2 = snum2.length

    for(var c = 0; c < sl1; ++c) {
      for(var d = 0; d < sl2; ++d) {
        var x1 = snum1[sl1-c-1]
        var x2 = snum2[sl2-d-1]
        var r = h_mult(x1,x2)
        summands.push(pad_right(r, c+d))
      }
    }

    var sresult = add_all(summands)
    
    //divide by 10^totalDecimals
    sresult = shift_decimal_left(sresult, totalDecimals)

    return normalize(sresult)
  }



  var smath = {
    'add':add,
    'mul':multiply,

    'norm':normalize
  }

  return smath;
})()