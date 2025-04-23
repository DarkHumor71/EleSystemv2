import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

/**
 * LineChart component renders a responsive line chart using the Nivo library.
 * It takes data representing apartment costs over time, processes it, and displays it on a line chart.
 * Optionally, it allows for customization of line colors and behavior based on whether the chart is used within a dashboard or not.
 *
 * @param {Object} props
 * @param {boolean} [props.isCustomLineColors=false] - Flag to toggle custom line colors.
 * @param {boolean} [props.isDashboard=false] - Flag to customize chart axis legend for dashboard usage.
 * @param {Array} [props.data=[]] - Array of data objects representing apartment expenses over time.
 * @returns {ReactNode} - JSX representing the responsive line chart.
 */
const LineChart = ({
  isCustomLineColors = false,
  isDashboard = false,
  data = [],
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Group the data by apartment and date
  const grouped = data.reduce((acc, entry) => {
    const apt = entry?.apartment_number || '';
    const date = new Date(entry.createdAt).toISOString().split('T')[0];
    const cost = parseFloat(entry.cost);

    if (!acc[apt]) acc[apt] = {};
    if (!acc[apt][date]) acc[apt][date] = 0;

    acc[apt][date] += cost;
    return acc;
  }, {});

  // Prepare the chart data
  const chartData = Object.entries(grouped).map(([apt, dates]) => ({
    id: `Apartment ${apt}`,
    data: Object.entries(dates)
      .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort by date
      .map(([date, cost]) => ({ x: date, y: cost })),
  }));

  return (
    <ResponsiveLine
      data={chartData} // Pass the data as an array
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isCustomLineColors ? { datum: 'color' } : { scheme: 'nivo' }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        precision: 'day',
        useUTC: false,
      }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: '%Y-%m-%d',
        tickValues: 'every 1 month',
        tickRotation: -45,
        legend: 'Date',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Cost ($)',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={chartData?.some((d) => d.data?.length > 0)}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
