import { useState, useEffect, useContext } from "react";
import { Context } from "../App";
import { ScrollView, View, Text } from 'react-native' 
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import cyclone from "../../public/cyclone.png"
import Storm from "./Storm";
import Season from "./Season";

const Interface = () => {
  const [seasonStats, setSeasonStats] = useState(false)

  const { basin, setBasin, year, setYear, stormId, setStormId, setWindField, season } = useContext(Context)

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
    <ScrollView className="xl:w-1/2 xl:h-full w-screen h-1/2 bg-blue-950 p-10 overflow-auto flex flex-col gap-10">
      <View className="flex justify-between w-full">
        <View className="flex items-center">
          <Image src={cyclone} className="h-10 mr-2"/>
          <Text className="storm-font text-4xl text-white font-bold">CYCLOPEDIA</Text>
        </View>
        <Button onClick={toggleStats} className={`button ${seasonStats ? 'bg-blue-600' : 'bg-purple-600'}`} variant="contained">
          <Text className="font-sans font-bold">{seasonStats ? ("Storms") : ("Season")}</Text>
        </Button>
      </View>
      <View className="flex gap-5 w-full justify-center">
      <Picker
          selectedValue={basin}
          onValueChange={(itemValue) => setBasin(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          <Picker.Item label="Atlantic" value="atl" />
          <Picker.Item label="Pacific" value="pac" />
        </Picker>
        <Picker
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {years.map((_, index) => {
            const selectedYear = 2023 - index;
            return (<Picker.Item key={index} label={`${selectedYear}`} value={selectedYear} />);
          })}
        </Picker>
        <Picker
          selectedValue={stormId}
          onValueChange={(itemValue) => setStormId(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {stormIds?.map((id) => {
            const name = id.split('_')[1]
            return (<Picker.Item key={id} label={name} value={id} />);
          })}
        </Picker>
        {year >= 2004 && <View className="flex items-center gap-1">
          <Checkbox className="!text-white !p-0" onPress={(e) => {setWindField(!setWindField)}}/>
          <Text className="text-white font-bold">Wind Field</Text>
        </View>}
      </View>
      {seasonStats === false ? <Storm/> : <Season/>}
    </ScrollView>
  )
}

export default Interface