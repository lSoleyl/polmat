document.smath = (function() {

  function id(x) { return x }

  /** Returns true if snum1 < snum2
   *  Only defined for integral numbers
   */
  function less(snum1, snum2) {
    return parseInt(snum1) < parseInt(snum2)
  }

  /** Less for all numbers
   */
  function less_decimal(snum1, snum2) {
    return parseFloat(snum1) < parseFloat(snum2)
  }

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


  function pair(q,r,d) { return { q:q, r:r, d:d }}

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

  /** Moves the decimal point right by n 
   *  columns. Equals snum * 10^n
   */
  function shift_decimal_right(snum, n) {
    if (n == 0) 
      return snum

    var snum = pad_decimals_to(snum, n)
    var decimals = decimal_places(snum)

    var beforeDecimal = snum.indexOf('.')
    var sresult = snum.substr(0,beforeDecimal)
    if (sresult == '0') 
      sresult = ''
    sresult += snum.substr(beforeDecimal+1,n)
    if (decimals > n) {
      sresult += '.'
      var decimalsLeft = decimals - n
      sresult += snum.substr(-decimalsLeft, decimalsLeft)
    }

    return sresult
  }


  function equalize_snums(snums) {
    var maxdecimals = snums.map(decimal_places).max()
    snums = snums.map(function(s) { return pad_decimals_to(s, maxdecimals) })
    var maxLength = snums.map(function(s) { return s.length }).max()
    return snums.map(function(s) { return pad_left_to(s, maxLength) })
  }

  /** Normalizes the look of decimal numbers
   */
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
    //Make all summands equal in length and pad 2 zeroes at front for carry
    snums = equalize_snums(snums).map(function(s) { return pad_left(s,2) })
    var maxdecimals = decimal_places(snums[0])
    var maxLength = snums[0].length
    
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

  function divide(num1, num2) {
    var snums = [num1, num2].map(snum)
    if (snums[0] == "0") {
      return pair('0','0')
    } else if (snums[1] == "0") {
      throw "Division by zero!"
    }

    var maxdecs = snums.map(decimal_places).max()
    snums = snums.map(function(s) { return shift_decimal_right(s,maxdecs) })
    
    var divisor = snums[0]
    var divby = snums[1]

    
    var cdiv = ''
    var sresult = ''

    while(divisor.length > 0) { //Division loop
      //Pull digit
      cdiv += divisor[0]
      divisor = divisor.substr(1)

      //Try to divide
      if (less(cdiv, divby)) { //No division possible
        sresult += '0'
      } else { //Division possible
        sresult += parseInt(parseInt(cdiv)/parseInt(divby))
        cdiv = snum(parseInt(cdiv) % parseInt(divby))
      }  
    }

    return pair(normalize(sresult), cdiv, divby)
  }

  function fdiv(num1, num2, precision) {
    var precision = precision || 3
    var result = divide(num1,num2) 

    if (parseInt(result.r) == 0)
      return result.q

    var sresult = result.q + '.'
    //Execute division loop after decimal sign
    var cdiv = result.r
    var divby = result.d

    for(var c = 0; c < precision+1; ++c) {
      cdiv += '0' //Take next zero

      if (less(cdiv, divby)) { //No division possible
        sresult += '0'
      } else {
        sresult += parseInt(parseInt(cdiv)/parseInt(divby))
        cdiv = snum(parseInt(cdiv) % parseInt(divby))
      }

      if (cdiv == '0') {
        return sresult
      }
    }

    //Number doesn't fit within specified precision (round last position)
    if ((sresult[sresult.length-1] - '0') < 5) {
      sresult = sresult.substr(0, sresult.length-1) //Cut off last digit
    } else { //Add 0.xxxx1 to sresult
      sresult = sresult.substr(0, sresult.length-1) //Cut off last digit
      var decs = decimal_places(sresult)
      var rounder = pad_decimals_to(snum(0), decs-1) + '1'
      sresult = add(sresult, rounder)
    }

    return sresult
  }

  /** Calculate a-b
   */
  function subtract(num1, num2) {
    var snums = equalize_snums([num1,num2].map(snum))
    var sign = ''
    if (less_decimal(snums[0], snums[1])) {
      sign='-' //Result will be negative
      snums = [snums[1], snums[0]] //Swap places
    }

    var sresult = ''
    var carry = 0

    var a = snums[0] //a-b
    var b = snums[1]

    for(var c = a.length-1; c >= 0; --c) {
      if (a[c] == '.') {
        sresult = '.' + sresult
      } else { //Normal digit subtraction
        var da = parseInt(a[c])
        var db = parseInt(b[c]) + carry

        if (db > da) {
          da += 10
          carry = 1
        } else {
          carry = 0
        }

        sresult = (da-db)  + sresult
      }
    }


    return sign + normalize(sresult)
  }


  function display(num) {
    var s = snum(num).replace('.',',') //Use european decimal sign

    //Insert space every three digits before the decimal sign
    var sign = s.indexOf(',')
    var result = ''

    if (sign != -1) {
      result = s.substr(sign) //Copy all digits after the decimal sign (including the sign)
      s = s.substr(0,sign)
    }

    for(var c = 0; c < s.length; ++c) {
      if (c%3 == 0 && c != 0) 
        result = ' ' + result

      result = s[s.length-c-1] + result
    }


    return result
  }


  var smath = {
    'add':add,
    'mul':multiply,
    'divr':divide,
    'sub':subtract,
    'div':fdiv,

    'norm':normalize,
    'display':display,

  }

  return smath;
})()