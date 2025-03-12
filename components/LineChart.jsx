import React from 'react';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';

const LineChart = ({ data, options }) => {
  if (!data) {
    return
  }

  return (
    <View>
      <RNLineChart
        data={data}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
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
        }}
        bezier
        {...options}
      />
    </View>
  );
};

export default LineChart;