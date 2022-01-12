import { useState } from "react";
import banditUtils from "./bandits/bandit";
import useCachedState from "./utils/useCachedState";
const defaultBanditState = [
  '1.234k',
  '2.345m',
  '3.456b'
]

function Expando({ buttonText, children }) {
  const [show, setShow] = useState(false);
  return (<>
    <button onClick={() => setShow(a => !a)}>{buttonText}</button>
    {show && children}
  </>)
}
function parseShortNumbers(worths) {
  return worths.map(w => {

    const scientificString = w.replace(' ', '').toUpperCase().replace(/K$/, '').replace(/M$/, 'E+3').replace(/B$/, 'E+6');
    const num = parseFloat(scientificString);
    if (isNaN(num)) return 0;
    return num;
  })

}
export default function Bandits() {
  // input retainer worths
  // input top 5 guild assist retainer worths
  // output highest number of bandits which you can defeat
  // Can't figure out how to do it? Click here to see one way:

  const [worths, setWorths] = useCachedState(defaultBanditState, 'gb-bandits-worths');
  const [barbarossa, setBarbarossa] = useCachedState(1, 'gb-bandits-barbarossa-uses');
  const [strategy, setStrategy] = useCachedState(undefined, 'gb-bandits-lp-results');
  const calculate = () => {
    banditUtils.bandits(parseShortNumbers(worths), barbarossa).then(v => setStrategy(v));
  }
  return (
    <>
      <div>How many times can you use your first retainer to fight bandits? (Use this for Barbarossa)</div>
      <input value={barbarossa} onChange={(e) => setBarbarossa(e.target.value)} />
      <br />
      <br />
      <div>Input the worths of your retainer and your top 5 guild assistance retainers here</div>
      <RetainerInput value={worths} onChange={setWorths} />
      <br />
      <button onClick={calculate}>Calculate maximum bandits defeated</button>
      {
        strategy && (<>
          <div>You can beat {strategy[0]} bandits.</div>
          <Expando buttonText={'Click here to see one way to defeat them. (There may be others.)'}>
            {<Strategy mapping={strategy[1]} worths={worths} />}
          </Expando>
        </>)
      }
    </>
  )
}

function RetainerInput({ value = [], onChange }) {
  let inputs = [...value];
  if (!['', '0'].includes(inputs[value.length])) { inputs.push('') };
  return inputs.map((v, i) => {
    return (<div key={i}>
      Retainer {i + 1}:
      <input value={v} onChange={(e) => {
        const newValue = [...value];
        newValue[i] = e.target.value;
        onChange(newValue);
      }} />
    </div>
    )
  })
}

function Strategy({ mapping, worths }) {

  return Array.from(banditUtils.getFighterMapping(mapping).entries()).sort((a, b) => { return (a[0] - b[0]) || a[1] - b[1] }).map(([bandit, retainersArray]) => {
    return (
      <div key={bandit}>To defeat Bandit {parseInt(bandit) + 1}, use the retainers with the following worths: {retainersArray.map(i => worths[i]).join(', ')}</div>
    )
  })
}