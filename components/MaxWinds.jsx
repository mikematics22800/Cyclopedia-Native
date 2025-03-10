import { useState, useEffect, useContext } from 'react'
import { Context } from "../app/(tabs)/index";
import BarChart from './BarChart'

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

  const data = {
    labels: names,
    datasets: [
      {
        data: maxWinds,
        borderColor: "red",
        backgroundColor: "red",
      },
    ]
  }
  const chartConfig = {
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return <BarChart data={data} chartConfig={chartConfig} width={Dimensions.get('window').width} height={220} verticalLabelRotation={30}/>
}

export default MaxWinds