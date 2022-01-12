import './App.css';
import { useCallback, useState, useMemo } from 'react';
import { simBattle } from './arena-utils/sim';
import Attacker from './Attacker';
import Defender from './Defender';
import ObjectViewer from './ObjectViewer';
import Graph from './Graph';
import BonusChooser from './BonusChooser';
import useCachedState from './utils/useCachedState';

import Bandits from './Bandit';


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
  const tabs = useMemo(() => {
    return {
      Bandits: (<Bandits />),
      Arena: (<Arena />),
    }
  }, [])
  const [tab, setTab] = useState('')

  return (<div className="App">

    {
      Object.keys(tabs).map(key => {
        return <TabButton key={key} name={key} setTab={setTab} tab={tab} />
      })}
    {tab && tabs[tab]}
  </div>
  )

}

function TabButton({ name, setTab, tab }) {
  const cb = useCallback(() => {
    setTab(name)
  }, [name, setTab]);
  return (<button onClick={cb} disabled={name === tab}>{name}</button>)
}

function Arena() {
  const [rawData, setRawData] = useCachedState([], 'arena-sim-raw-data-ahp');
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
    <div>
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
