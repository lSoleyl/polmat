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
    replace.html(frac.html()) //Copy content from top element
    frac.replaceWith(replace)
  })  

  $("mid").each(function(i,element) {
    var mid = $(element)
    var replace = $('<span class="center"></span>')
    replace.html(mid.html()) //Copy content from top element
    mid.replaceWith(replace)
  })


  $("input.equiv").replaceWith($('<span class="center">&nbsp;&nbsp;&nbsp;&nbsp;<=>&nbsp;&nbsp;&nbsp;&nbsp;</span>'))
})