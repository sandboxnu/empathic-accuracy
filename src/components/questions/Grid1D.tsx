import { GridAxisLabel } from "lib/types";
import { Line, Stage, Layer, Text } from "react-konva";

const WIDTH = 400;

export default function Grid1D({
  x,
  label,
  axis,
}: {
  x: number;
  label: string;
  axis: GridAxisLabel;
}) {
  return (
    <div>
      <div className="questionTitle">{label}</div>
      <Stage style={{ background: "white" }} width={WIDTH} height={80}>
        <Layer>
          <Line stroke="black" points={[0, 40, WIDTH, 40]} strokeWidth={1} />
          <Text text={axis.low} x={0} y={20} align="center" />
          <Text
            text={axis.high}
            x={WIDTH - 60}
            y={20}
            align="right"
            width={60}
          />
          <Text
            text="neutral"
            x={WIDTH / 2 - 30}
            y={20}
            align="center"
            width={60}
          />
          <Line
            stroke="black"
            points={[x * WIDTH, 35, x * WIDTH, 45]}
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    </div>
  );
}
