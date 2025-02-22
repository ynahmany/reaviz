import React, { useState, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { number, object, text, select, boolean } from '@storybook/addon-knobs';
import { PieChart } from './PieChart';
import { categoryData, randomNumber, browserData, icons } from '../../demo';
import { PieArc, PieArcLabel, PieArcSeries } from './PieArcSeries';
import { schemes } from '../common/color';
import { ChartShallowDataShape } from '../common/data';

storiesOf('Charts/Pie Chart/Pie', module)
  .add('Simple', () => {
    const height = number('Height', 250);
    const width = number('Width', 350);
    const color = select('Color Scheme', schemes, 'cybertron');
    const data = object('Data', categoryData);

    return (
      <PieChart
        width={width}
        height={height}
        data={data}
        series={<PieArcSeries colorScheme={color} />}
      />
    );
  })
  .add('Explode', () => {
    const height = number('Height', 250);
    const width = number('Width', 350);
    const color = select('Color Scheme', schemes, 'cybertron');
    const data = object('Data', categoryData);

    return (
      <PieChart
        width={height}
        height={width}
        data={data}
        series={<PieArcSeries explode={true} colorScheme={color} />}
      />
    );
  })
  .add('No Animation', () => (
    <PieChart
      width={350}
      height={250}
      series={<PieArcSeries animated={false} />}
      data={browserData}
    />
  ))
  .add('HTML Labels', () => {
    const showIconsWithText = boolean('Show icons with text', false);
    const height = number('Height', 400);
    const width = number('Width', 400);
    const color = select('Color Scheme', schemes, 'cybertron');

    interface ChartDataItem extends ChartShallowDataShape<number> {
      key: string;
      metadata: {
        description: string;
        Icon?: React.ComponentType;
      };
    }

    const data: ChartDataItem[] = [
      {
        key: 'Chrome',
        data: 25000,
        metadata: {
          description: 'Chrome description',
          Icon: icons.Chrome
        }
      },
      {
        key: 'Safari',
        data: 2000,
        metadata: {
          description: 'Safari description',
          Icon: icons.Safari
        }
      },
      {
        key: 'FireFox',
        data: 2000,
        metadata: {
          description: 'FireFox description',
          Icon: icons.FireFox
        }
      },
      {
        key: 'Edge',
        data: 2000,
        metadata: {
          description: 'Edge description',
          Icon: icons.Edge
        }
      },
      {
        key: 'Github',
        data: 2000,
        metadata: {
          description: 'Github description',
          Icon: icons.Github
        }
      },
      {
        key: 'ReactJs',
        data: 2000,
        metadata: {
          description: 'React with really really long description',
          Icon: icons.ReactJs
        }
      },
      {
        key: 'Android',
        data: 2000,
        metadata: {
          description: 'Android description',
          Icon: icons.Android
        }
      },
      {
        key: 'Apple',
        data: 2000,
        metadata: {
          description: 'Apple description',
          Icon: icons.Apple
        }
      },
      {
        key: 'Ubuntu',
        data: 2000,
        metadata: {
          description: 'Ubuntu description',
          Icon: icons.Ubuntu
        }
      },
      {
        key: 'Windows',
        data: 2000,
        metadata: {
          description: 'Windows description',
          Icon: icons.Windows
        }
      },
      {
        key: 'Other',
        data: 500,
        metadata: {
          description: 'Other item, that should not have label'
        }
      }
    ];

    return (
      <div
        style={{
          width,
          height,
          overflow: 'hidden'
        }}
      >
        <PieChart
          width={width}
          height={height}
          data={data}
          series={
            <PieArcSeries
              colorScheme={color}
              label={
                <PieArcLabel
                  width={showIconsWithText ? 120 : 32}
                  height={24}
                  format={({
                    key,
                    data,
                    metadata,
                    textAnchor
                  }: ChartDataItem & { textAnchor: 'start' | 'end' }) => (
                    <ArcLabel
                      key={key}
                      title={key}
                      data={data}
                      description={metadata.description}
                      icon={metadata.Icon ? <metadata.Icon /> : null}
                      textAnchor={textAnchor}
                      showText={showIconsWithText}
                    />
                  )}
                />
              }
              arc={
                <PieArc
                  tooltip={showIconsWithText ? null : undefined}
                  cursor="pointer"
                />
              }
            />
          }
        />
      </div>
    );
  })
  .add('Label Overlap', () => {
    const labelsCount = number('Labels count', 32);

    return (
      <PieChart
        width={350}
        height={250}
        data={[...Array(labelsCount)].map((_, index) => ({
          key: index + 1,
          data: 1
        }))}
      />
    );
  })
  .add('Display All Labels', () => (
    <PieChart
      width={350}
      height={250}
      data={browserData}
      displayAllLabels={true}
    />
  ))
  .add('Live Updating', () => <LiveUpdatingStory />)
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <PieChart data={categoryData} />
    </div>
  ));

