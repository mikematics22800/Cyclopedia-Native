import { useState, useEffect, useContext } from 'react'
import { Context } from "../App";

const MaxWinds = () => {
  const {season, names} = useContext(Context)
  const [maxWinds, setMaxWinds] = useState([])

  useEffect(() => {
    const maxWinds = season.map((storm) => {
      const winds = storm.data.map((point) => {
        return point.max_wind_kt
      })
      return Math.max(...winds)
    })
    setMaxWinds(maxWinds)
  }, [season])

  return 
}

export default MaxWinds