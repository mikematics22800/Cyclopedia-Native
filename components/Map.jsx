import React, { useContext, useState, useEffect } from "react";
import MapView, { Marker, Polyline, Polygon, Callout } from "react-native-maps";
import { View, Text, Button } from "react-native";
import { Context } from "../App";

const Map = () => {
  const { season, setStormId, storm, year, windField } = useContext(Context);

  const toggleFullscreen = () => {
  };

  const storms = season.map((storm) => {
    const id = storm.id;
    const name = id.split('_')[1];
    const positions = [];
    const points = storm.data.map((point, i) => {
      const dateArray = point.date.toString().split('');
      const year = dateArray.slice(0, 4).join('');
      const month = dateArray.slice(4, 6).join('');
      const day = dateArray.slice(-2).join('');
      const date = `${month}/${day}/${year}`;
      const timeArray = point.time_utc.toString().split('');
      const hour = timeArray.slice(0, 2).join('');
      const minute = timeArray.slice(-2).join('');
      const time = `${hour}:${minute}`;
      const { lat, lng } = point;
      const coords = { latitude: lat, longitude: lng };
      positions.push(coords);

      const wind = point.max_wind_kt;
      let status;
      let color;
      if (point.status === 'LO') {
        status = "Tropical Low";
        color = "lightgray";
      }
      if (point.status === 'DB') {
        status = "Tropical Disturbance";
        color = "lightgray";
      }
      if (point.status === 'WV') {
        status = "Tropical Wave";
        color = "lightgray";
      }
      if (point.status === 'EX' || point.status === 'ET') {
        status = "Extratropical Cyclone";
        color = "lightgray";
      }
      if (point.status === 'SD') {
        status = "Subtropical Depression";
        color = "aqua";
      }
      if (point.status === 'SS') {
        status = "Subtropical Storm";
        color = "lightgreen";
      }
      if (point.status === 'TD') {
        status = "Tropical Depression";
        color = "#0096FF";
      }
      if (point.status === 'TS') {
        status = "Tropical Storm";
        color = "lime";
      }
      if (point.status === 'HU' || point.status === 'TY') {
        if (wind <= 82) {
          status = 'Category 1 Hurricane';
          color = 'yellow';
        }
        if (wind > 82 && wind <= 95) {
          status = 'Category 2 Hurricane';
          color = 'orange';
        }
        if (wind > 95 && wind <= 110) {
          status = 'Category 3 Hurricane';
          color = 'red';
        }
        if (wind > 110 && wind <= 135) {
          status = 'Category 4 Hurricane';
          color = 'hotpink';
        }
        if (wind > 135) {
          status = 'Category 5 Hurricane';
          color = 'pink';
        }
      }

      const pressure = point.min_pressure_mb;

      const fullName = name !== 'Unnamed' ? `${status} ${name}` : `${name} ${status}`;

      return (
        <Marker key={i} coordinate={coords} pinColor={color} onPress={() => setStormId(id)}>
          <Callout>
            <Text style={{ fontWeight: 'bold' }}>{fullName}</Text>
            <Text>{date} at {time} UTC</Text>
            <Text>Maximum Wind: {wind} kt</Text>
            <Text>Minimum Pressure: {pressure ? `${pressure} mb` : 'Unknown'}</Text>
          </Callout>
        </Marker>
      );
    });
    return (
      <View key={id}>
        <Polyline coordinates={positions} strokeColor="gray" strokeWidth={1} />
        {points}
      </View>
    );
  });

  const nmToDeg = (nm) => nm / 60;

  const calculatePoints = (lat, lng, points, radii = {}) => {
    let { ne, se, sw, nw } = radii;
    if (!ne) { ne = 0; }
    if (!se) { se = 0; }
    if (!sw) { sw = 0; }
    if (!nw) { nw = 0; }
    let radius;
    for (let angle = 0; angle < 360; angle += 1) {
      if (angle >= 0 && angle < 90) radius = ne;
      else if (angle >= 90 && angle < 180) radius = se;
      else if (angle >= 180 && angle < 270) radius = sw;
      else radius = nw;
      const degs = nmToDeg(radius);
      const pointLat = lat + degs * Math.cos((angle * Math.PI) / 180);
      const pointLng = lng + degs * Math.sin((angle * Math.PI) / 180);
      points.push({ latitude: pointLat, longitude: pointLng });
    }
  };

  let windField34kt;
  let windField50kt;
  let windField64kt;

  if (year >= 2004) {
    windField34kt = storm.data.map((point, i) => {
      const { lat, lng } = point;
      const points34kt = [];
      calculatePoints(lat, lng, points34kt, point["34kt_wind_nm"]);
      return (
        <Polygon key={i} coordinates={points34kt} strokeColor="yellow" fillColor="rgba(255, 255, 0, 0.5)">
          <Callout>
            <Text style={{ fontWeight: 'bold' }}>34+ kt</Text>
          </Callout>
        </Polygon>
      );
    });

    windField50kt = storm.data.map((point, i) => {
      const { lat, lng } = point;
      const points50kt = [];
      calculatePoints(lat, lng, points50kt, point["50kt_wind_nm"]);
      return (
        <Polygon key={i} coordinates={points50kt} strokeColor="orange" fillColor="rgba(255, 165, 0, 0.5)">
          <Callout>
            <Text style={{ fontWeight: 'bold' }}>50+ kt</Text>
          </Callout>
        </Polygon>
      );
    });

    windField64kt = storm.data.map((point, i) => {
      const { lat, lng } = point;
      const points64kt = [];
      calculatePoints(lat, lng, points64kt, point["64kt_wind_nm"]);
      return (
        <Polygon key={i} coordinates={points64kt} strokeColor="red" fillColor="rgba(255, 0, 0, 0.5)">
          <Callout>
            <Text style={{ fontWeight: 'bold' }}>64+ kt</Text>
          </Callout>
        </Polygon>
      );
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 30,
          longitude: -120,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        {storms}
        {year >= 2004 && windField && <>
          {windField34kt}
          {windField50kt}
          {windField64kt}
        </>}
      </MapView>
      <Button title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} onPress={toggleFullscreen} />
    </View>
  );
};

export default Map;