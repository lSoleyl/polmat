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
    'masterZ':125,
    'azubi':6,

    'masterZ2':5,
    'masterN2':4,

    'master':22.5,
    'workhours': 12,

    'azubiR':9,
    'masterR':33.75,

    'result':24.75

  }
}



var percentMapping = {
  '10' : { z:1, n:10 },
  '20' : { z:1, n:5  },
  '30' : { z:3, n:10 },
  '25' : { z:1, n:4  },
  '50' : { z:1, n:2  },
  '60' : { z:3, n:5  },
  '75' : { z:3, n:4  },
  '100': { z:1, n:1  }
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

  
  //Exercise 2
  ex = vars['2']
  ex.azubiF = Math.opRand({min:2, max:5})
  ex.azubi = Math.opRand({min:3, max:7})
  ex.mg = ex.azubi * ex.azubiF


  ex.workdays = Math.opRand({min:1.5, max:4.5, step:0.5})
  ex.workhours = c.workday * ex.workdays

  var percentValues = Object.keys(percentMapping)
  ex.masterP = parseInt(Math.opRand(percentValues))
  var percent = percentMapping[ex.masterP]

  ex.masterZ = ex.masterP + 100
  ex.masterZ2 = percent.z + percent.n
  ex.masterN2 = percent.n

  ex.master = ex.mg * ex.masterZ2 / ex.masterN2

  ex.azubiR = ex.azubi * ex.workdays
  ex.masterR = ex.master * ex.workdays //TODO We need some better number arithmetics here
  ex.result = ex.masterR - ex.azubiR

}