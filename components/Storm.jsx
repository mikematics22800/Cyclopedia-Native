import { useContext, useState, useEffect } from 'react'
import { Context } from "../App";
import { ScrollView, View, Text, Image } from 'react-native' 
import retiredImage from "../assets/images/retired.png"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Intensity from './Intensity'

const Storm = () => {
  const { year, storm, stormId } = useContext(Context)

  console.warn(storm)

  const [stormName, setStormName] = useState('')
  const [textColor, setTextColor] = useState('')
  const [retired, setRetired] = useState(false)
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')
  const [maxWind, setMaxWind] = useState('')
  const [minPressure, setMinPressure] = useState('')
  const [landfalls, setLandfalls] = useState([])
  const [inlandMaxWind, setInlandMaxWind] = useState('')
  const [inlandMinPressure, setInlandMinPressure] = useState('')
  const [cost, setCost] = useState('')
  const [deadOrMissing, setDeadOrMissing] = useState('')

  useEffect(() => {
    setStormName(storm.id.split('_')[1])

    setImage(storm.image)

    setRetired(storm.retired)

    const data = storm.data

    const startArray = data[0].date.toString().split('')
    const startYear = startArray.slice(0,4).join('')
    const startMonth = startArray.slice(4,6).join('')
    const startDay = startArray.slice(-2).join('')
    const startDate = `${startMonth}/${startDay}/${startYear}`
    const endArray = data[data.length - 1].date.toString().split('')    
    const endYear = endArray.slice(0,4).join('')
    const endMonth = endArray.slice(4,6).join('')
    const endDay = endArray.slice(-2).join('')
    const endDate = `${endMonth}/${endDay}/${endYear}`
    const duration = `${startDate}-${endDate}`
    setDuration(duration)

    const winds = data.map((point) => {
      return point.max_wind_kt
    })
    const maxWind = Math.max(...winds)
    setMaxWind(maxWind)

    const pressures = data.map((point) => {
      if (point.min_pressure_mb > 0) {
        return point.min_pressure_mb
      } else {
        return 9999
      }
    })

    const minPressure = Math.min(...pressures)
    setMinPressure(minPressure)

    const landfalls = data.filter(point => point.record === "L")
    setLandfalls(landfalls)

    const inlandWinds = landfalls.map((point) => {
      return point.max_wind_kt
    })
    setInlandMaxWind(Math.max(...inlandWinds))

    const inlandPressures = landfalls.map((point) => {
      if (point.min_pressure_mb) {
        return point.min_pressure_mb
      } else {
        return 9999
      }
    })
    setInlandMinPressure(Math.min(...inlandPressures))

    setImage(storm.image)

    const cost = (storm.cost_usd/1000000).toFixed(1)
    setCost(cost)

    const deadOrMissing = storm.dead_or_missing
    setDeadOrMissing(deadOrMissing)

    let textColor
    const statuses = data.map((point) => {
      return point.status
    })
    if (statuses.includes("HU")) {
      if (maxWind <= 82) {
        textColor = "yellow"
      }
      if (maxWind > 82 && maxWind <= 95) {
        textColor = "orange"
      }
      if (maxWind > 95 && maxWind <= 110) {
        textColor = "red"
      }
      if (maxWind > 110 && maxWind <= 135) {
        textColor = "hotpink"
      }
      if (maxWind > 135) {
        textColor = "pink"
      }
    } else {
      if (statuses.includes("TS")) {
        textColor = "lime"
      } else {
        if (statuses.includes("SS")) {
          textColor = "lightgreen"
        } else {
          if (statuses.includes("TD")) {
            textColor = "#0096FF"
          } else {
            textColor = "aqua"
          }
        }
      }
    }
    setTextColor(textColor)
  }, [storm]);

  return (
    <ScrollView className='flex flex-col items-center'>
      <View className='flex flex-col w-full items-center mb-10'>
        <View className='flex flex-col mb-10'>
          <View
            target='_blank' 
            className={
              `w-80 h-96 bg-cover bg-center flex flex-col items-center justify-center rounded-xl 
              bg-gray-400 ${retired && '!justify-end pb-2 sm:pb-4'} ${year < 1995 && 'pointer-events-none'}`
            }
            style={{backgroundImage: `url(${image})`}} 
            href={`https://www.nhc.noaa.gov/data/tcr/${stormId}.pdf`}
          >
            {image == "" && <View className='flex flex-col items-center'>
              <MaterialIcons name="cyclone" size={24} color="gray"/>              
              <Text className='text-2xl font-bold text-gray-600 mt-5'>Image Unavailable</Text>
            </View>}
            {retired && <Image className='w-60' source={retiredImage}/>}
          </View>
        </View>
        <View className='flex flex-col font-bold items-center mb-10'>
          <Text className='text-3xl font-bold' style={{color:textColor}}>{stormName}</Text>
          <Text className='text-xl mb-2 font-bold text-white'>{duration}</Text>
          <View className='rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Maximum Wind</Text>
            <Text className=" text-white font-bold">{maxWind} kt</Text>
          </View>
          {landfalls.length > 0 && <View className='my-1.5 rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Maximum Inland Wind</Text>
            <Text className="text-white font-bold">{inlandMaxWind} kt</Text>
          </View>}
          <View className='rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Minimum Pressure</Text>
            <Text className="text-white font-bold">{minPressure != 9999 && minPressure != -999 ? (`${minPressure} mb`) : 'Unknown'}</Text>
          </View>
          {landfalls.length > 0 && <View className='my-1.5 rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Minimum Inland Pressure</Text>
            <Text className="text-white font-bold">{inlandMinPressure ? (`${inlandMinPressure} mb`) : 'Unknown'}</Text>
          </View>}
          <View className='rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Dead/Missing</Text>
            <Text className="text-white font-bold">{deadOrMissing}</Text>
          </View>
          <View className='mt-1.5 rounded-lg p-3 flex flex-row justify-between text-sm bg-blue-600 w-96'>
            <Text className="text-white font-bold">Cost (Million USD)</Text>
            <Text className="text-white font-bold">{cost}</Text>
          </View>
        </View>
      </View>
      <View className="bg-white p-5 rounded-md flex flex-col gap-5 w-full max-w-[768px]">
      </View>
    </ScrollView>
  )
}

export default Storm