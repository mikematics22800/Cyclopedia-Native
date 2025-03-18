import React, { useState, useEffect, useContext } from 'react'
import { Context } from "../App"
import { Dimensions, View } from 'react-native'
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native'

const Intensity = () => {
  const { storm, dates } = useContext(Context)

  const [wind, setWind] = useState([])
  const [pressure, setPressure] = useState([])

  useEffect(() => {
    const data = storm.data
    const wind = data.map((point) => point.max_wind_kt)
    setWind(wind)

    const pressure = data.map((point) => {
      let pressure = point.min_pressure_mb
      return pressure > 0 ? pressure : 0
    })
    setPressure(pressure)
  }, [storm])

  const screenWidth = Dimensions.get('window').width

  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 20 }}
        width={screenWidth}
      >
        {/* Left Y-Axis for Wind */}
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `${t} kt`}
          style={{
            axis: { stroke: 'red' },
            ticks: { stroke: 'red' },
            tickLabels: { fill: 'red' },
          }}
        />
        {/* Right Y-Axis for Pressure */}
        <VictoryAxis
          dependentAxis
          offsetX={screenWidth - 50}
          tickFormat={(t) => `${t} mb`}
          style={{
            axis: { stroke: 'blue' },
            ticks: { stroke: 'blue' },
            tickLabels: { fill: 'blue' },
          }}
        />
        {/* X-Axis for Dates */}
        <VictoryAxis
          tickFormat={(t) => dates[t]}
          style={{
            tickLabels: { fontSize: 10, angle: -45, textAnchor: 'end' },
          }}
        />
        {/* Wind Line */}
        <VictoryLine
          data={wind}
          style={{
            data: { stroke: 'red' },
          }}
        />
        {/* Pressure Line */}
        <VictoryLine
          data={pressure}
          style={{
            data: { stroke: 'blue' },
          }}
        />
      </VictoryChart>
    </View>
  )
}

export default Intensity