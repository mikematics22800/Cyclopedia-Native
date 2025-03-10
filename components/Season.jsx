import { useContext, useState, useEffect } from 'react'
import { Context } from "../app/(tabs)/index";
import { ScrollView, View, Text } from 'react-native' 
import MaxWinds from './MaxWinds'
import MinPressures from './MinPressures'
import SeasonACE from './SeasonACE'
import { sum } from '../libs/sum'

const Season = () => {
  const {season, seasonACE} = useContext(Context)

  const [deadOrMissing, setDeadOrMissing] = useState(0)
  const [cost, setCost] = useState(0)
  const [retiredNames, setRetiredNames] = useState([])

  useEffect(() => {
    const deadOrMissing = season.map((storm) => {
      return storm.dead_or_missing
    })
    setDeadOrMissing(sum(deadOrMissing))
    const costs = season.map((storm) => {
      return storm.cost_usd
    })
    const cost = sum(costs)
    setCost((cost/1000000).toFixed(1))
    const retiredStorms = season.filter(storm => storm.retired == true)
    const retiredNames = retiredStorms.map((storm) => {
      return storm.id.split('_')[1]
    })
    setRetiredNames(retiredNames)
  }, [season])

  return (
    <ScrollView className='flex flex-col items-center gap-10'>
      <View className='flex flex-col gap-1.5 w-full max-w-[48rem] text-white font-bold'>
        <View className='rounded-lg p-3 flex justify-between text-sm bg-purple-600'>
          <Text>Tropical Cyclones</Text>
          <Text>{season.length}</Text>
        </View>
        <View className='rounded-lg p-3 flex justify-between text-sm bg-purple-600'>
          <Text>Accumulated Cyclone Energy</Text>
          <Text>{sum(seasonACE).toFixed(1)}</Text>
        </View>
        <View className='rounded-lg p-3 flex justify-between text-sm bg-purple-600'>
          <Text>Dead/Missing</Text>
          <Text>{deadOrMissing}</Text>
        </View>
        <View className='rounded-lg p-3 flex justify-between text-sm bg-purple-600'>
          <Text>Cost (Million USD)</Text>
          <Text>${cost}</Text>
        </View>
        <View className='rounded-lg p-3 flex justify-between text-sm bg-purple-600'>
          <Text>Retired Names</Text>
          <Text>{retiredNames.length > 0 ? retiredNames.join(", ") : "None"}</Text>
        </View>
      </View>
      <View className="bg-white p-5 rounded-md flex flex-col gap-5 w-full max-w-[768px]">
        <MaxWinds/>
        <MinPressures/>
        <SeasonACE/>
      </View>
    </ScrollView>
  )
}

export default Season