import { CartesianChart, Bar } from "victory-native";

export function MyChart({data}) {
  return (
    <CartesianChart data={data} xKey="x" yKeys={["y"]}>
      {({ points, chartBounds }) => (
        <Bar
          points={points.y}
          chartBounds={chartBounds}
          color="red"
          roundedCorners={{ topLeft: 10, topRight: 10 }}
        />
      )}
    </CartesianChart>
  );
}