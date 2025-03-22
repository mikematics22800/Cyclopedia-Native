import { useState, useEffect, useContext } from 'react'
import { Context } from "../App";

const MinPressures = () => {
  const {season, names} = useContext(Context)

  const [minPressures, setMinPressures] = useState([])

  useEffect(() => {
    const minPressures = season.map((storm) => {
      const pressures = storm.data.map((point) => {
        return point.min_pressure_mb
      })
      return Math.min(...pressures)
    })
    setMinPressures(minPressures)
  }, [season])

  return 
}

export default MinPressures