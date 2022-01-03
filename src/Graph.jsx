import { useEffect, useMemo, useRef } from "react"
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot'
window.d3 = d3;

export default function PlotGraph({ rawData, maxHP }) {
  const plot = useMemo(() => {
    return Plot.plot({
      y: {
        grid: true,
      },
      marks: [
        Plot.rectY(rawData, Plot.binX({ y: "proportion" }, {})),
        Plot.ruleY([0, 1]),
        Plot.ruleX([0, maxHP])
      ]
    })
  }, [rawData]);
  const plotRef = useRef();
  useEffect(() => {

    if (plotRef.current) {
      plotRef.current.appendChild(plot);
      return () => plot.remove()
    }
  }, [plot]);
  return <div ref={plotRef} />
}
