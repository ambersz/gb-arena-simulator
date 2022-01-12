function floatify(obj) {
  const keys = Object.keys(obj);
  keys.forEach(k => {
    if (typeof obj[k] !== 'string') return;
    const floated = parseFloat(obj[k]);
    if (floated.toString === obj[k]) {
      obj[k] = parseFloat(obj[k])
    } else if (isNaN(floated) && obj[k].slice(-1) !== '.') {
      obj[k] = 0;
    }
  })
  return obj;
}

export default floatify