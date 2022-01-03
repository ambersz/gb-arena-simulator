import InputCollection from "./InputCollection";
function Attacker({ value, onChange }) {
  const keys = ['hp', 'worth', 'aptitude', 'critChance', 'critMultiplier', 'atkBonus', 'skillBonus'];
  return <InputCollection {...{ value, onChange, keys }}/>
}




export default Attacker