
function isEql(a, b){
  if (a === b) return true
  if (typeof a !== typeof b) return false

  if (Array.isArray(a))
    return !a.some((a, idx) => a !== b[idx])

  return false
}

function shallowEqual(objA, objB, eql = isEql) {
  if (objA === objB)
    return true;

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length)
    return false;

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (var i = 0; i < keysA.length; i++) {
    var key = keysA[i];
    if (!bHasOwnProperty(key)) return false;
    if (!eql(objA[key], objB[key])) return false;
  }

  return true;
}

export default shallowEqual
