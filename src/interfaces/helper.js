// Define a type ValueOf that extracts the values of a given object type
function ValueOf(obj) {
  return obj[Object.keys(obj)[0]];
}
