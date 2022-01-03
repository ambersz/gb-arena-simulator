import InputCollection from "./InputCollection";
function Defender({ value, onChange }) {
  const keys = ['worth', 'aptitude', 'critChance', 'critMultiplier'];
  return <InputCollection {...{ value, onChange, keys }}/>
}




export default Defender