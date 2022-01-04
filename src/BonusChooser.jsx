import { useState } from "react";
import Attacker from "./Attacker";
import InputCollection from "./InputCollection";
const SKILL_BONUS = 'SKILL_BONUS';
const ATK_BONUS = 'ATK_BONUS'
export default function BonusChooser({ attacker, setAttacker }) {
  const [bonuses, setBonuses] = useState([{ type: SKILL_BONUS, amount: 0 }, { type: SKILL_BONUS, amount: 0 }])
  const [show, setShow] = useState(false);
  if (!show) return <button onClick={() => setShow(true)}> Show Bonus Chooser </button>
  return (<div style={{ margin: '15px' }}>
    <h3>Bonus Chooser</h3>
    {/* <Attacker value={attacker} onChange={setAttacker} /> */}
    <Bonuses value={bonuses} onChange={setBonuses} attacker={attacker} setAttacker={setAttacker} />
    <button onClick={() => setShow(false)}> Hide Bonus Chooser </button>
  </div>)
}

function Bonuses({ value, onChange, attacker, setAttacker }) {
  const handler = (cost) => {
    const bonusOnChange = (cb) => onChange(prev => {
      let temp = [...prev];
      prev[cost - 1] = cb(prev[cost - 1]);
      return temp
    })
    const updateAttacker = () => {
      setAttacker(a => {
        console.log({ a })
        let temp = { ...a };
        const bonus = value[cost - 1];
        if (bonus.type === SKILL_BONUS) {
          temp.skillBonus += normalizeAmount(bonus.amount)
        } else {
          temp.atkBonus += normalizeAmount(bonus.amount)
        }
        return temp
      })
    }
    return { onChange: bonusOnChange, updateAttacker }
  }
  return (<div>
    <Bonus cost={1} value={value[0]} {...handler(1)} attacker={attacker} />
    <br />
    <Bonus cost={2} value={value[1]} {...handler(2)} attacker={attacker} />
  </div>
  )
}


function Bonus({ cost, value, onChange, attacker, updateAttacker }) {
  const handleSelectChange = (e) => {
    onChange((po) => { po = { ...po }; po.type = e.target.value; return po });
  };
  return (<div>
    <div>Cost: {cost} 'Fire'</div>
    <select value={value.type} onChange={handleSelectChange}>
      <option value={SKILL_BONUS}>Skill Bonus</option>
      <option value={ATK_BONUS}>Atk Bonus</option>
    </select>
    <InputCollection value={value} onChange={onChange} keys={['amount']} />
    <div>Damage increase: {getBonusValue(attacker, value)} </div>
    <div>Damage per Fire: {getBonusValue(attacker, value) / cost}</div>
    <button onClick={updateAttacker}>Buy this bonus!</button>
  </div>)
}
function normalizeAmount(v) {
  v = parseFloat(v);
  if (v >= 1) {
    return v / 100
  } return v;
}
function getBonusValue(attacker, bonus) {
  let amount = normalizeAmount(bonus.amount);
  console.log({ attacker, bonus })
  let dmgChange;
  if (bonus.type === SKILL_BONUS) {
    dmgChange = (1 + attacker.atkBonus) * attacker.critMultiplier * amount
  } else {
    dmgChange = (1 + attacker.critMultiplier * attacker.critChance) * amount
  }

  if (isNaN(dmgChange)) return 0;
  return dmgChange
}