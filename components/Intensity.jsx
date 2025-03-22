import { useState, useEffect, useContext } from 'react'
import { Context } from '../App'
import { CartesianChart, Line } from "victory-native";


const Intensity = () => {
  const {storm, dates} = useContext(Context)

  const [data, setData] = useState(null)

  useEffect(() => {
    if (storm && dates) {
      const data = storm.data.map((point, i) => {
        return {
          date: dates[i],
          wind: point.max_wind_kt,
          pressure: point.min_pressure_mb > 0 ? point.min_pressure_mb : null
        }
      })
      setData(data)
    }
  }, [storm, dates])

  console.log(data)

  if (data) {
    return (
      <CartesianChart data={data} xKey="date" yKeys={["wind", "pressure"]}>
        {({ points }) => (
          <>
            <Line
              points={points.wind}
              color="red"
              strokeWidth={3}
              animate={{ type: "timing", duration: 300 }}
              connectMissingData={true}
            />
            <Line
              points={points.pressure}
              color="blue"
              strokeWidth={3}
              animate={{ type: "timing", duration: 300 }}
              connectMissingData={true}
            />
          </>
        )}
      </CartesianChart>
    )
  }
}

export default Intensity