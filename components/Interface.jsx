import { useState, useEffect, useContext } from "react";
import { Context } from "../App";
import { ScrollView, View, Text, Image, Pressable } from 'react-native' 
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import cyclone from "../assets/images/cyclone.png"
import Storm from "./Storm";
import Season from "./Season";

const Interface = () => {
  const [seasonStats, setSeasonStats] = useState(false)

  const { basin, setBasin, year, setYear, stormId, setStormId, windField, setWindField, season } = useContext(Context)

  const toggleStats = () => {
    if (seasonStats === false) {
      setSeasonStats(true)
    } else {
      setSeasonStats(false)
    }
  }

  const startYear = basin === 'atl' ? 1850 : 1948
  const years = new Array(2023 - startYear).fill(0)

  const [stormIds, setStormIds] = useState(null)             

  useEffect(() => {
    const stormIds = season.map((storm) => {
      return storm.id    
    })
    setStormIds(stormIds) 
  }, [season])

  return (
    <ScrollView className="w-screen h-1/2 bg-blue-950 p-10 flex flex-col">
      <View className="flex flex-row justify-between w-full mb-10">
        <View className="flex flex-row items-center">
          <Image source={cyclone} style={{ height: 40, width: 40, marginRight: 8 }}/>
          <Text className="text-4xl text-white font-bold" style={{fontFamily: 'storm-font'}}>CYCLOPEDIA</Text>
        </View>
        <Pressable
          className={`h-10 p-4 rounded-lg flex items-center justify-center ${
            seasonStats ? 'bg-blue-600' : 'bg-purple-600'
          }`}
          onPress={toggleStats}
        >
          <Text className="text-white font-bold">
            {seasonStats ? "Storms" : "Season"}
          </Text>
        </Pressable>
      </View>
      <View className="flex flex-row gap-5 w-full justify-center mb-10">
        <Picker
          className="bg-white rounded-md h-10 px-2"
          selectedValue={basin}
          onValueChange={(itemValue) => setBasin(itemValue)}
        >
          <Picker.Item label="Atlantic" value="atl" />
          <Picker.Item label="Pacific" value="pac" />
        </Picker>
        <Picker
          className="bg-white rounded-md h-10 px-2"
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          {years.map((_, index) => {
            const selectedYear = 2023 - index;
            return (<Picker.Item key={index} label={`${selectedYear}`} value={selectedYear} />);
          })}
        </Picker>
        <Picker
          className="bg-white rounded-md h-10 px-2"
          selectedValue={stormId}
          onValueChange={(itemValue) => setStormId(itemValue)}
        >
          {stormIds?.map((id) => {
            const name = id.split('_')[1]
            return (<Picker.Item key={id} label={name} value={id} />);
          })}
        </Picker>
        {year >= 2004 && <View className="flex flex-row items-center gap-1">
          <Checkbox 
            className="!text-white !p-0" 
            status={windField ? 'checked' : 'unchecked'} 
            onPress={() => setWindField((prev) => !prev)}
          />
          <Text className="text-white font-bold">Wind Field</Text>
        </View>}
      </View>
      {seasonStats === false ? <Storm/> : <Season/>}
    </ScrollView>
  )
}

export default Interface