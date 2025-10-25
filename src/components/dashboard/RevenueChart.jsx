import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "Apr 1, 2022", revenue: 0 },
  { date: "Apr 8, 2022", revenue: 5500 },
  { date: "Apr 15, 2022", revenue: 4200 },
  { date: "Apr 22, 2022", revenue: 5200 },
  { date: "Apr 30, 2022", revenue: 0 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
};

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className='h-[200px] sm:h-[250px] lg:h-[300px] w-full'>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,

        }}

      >
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={true}
          tickMargin={2}
          strokeWidth={1}
          domain={['dataMin', 'dataMax']}
          scale="point"
          padding={{ left: 20, right: 20 }}
          ticks={[chartData[0].date, chartData[chartData.length - 1].date]}

        />
        <ReferenceLine
          y0="100%"
          stroke="hsl(var(--secondary-foreground))"
          strokeWidth={1}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="revenue"
          type="natural"
          stroke="var(--chart-1)"
          strokeWidth={1}
          dot={false}
          connectNulls={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
