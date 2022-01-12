import { useCallback, useEffect, useState, useRef } from 'react';
import floatify1 from './floatify';
const floatify = a => a;
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
          return floatify(newValue)
        });

      } else {

        setState(floatify(value));
        cache(floatify(value))
      }
    },
    [setState, localStorageKey],
  )
  return [state, interceptedSetState];
}

export default useCachedState;