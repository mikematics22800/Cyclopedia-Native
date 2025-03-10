import { useContext } from 'react'
import { Context } from "../app/(tabs)/index";
import BarChart from './BarChart'
import { Dimensions } from 'react-native'

const SeasonACE = () => {
  const {names, seasonACE} = useContext(Context)

  const data = {
    labels: names,
    datasets: [
      {
        data: seasonACE?.map((ACE) => {return ACE.toFixed(1)}),
        borderColor: "purple",
        backgroundColor: "purple"
      },
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Accumulated Cyclone Energy'
      }
    },
  };

  return <BarChart data={data} options={options} width={Dimensions.get('window').width} height={220} verticalLabelRotation={30}/>
}

export default SeasonACE