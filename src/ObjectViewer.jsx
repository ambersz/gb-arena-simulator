function ObjectViewer({object}) {
  let keys = Object.keys(object);
  if (!keys.length) return false;
  return (keys.map(k => {
    return (<div key={k}>{k}: {object[k]}</div>)
  }))
}

export default ObjectViewer