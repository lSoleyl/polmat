//Depends on js/random.js


//Constants
document.constants = {
  '100km':100
}

//Default values
document.variables = {
  '1': { //Exercise one
    'usage':6,
    'distance':250,
    'fuel':24,
    'res0':2.5,
    'res1':15,
    'res2':4,
    'res3':400
  }
}

//This function calculates the new variables
document.reloadVars = function(seed) {
  Math.seed = seed


  var vars = document.variables
  var ex = vars['1']
  var c = document.constants

  //TODO generate reasonable values

  ex.usage = Math.opRand({min:4, max:12, step:2})
  ex.distance = Math.opRand({min:150, max:450, step: 50})
  ex.fuel = ex.usage * Math.opRand({min:3, max:5})
  ex.res0 = ex.distance / c["100km"]
  ex.res1 = ex.res0 * ex.usage
  ex.res2 = ex.fuel / ex.usage
  ex.res3 = ex.res2 * c["100km"]


}