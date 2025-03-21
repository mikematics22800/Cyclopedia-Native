import { useState, useEffect, createContext } from "react"
import "./global.css"
import { useFonts } from 'expo-font';
import { View, Image, Text } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import getHurdat from "./libs/hurdat"
import Interface from "./components/Interface"
import cyclone from './assets/images/cyclone.png'
import { sum } from "./libs/sum"

export const Context = createContext()

function App() {
  useFonts({'storm-font': require('./assets/fonts/storm.ttf')});

  const [basin, setBasin] = useState('atl')
  const [year, setYear] = useState(2023)
  const [season, setSeason] = useState(null)
  const [storm, setStorm] = useState(null)
  const [stormId, setStormId] = useState(null)
  const [dates, setDates] = useState(null)
  const [landfallingStorms, setLandfallingStorms] = useState(null)
  const [windField, setWindField] = useState(false)
  const [names, setNames] = useState(null)
  const [seasonACE, setSeasonACE] = useState(null)

  useEffect(() => {
    if (year < 1949 && basin === 'pac') setYear(1949)
    const fetchCache = async () => {
      const cache = await AsyncStorage.getItem(`cyclopedia-${basin}-${year}`)
      if (cache) {
        setSeason(JSON.parse(cache))
        setStormId(JSON.parse(cache)[0].id)
      } else {
        setSeason(null)
        setStorm(null)
        getHurdat(basin, year).then(data => {
          setSeason(data)
          setStormId(data[0].id)
          AsyncStorage.setItem(`cyclopedia-${basin}-${year}`, JSON.stringify(data))
        })
      }
    }
    fetchCache()
  }, [basin, year])

  useEffect(() => {
    if (season) {
      const storm = season.find(storm => storm.id === stormId)
      setStorm(storm)
    }
  }, [stormId]);

  useEffect(() => {
    if (storm) {
      const dates = storm.data.map((point) => {
        const dateArray = point?.date.toString().split("")
        const month = dateArray.slice(4,6).join("")
        const day = dateArray.slice(-2).join("")
        return `${month}/${day}`
      })
      setDates(dates)
    }
  }, [storm])

  useEffect(() => {
    const landfallingStorms = []
    if (season) {
      season.forEach((storm) => {
        let landfall = false
        storm.data.forEach((point) => {
          if (point.record === "L") {
            landfall = true
          }
        })
        if (landfall === true) {
          landfallingStorms.push(storm)
        }
      })
      setLandfallingStorms(landfallingStorms)
    }
    const names = season?.map((storm) => {
      return storm.id.split('_')[1]
    })
    setNames(names)

    const seasonACE = season?.map((storm) => {
      let ACE = 0
      let windArray = []
      storm.data.forEach((point) => {
        const wind = point.max_wind_kt
        const hour = point.time_utc
        if (["TS", "SS", "HU"].includes(point.status)) {
          if (hour % 600 === 0) {
            ACE += Math.pow(wind, 2)/10000
            if (windArray.length > 0) {
              const average = sum(windArray)/windArray.length
              ACE += Math.pow(average, 2)/10000
              windArray = []
            }
          } else {
            windArray.push(wind)
          }
        }
      })
      return ACE
    })
    setSeasonACE(seasonACE)
  }, [season]);

  const value = {
    basin,
    setBasin, 
    year, 
    setYear, 
    season, 
    setSeason, 
    storm, 
    setStorm, 
    stormId, 
    setStormId, 
    dates, 
    landfallingStorms, 
    windField, 
    setWindField,
    names,
    seasonACE
  }

  return (
    <Context.Provider value={value}>
      {season && storm ? (
        <View className="h-screen w-screen flex overflow-hidden xl:flex-row flex-col">
          <Interface/>
        </View>
      ) : (
        <View className="w-screen h-screen flex flex-col items-center justify-center bg-blue-950">
          <Image source={cyclone} className="!w-40 !h-40 animate-spin mb-20"/>
          <Text className="text-white text-4xl" style={{fontFamily: 'storm-font'}}>LOADING...</Text>
        </View>
      )}
    </Context.Provider>
  )
}

export default App
