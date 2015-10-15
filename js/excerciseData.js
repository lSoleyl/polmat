//Depends on js/random.js


//Constants
document.constants = {
  '100km':100, //km
  'workday':8, //h
  'ms':"3.6"   //kmh -> ms
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
    'azubiL': "ein Drittel",
    'azubiF': 3, //= 1/3
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

  },

  '3': {
    'm0': 10500,
    'm1': 14000,
    'unitprofit':100,
    'totalprofit':3500,
    'units':35
  },

  '4': {
    'rate':9.5,
    'credit':150000,
    'decRate':"0.095",

    'rate2':95,
    'credit2':150,
    'annualRate':14250,
    'monthlyRate':1187.5
  },

  '5': {
    'speed':96,
    'delay':"eine",
    'delayS':1,
    'speed10':960,
    'ms10':36,
    'result':"26.667",
    'msx':36
  },

  '6': {
    'length':90,
    'factor':'2/3',
    'selector': 'kürzere',
    'fZ':2,
    'fN':3,
    'fZ2':5, //fZ + fN
    'pZ':270,
    'x':54,
    'y':36,
    'selected':36,



    'selectors':['kürzere', 'längere']
  }
}

var secondLiterals = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"]
var fractionList = [ undefined, undefined, "die Hälfte", "ein Drittel", "ein Viertel", "ein Fünftel" ]

var percentMapping = {
  '10' : { z:1, n:10 },
  '20' : { z:1, n:5  },
  '30' : { z:3, n:10 },
  '25' : { z:1, n:4  },
  '50' : { z:1, n:2  },
  '60' : { z:3, n:5  },
  '75' : { z:3, n:4  },
  '80' : { z:4, n:5  },
  '100': { z:1, n:1  }
}

//This function calculates the new variables
document.reloadVars = function(seed) {
  Math.seed = seed
  var smath = document.smath


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
  ex.azubiF =  Math.opRand({min:2, max:5})
  ex.azubiL = fractionList[ex.azubiF]
  ex.azubi = Math.opRand({min:3, max:7})
  ex.mg = ex.azubi * ex.azubiF


  ex.workdays = Math.opRand({min:1.5, max:4.5, step:0.5})
  ex.workhours = c.workday * ex.workdays

  var percentValues = Object.keys(percentMapping)
  ex.masterP =  parseInt(Math.opRand(percentValues))
  var percent = percentMapping[ex.masterP]

  ex.masterZ = ex.masterP + 100
  ex.masterZ2 = percent.z + percent.n
  ex.masterN2 = percent.n

  ex.master = ex.mg * ex.masterZ2 / ex.masterN2

  ex.azubiR = ex.azubi * ex.workdays
  ex.masterR = smath.mul(ex.master,ex.workdays)
  ex.result = smath.sub(ex.masterR,ex.azubiR)


  //Excercise 3
  ex = vars['3']
  ex.unitprofit = Math.opRand([10,20,50,100])
  ex.units = Math.opRand({min:15, max:55, step:5})
  ex.totalprofit = ex.units * ex.unitprofit

  ex.m0 = Math.opRand({min:3*ex.totalprofit, max:5*ex.totalprofit, step:500})
  ex.m1 = ex.m0 + ex.totalprofit


  //Excercise 4
  ex = vars['4']
  
  ex.rate2 = Math.opRand({min:65, max:95, step:10})
  ex.credit2 = smath.mul(Math.opRand({min:40, max:120, step:10}),3)
  ex.annualRate = smath.mul(ex.rate2, ex.credit2)
  ex.monthlyRate = smath.div(ex.annualRate, 12)

  ex.decRate = smath.div(ex.rate2, 1000)
  ex.credit = smath.mul(ex.credit2, 1000)

  ex.rate = smath.div(ex.rate2, 10)


  //Excercise 5
  ex = vars['5']


  ex.delayS = Math.opRand([1,2,3])
  ex.delay = secondLiterals[ex.delayS]
  ex.ms10 = 36
  ex.msx = smath.div(ex.ms10, ex.delayS)
  ex.speed = Math.opRand({min:80, max:98})
  ex.speed10 = ex.speed * 10
  ex.result = smath.div(ex.speed10, ex.msx)

  //Excercise 6
  ex = vars['6']

  
  var factors = [ 
    {z:2, n:3}, 
    {z:1, n:3},
    {z:3, n:4},
    {z:1, n:5},
    {z:3, n:5},
    {z:2, n:7}
  ]


  var f = Math.opRand(factors)

  ex.factor = '' + f.z + '/' + f.n
  ex.fZ = f.z
  ex.fN = f.n
  ex.fZ2 = ex.fZ + ex.fN

  var minX = parseInt(50/ex.fN)*ex.fN
  var maxX = parseInt(200/ex.fN)*ex.fN
  ex.x = Math.opRand({min:minX, max:maxX, step:ex.fN})

  ex.length = smath.div(smath.mul(ex.x, ex.fZ2), ex.fN)
  ex.y = smath.sub(ex.length, ex.x)

  ex.pZ = smath.mul(ex.length, ex.fN)

  var shortOne = Math.opRand([true,false])

  ex.selector = shortOne ? ex.selectors[0] : ex.selectors[1]

  ex.selected = shortOne ? ex.y : ex.x //y is always shorter than x
}