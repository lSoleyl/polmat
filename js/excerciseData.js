//Depends on js/random.js


//Constants
document.constants = {
  '100km':100, //km
  'workday':8  //h
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
  },

  '2': {
    'mg':18,
    'azubiF':3, //= 1/3
    'masterP':25,
    'workdays':1.5,

    // Intermediate results
    'masterZ':125

  }
}

//This function calculates the new variables
document.reloadVars = function(seed) {
  Math.seed = seed


  var c = document.constants
  var vars = document.variables
  
  //Exercise 1
  var ex = vars['1']
  ex.usage = Math.opRand({min:4, max:12, step:2})
  ex.distance = Math.opRand({min:150, max:450, step: 50})
  ex.fuel = ex.usage * Math.opRand({min:3, max:5})
  ex.res0 = ex.distance / c["100km"]
  ex.res1 = ex.res0 * ex.usage
  ex.res2 = ex.fuel / ex.usage
  ex.res3 = ex.res2 * c["100km"]

  return // Remove later
  //Exercise 2
  ex = vars['2']
  ex.azubiF = Math.opRand({min:2, max:5})
  ex.mg = Math.opRand({min:3, max:7}) * ex.azubiF


  ex.workdays = Math.opRand({min:1.5, max:4.5, step:0.5})

}