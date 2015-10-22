/** Array collection module
 *
 * Extends array prototype with a lot of 
 * useful collection functions
 */
(function() {
  var predicates = {
    equalTo: function(x) { return function(y) {
      return x === y
    }}
  }


  if (!Array.prototype.find)
  /** Returns first element which staisfies the condition
   *  call either with a unary predicate function, or
   *  with a value to compare to.
   *
   * @param predicate a predicate to check every element
   *        against.
   *
   * @return the first matching element of the array
   */
  Array.prototype.find = function(predicate) {
    if (typeof predicate != "function") 
      predicate = predicates.equalTo(predicate)

    for(var i = 0; i < this.length; ++i)
      if (predicate(this[i]))
        return this[i]
  }
})()



