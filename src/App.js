import './App.css';
import { useCallback, useEffect, useState, useRef } from 'react';
import { simBattle } from './arena-utils/sim';
import Attacker from './Attacker';
import Defender from './Defender';
import ObjectViewer from './ObjectViewer';
import Graph from './Graph';
import BonusChooser from './BonusChooser';

function useCachedState(defaultValue, localStorageKey) {
  const first = useRef(true);
  const [state, setState] = useState(defaultValue);
  if (first.current) {
    let v;
    try {
      v = JSON.parse(window.localStorage.getItem(localStorageKey)) ?? defaultValue
    } catch {
      v = defaultValue;
    }
    setState(v);
    first.current = false
  }
  const interceptedSetState = useCallback(
    (value) => {
      function cache(newValue) {
        window.localStorage.setItem(localStorageKey, JSON.stringify(newValue))

      }
      if (typeof value === 'function') {
        setState(old => {
          const newValue = value(old);
          cache(newValue);
          return newValue
        });

      } else {

        setState(value);
        cache(value)
      }
    },
    [setState, localStorageKey],
  )
  return [state, interceptedSetState];
}


function useInput([state, setState], id) {
  const onChange = useCallback(
    (e) => {
      setState(e.target.value)
    },
    [setState],

  )
  return { onChange, id, value: state }
}

function sumObjects(original, delta) {
  let temp = { ...original };
  let keys = Object.keys(delta);
  keys.forEach(k => {
    if (temp[k] === undefined) {
      temp[k] = parseFloat(delta[k]);
    } else {
      temp[k] += parseFloat(delta[k]);
    }
  })
  return temp;
}
function averageObject(original, divisor) {
  let temp = { ...original };
  let keys = Object.keys(original);
  keys.forEach(k => {
    temp[k] = temp[k] / divisor;
  })
  return temp;
}

function App() {
  const [rawData, setRawData] = useCachedState([], 'arena-sim-raw-data-ahp');
  const [histData, setHistData] = useState([]);
  // useEffect(() => {
  //   let binner = d3.bin();
  //   let bins = binner(rawData)
  // }, [rawData, setHistData])
  const hpState = useCachedState(1, 'arena-sim-iterations')
  const hpInput = useInput(hpState);
  const sim = (e) => {
    e.preventDefault();

    let count = hpState[0];
    console.log(`running sim for ${count} times`)
    let agg = {};
    let rd = [];
    while (count--) {
      const res = simBattle(attacker, defender);
      agg = sumObjects(agg, res);
      rd.push(res.aHP);
    }
    setStats(averageObject(agg, hpState[0]));
    setRawData(rd);
  }
  const [attacker, setAttacker] = useCachedState({ hp: 2388291, worth: 2388291, aptitude: 207, critChance: 0.315, critMultiplier: 2.67, atkBonus: 0.5, skillBonus: 0 }, 'arena-sim-attacker');
  const [defender, setDefender] = useCachedState({ worth: 2851027, aptitude: 267, critChance: 0.2065, critMultiplier: 2 }, 'arena-sim-defender');
  const [stats, setStats] = useState({})

  return (
    <div className="App">
      <div>Your Retainer:</div>
      <Attacker value={attacker} onChange={setAttacker} />
      <br />
      <br />
      <div>Opponent's Retainer</div>
      <Defender value={defender} onChange={setDefender} />
      <BonusChooser attacker={attacker} setAttacker={setAttacker} />
      <div>Iterations</div>
      <input {...hpInput} />
      <button onClick={sim}> Run Sim! </button>
      {<ObjectViewer object={stats} />}
      <Graph rawData={rawData} maxHP={attacker.worth} />
    </div>
  );
}

export default App;
