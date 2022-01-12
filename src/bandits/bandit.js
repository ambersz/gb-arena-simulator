import GLPK from 'glpk.js/dist/index.js';
let glpk;

function getVariableName(retainerNumber, banditNumber) {
  return `retainer_${retainerNumber}_fights_bandit_${banditNumber}`
}
function getRetainerBanditFightVariables(retainerWorthArray, banditHPArray) {
  let r = retainerWorthArray.length;
  let variableNames = [];
  while (r--) {
    let b = banditHPArray.length;
    while (b--) {
      variableNames.push(getVariableName(r, b))
    }
  }
  return variableNames;
}
function getBanditHPConstraints(retainerWorthArray, banditHPArray) {
  let banditNumber = banditHPArray.length;
  let constraints = [];
  while (banditNumber--) {
    // eslint-disable-next-line no-loop-func
    let vars = retainerWorthArray.map((worth, retainerNumber) => {
      return ({
        name: getVariableName(retainerNumber, banditNumber),
        coef: worth,
      })
    })
    const constraint = {
      name: `defeat bandit ${banditNumber}`,
      vars,
      bnds: {
        type: glpk.GLP_LO,
        lb: banditHPArray[banditNumber],
      }
    }
    constraints.push(constraint);
  }
  return constraints;
}
function getRetainerUsesConstraints(retainerWorthArray, banditHPArray, retainerUsesMap = 1) {
  let retainerNumber = retainerWorthArray.length;
  let constraints = [];
  while (retainerNumber--) {
    // eslint-disable-next-line no-loop-func
    let vars = banditHPArray.map((_, banditNumber) => {
      return {
        name: getVariableName(retainerNumber, banditNumber),
        coef: 1
      }
    });
    const constraint = {
      name: `use retainer ${retainerNumber} at most 1 time`,
      vars,
      bnds: {
        type: glpk.GLP_UP,
        ub: retainerUsesMap[retainerNumber] ?? 1,
        lb: 0
      }
    }
    constraints.push(constraint)
  }
  return constraints;
}
const defaultRetainerWorthArray = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100,];
const defaultRetainerWorthArray2 = [28696.53, 2388.291, 1865.562, 1700.08, 1633.889, 1602.416, 1583.994, 1560.914, 1539.383, 1444.156, 1441.531, 1414.036, 1371.544, 1353.902, 1342.285, 1325.605, 1297.109, 1174.982, 1149.467, 1119.832, 1102.243, 1062.589, 1050.975, 988.317, 983.221, 940.602, 469.007, 160.92, 100.855, 98.933, 89.237, 82.391, 76.046, 74.174, 74.001, 42.715, 24.621, 13.076, 0, 25190, 9781, 7359, 5850, 4801];
async function bandits(retainerWorthArray = defaultRetainerWorthArray, barbarossaUses = 1) {
  if (glpk === undefined) {
    glpk = await GLPK();
  }
  const options = {
    msglev: glpk.GLP_MSG_ALL,
    tmlim: 60,
    presol: true,
    cb: {
      call: progress => console.log(progress),
      each: 1
    }
  };
  // inputs
  // retainer worth array

  // bandit hp array (run with increasing array lengths until fails to solve)
  const originalBanditHPArray = [150, 175, 215, 230, 325, 345, 390, 525, 575, 650, 830, 870, 1050, 1300, 1500, 1800, 2450, 2600, 3050, 4050, 4250, 5000, 5850, 7200, 9000, 10000, 12000, 14500, 15500]

  // variables
  // retainer x bandit number fights matrix

  // constraints
  // retainer worth - bandit hp (per bandit) >= 0
  // retainer number fights (per retainer) <= 1

  // objective
  // minimize retainers used


  let numBandits = 1;
  let bestSolution;
  while (true) {
    if (numBandits > originalBanditHPArray.length) break;
    const banditHPArray = originalBanditHPArray.slice(0, numBandits);
    const model = {
      name: `Fight ${numBandits} Bandits`,
      generals: getRetainerBanditFightVariables(retainerWorthArray, banditHPArray), // integer variables
      objective: {
        direction: glpk.GLP_MIN,
        name: 'number of retainers used',
        vars: getRetainerBanditFightVariables(retainerWorthArray, banditHPArray).map(
          name => ({
            name,
            coef: 1
          }))
      },
      subjectTo: [
        ...getBanditHPConstraints(retainerWorthArray, banditHPArray),
        ...getRetainerUsesConstraints(retainerWorthArray, banditHPArray, { '0': barbarossaUses }),
      ]
    }
    const res = await glpk.solve(model, options);
    console.log(res.result.status);
    if ([glpk.GLP_UNDEF,
    // glpk.GLP_INFEAS,
    glpk.GLP_NOFEAS].includes(res.result.status)) {
      break;
    } else {
      bestSolution = res;
      numBandits++;
    }
  }
  return [numBandits - 1, bestSolution];

}

function parseResults(result) {
  let vars = Object.keys(result.result.vars);
  return vars.filter(k => result.result.vars[k]);
}

function getFighterMapping(result) {
  const fights = parseResults(result);
  let mapping = new Map();
  fights.forEach(f => {
    const match = /^retainer_(\d*)_fights_bandit_(\d*)$/.exec(f);
    console.log(match)
    const current = mapping.get(match[2]);
    if (current === undefined) {
      mapping.set(match[2], [match[1]])
    } else {
      mapping.set(match[2], [...current, match[1]])
    }
  })
  return mapping;
}
// console.log(parseResults(result))
if (false) {
  const results = bandits();
  console.log(results);
  console.log(getFighterMapping(results[1]));
}
const banditUtils = {
  bandits,
  parseResults,
  getFighterMapping
}

export default banditUtils;