storiesOf('Charts/Pie Chart/Donut', module)
  .add('Simple', () => {
    const height = number('Height', 250);
    const width = number('Width', 350);
    const color = select('Color Scheme', schemes, 'cybertron');
    const data = object('Data', categoryData);

    return (
      <PieChart
        width={width}
        height={height}
        data={data}
        series={<PieArcSeries doughnut={true} colorScheme={color} />}
      />
    );
  })
  .add('Rounded and spaced', () => {
    const height = number('Height', 250);
    const width = number('Width', 350);
    const padAngle = number('Pad Angle', 0.02);
    const padRadius = number('Pad Radius', 200);
    const cornerRadius = number('Corner Radius', 4);
    const color = select('Color Scheme', schemes, 'cybertron');
    const data = object('Data', categoryData);

    return (
      <PieChart
        width={width}
        height={height}
        data={data}
        series={
          <PieArcSeries
            cornerRadius={cornerRadius}
            padAngle={padAngle}
            padRadius={padRadius}
            doughnut={true}
            colorScheme={color}
          />
        }
      />
    );
  })
  .add('Labels', () => (
    <PieChart
      width={350}
      height={250}
      data={categoryData}
      series={<PieArcSeries doughnut={true} />}
    />
  ))
  .add('Inner Label', () => {
    const height = number('Height', 250);
    const width = number('Width', 350);
    const words = text('Label', 'Attacks');
    const color = select('Color Scheme', schemes, 'cybertron');
    const data = object('Data', categoryData);

    return (
      <div
        style={{
          position: 'relative',
          height: '250px',
          width: '350px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <PieChart
            width={width}
            height={height}
            data={data}
            series={
              <PieArcSeries doughnut={true} label={null} colorScheme={color} />
            }
          />
        </div>
        <h2 style={{ margin: '0 5px', padding: 0, color: 'white' }}>
          {data.length} {words}
        </h2>
      </div>
    );
  });

const LiveUpdatingStory = () => {
  const [data, setData] = useState([...categoryData]);

  const updateData = () => {
    const newData = [...data];
    const updateCount = randomNumber(1, 4);

    let idx = 0;
    while (idx <= updateCount) {
      const updateIndex = randomNumber(0, data.length - 1);
      newData[updateIndex] = {
        ...newData[updateIndex],
        data: randomNumber(10, 100)
      };

      idx++;
    }

    setData(newData);
  };

  return (
    <Fragment>
      <PieChart width={350} height={250} data={data} />
      <br />
      <button onClick={updateData}>Update</button>
    </Fragment>
  );
};

const ArcLabel = React.memo(function ArcLabel({
  title,
  description,
  data,
  icon,
  textAnchor,
  showText
}: {
  title: string;
  description: string;
  data: number; // the chart data value we labeling
  icon: React.ReactElement | null;
  textAnchor: 'start' | 'end';
  showText: boolean;
}) {
  const iconContainer = (
    <div
      style={{
        [textAnchor === 'start' ? 'marginRight' : 'marginLeft']: showText
          ? '4px'
          : 0,
        width: '24px',
        height: '24px',
        fill: '#fff',
        flexShrink: 0
      }}
    >
      {icon}
    </div>
  );

  const ellipsis: React.CSSProperties = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  };

  return (
    <div
      style={{
        margin: '0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: `flex-${textAnchor}`,
        lineHeight: 1,
        height: '24px',
        textAlign: textAnchor === 'start' ? 'left' : 'right'
      }}
    >
      {textAnchor === 'start' && iconContainer}
      <div style={{ minWidth: 0 }}>
        <div style={ellipsis}>
          {title} - {data}
        </div>
        <div style={ellipsis}>{description}</div>
      </div>
      {textAnchor === 'end' && iconContainer}
    </div>
  );
});
