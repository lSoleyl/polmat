$(function() {
  //Replace <equals/> with <span class="center">&nbsp;=&nbsp;</span>

  $("input.eq").replaceWith($('<span class="center">&nbsp;&nbsp;=&nbsp;&nbsp;</span>'))


  $("var").each(function(i,element) {
    var e = $(element)

    var replace = $('<span class="variable">' + e.text() + '</span>')
    if (e.attr('name'))
      replace.attr({'name':e.attr('name')})

    e.replaceWith(replace)
  })

  $("const").each(function(i,element) {
    var e = $(element)
    var replace = $('<span class="constant">' + e.text() + '</span>')
    if (e.attr('name'))
      replace.attr({'name':e.attr('name')})
    e.replaceWith(replace)
  })

  $("top").each(function(i, element) {
    var top = $(element)
    var replace = $('<span class="top"></span>')
    replace.html(top.html()) //Copy content from top element
    top.replaceWith(replace)
  })

  $("bottom").each(function(i, element) {
    var bottom = $(element)
    var replace = $('<span class="bottom"></span>')
    replace.html(bottom.html()) //Copy content from top element
    bottom.replaceWith(replace)
  })

  $("frac").each(function(i, element) {
    var frac = $(element)
    var replace = $('<span class="fraction"></span>')
    if (frac.attr('class')) 
      replace.addClass(frac.attr('class'))
    replace.html(frac.html()) //Copy content from top element
    frac.replaceWith(replace)
  })  

  $("mid").each(function(i,element) {
    var mid = $(element)
    var replace = $('<span class="center"></span>')
    replace.html(mid.html()) //Copy content from top element
    mid.replaceWith(replace)
  })


  $("if").each(function(i,element) {
    var iff = $(element)
    var replace = $('<span type="if"></span>')
    replace.html(iff.html())
    replace.attr({name:iff.attr('name'), value:iff.attr('value')})
    iff.replaceWith(replace)
  })

  $("ifnot").each(function(i,element) {
    var iff = $(element)
    var replace = $('<span type="ifnot"></span>')
    replace.html(iff.html())
    replace.attr({name:iff.attr('name'), value:iff.attr('value')})
    iff.replaceWith(replace)
  })

  $("input.equiv").replaceWith($('<span class="center">&nbsp;&nbsp;&nbsp;&nbsp;<=>&nbsp;&nbsp;&nbsp;&nbsp;</span>'))
})


document.updateUI = function() {
  var display = document.smath.display

  $("span.variable[name]").each(function(i,element) { //Update values
    var varSpan = $(element)
    var div = varSpan.closest("div[ex]")
    if (!div) {
      console.error("Missing parent excercise div for following element:")
      console.log(element)
    } else {
      var excercise = div.attr('ex')
      var varName = varSpan.attr('name')
      varSpan.text(display(document.variables[excercise][varName]))
    }
  })

  $("span.constant[name]").each(function(i,element) { //Set constants
    var constSpan = $(element)
    var varName = constSpan.attr('name')

    constSpan.text(display(document.constants[varName]))
  })

  //Update conditional elements
  $("span[type=if]").each(function(i,element) {
    var cdiv = $(element)
    var div = cdiv.closest("div[ex]")
    if (!div) {
      console.error("Missing parent excercise div for following element:")
      console.log(element)
    } else {
      var excercise = div.attr('ex')
      var varName = cdiv.attr('name')
      var value = cdiv.attr('value')
      if (value == display(document.variables[excercise][varName])) {
        cdiv.css({'display':''})
      } else {
        cdiv.css({'display':'none'})
      }
    }

  })

  $("span[type=ifnot]").each(function(i,element) {
    var cdiv = $(element)
    var div = cdiv.closest("div[ex]")
    if (!div) {
      console.error("Missing parent excercise div for following element:")
      console.log(element)
    } else {
      var excercise = div.attr('ex')
      var varName = cdiv.attr('name')
      var value = cdiv.attr('value')
      if (value != display(document.variables[excercise][varName])) {
        cdiv.css({'display':''})
      } else {
        cdiv.css({'display':'none'})
      }
    }

  })
}