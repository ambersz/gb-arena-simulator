const EMPTY_ATTRIBUTE = {
  color: 0,
  value: 0,
}
const valueCache = new Map();
const strategyCache = new Map();
const COLORS = [1, 2, 3, 4, 5];
let MAX_REROLLS = 1;
const defaultState = {
  attributes: [
    {
      current: {
        color: 1,
        value: 1
      },
      candidate: EMPTY_ATTRIBUTE,
      rerollCount: 0
    }
    , {
      current: {
        color: 3,
        value: 1
      },
      candidate: EMPTY_ATTRIBUTE,
      rerollCount: 0
    }
    , {
      current: {
        color: 4,
        value: 1
      },
      candidate: EMPTY_ATTRIBUTE,
      rerollCount: 0
    }
    // , {
    //   current: {
    //     color: 2,
    //     value: 1
    //   },
    //   candidate: EMPTY_ATTRIBUTE,
    //   rerollCount: 0
    // }

  ]
}

// canonize state serialization:
//  first sort attributes by rerolls descending
// break ties by highest current value
// break ties by highest candidate value 
// break ties by highest current color
// break ties by highest candidate color 
function getCanonKey(state) {
  let keyParts = state.attributes.map(a => [a.current.color, a.current.value, a.candidate.color, a.candidate.value, a.rerollCount]).sort((a, b) => {
    const indices = [4, 1, 3, 0, 2];
    for (let i = 0; i++; i <= indices.length) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
  });
  let colorMap = [-1, 0, 0, 0, 0, 0];
  let nextColor = 1;
  keyParts.forEach(key => {
    const colorCurrent = key[0];
    const colorCandidate = key[2];
    if (colorMap[colorCurrent] === 0) {
      colorMap[colorCurrent] = nextColor;
      nextColor++;
    }
    if (colorMap[colorCandidate] === 0) {
      colorMap[colorCandidate] = nextColor;
      nextColor++;
    }
    key[0] = colorMap[colorCurrent]
    key[2] = colorMap[colorCandidate]
  })
  const key = keyParts.map(a => a.join(',')).join('/')
  // return JSON.stringify(state);
  console.log(key)
  return key;
}

function valueAt(state = defaultState) {
  const key = getCanonKey(state);
  const cached = valueCache.get(key);
  if (cached !== undefined) return cached
  let done = true;
  if (state.attributes.forEach(a => { if (a.rerollCount < MAX_REROLLS) { done = false } }));
  // possible action pool
  // 1. stop
  // 3. reroll any attribute
  // 2. replace any attribute
  const stop = currentBestValue(state);
  // console.log({ stop })
  if (done) {
    valueCache.set(key, stop);
    // strategyCache.set(key, 'stop');
    return stop
  };
  let reroll = state.attributes.map((attribute, i) => {
    if (attribute.rerollCount >= MAX_REROLLS) return stop;
    // console.log({ rolls })
    return weightedAverage(rolls.map(roll => {
      debugger;
      // console.log(state.attributes[i].rerollCount);
      let rollState = { ...state, attributes: [...state.attributes] };
      const rerollAttribute = {
        current: state.attributes[i].current,
        candidate: roll,
        rerollCount: state.attributes[i].rerollCount + 1,
      }
      rollState.attributes[i] = rerollAttribute;
      if (isNaN(rerollAttribute.rerollCount)) debugger;
      // if (roll.value > 10) console.log(JSON.stringify({ rollState }, 1))
      return valueAt(rollState);
    }), rollWeights);
  });
  let replace = state.attributes.map((attribute, i) => {
    if (attribute.candidate === EMPTY_ATTRIBUTE) return 0;
    let replaceAttribute = { current: attribute.candidate, candidate: EMPTY_ATTRIBUTE, rerollCount: attribute.rerollCount };
    let replaceState = { ...state, attributes: [...state.attributes] };
    replaceState.attributes[i] = replaceAttribute;
    return valueAt(replaceState)
  });
  // console.log('here?')
  // console.log({ stop, reroll, replace })
  const finalValue = Math.max(stop, ...reroll, ...replace);
  if (finalValue === stop) {
    // strategyCache.set(key, 'stop');
  } else if (reroll.indexOf(finalValue) > -1) {
    strategyCache.set(key, `reroll slot ${reroll.indexOf(finalValue) + 1}`)
  } else if (replace.indexOf(finalValue) > -1) {
    strategyCache.set(key, `replace slot ${replace.indexOf(finalValue) + 1}`)
  }
  valueCache.set(key, finalValue);
  return finalValue
}

function weightedAverage(values, weights) {
  return sum(values.map((v, i) => v * weights[i]))
}
const bonusValues = [];
const bonusWeights = [0.08375819374, 0.1194464676, 0.1485797524, 0.1733430444, 0.1449380918, 0.09832483613, 0.05899490168, 0.04588492353, 0.04442825929, 0.01602330663, 0.01602330663, 0.005826656956, 0.005826656956, 0.008011653314, 0.008011653314, 0.002913328478, 0.003641660597, 0.003641660597, 0.002913328478, 0.0007283321194, 0.003641660597, 0, 0.001456664239, 0, 0.001456664239, 0, 0.0007283321194, 0, 0, 0.001456664239]
const maxValue = 30;
let i = 0;
while (i++ < maxValue) {
  bonusValues.push(i);
}
console.log({ bonusValues })
const rolls = [1, 2, 3, 4, 5].flatMap(color => {
  return bonusValues.map(value => {
    return {
      color,
      value,
    }
  })
});
const rollWeights = COLORS.flatMap(color => bonusWeights.map(weight => weight / 5));


function currentBestValue(state = defaultState) {
  const possibleFinalValues = COLORS.map(color => {
    return sum(state.attributes.map(attribute => bestAttribute(color, attribute)))
  })
  const max = Math.max(...possibleFinalValues);
  // console.log({ possibleFinalValues, max });
  return Math.max(...possibleFinalValues);

}

function sum(array = []) {
  return array.reduce((prev, current) => prev + current, 0)
}

function bestAttribute(color, attribute) {
  let currentValue = 0, candidateValue = 0;
  if (attribute.current.color === color) currentValue = attribute.current.value;
  if (attribute.candidate.color === color) candidateValue = attribute.candidate.value;
  return Math.max(currentValue, candidateValue);
}

if (!window) {
  console.log(valueAt());
  console.log(strategyCache);
  console.log(strategyCache.get(getCanonKey(defaultState)));
}


function setMaxRerolls(a) {
  MAX_REROLLS = a;
}
const curio = {
  valueAt,
  valueCache,
  currentBestValue,
  defaultState,
  getCanonKey,
  setMaxRerolls
}

export default curio