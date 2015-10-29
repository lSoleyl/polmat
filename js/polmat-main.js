requirejs.config({
  paths: {
    'jquery':'jquery-2.1.4',
    'bootstrap':'bootstrap.min'
  }
})

/** Main entry point for this application
 */
require(['polmat-html', 'jquery', 'ex-data', 'seed-storage', 'bootstrap'], function(phtml, $, data, seed){
  //Recalculate the excercise data and redisplay it
  function reloadVariables() {
    data.reload(parseInt($("#seed").val()))
    phtml.updateValues()
  }

  //Wait for document to be ready
  $(function() {
    //Expand custom html elements like
    phtml.expand()

    //Synchronize seed storage with input field
    $('#seed').val(seed() || (new Date()).getTime())
    seed($('#seed').val())

    //Set recalc button handler
    $('#recalc').click(function() {
      seed($('#seed').val())
      reloadVariables()
    })

    //Set button handler for new seed
    $('#new-seed').click(function() {
      $('#seed').val((new Date()).getTime())
      seed($('#seed').val())
      reloadVariables()
    })

    //Initial variable calculation and display
    reloadVariables()

    //Make content visible now, since scripts are done loading
    $('#content').removeClass('hidden')
    $('#loading').addClass('hidden')
  })
})