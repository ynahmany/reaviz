import React, {
  Fragment,
  ReactElement,
  FC,
  useCallback,
  useState
} from 'react';
import { PointSeries, PointSeriesProps } from './PointSeries';
import { Area, AreaProps } from './Area';
import { MarkLine, MarkLineProps } from '../../common/MarkLine';
import {
  ChartInternalDataShape,
  ChartInternalNestedDataShape,
  ChartInternalShallowDataShape
} from '../../common/data';
import { CloneElement } from 'rdk';
import {
  TooltipArea,
  TooltipAreaProps,
  TooltipAreaEvent
} from '../../common/Tooltip';
import { Line, LineProps } from './Line';
import { InterpolationTypes } from '../../common/utils/interpolation';
import {
  getColor as getColorCommon,
  ColorSchemeType
} from '../../common/color';

export type AreaChartTypes =
  | 'standard'
  | 'grouped'
  | 'stacked'
  | 'stackedNormalized';

export interface AreaSeriesProps {
  /**
   * Id set internally by `AreaChart`.
   */
  id: string;

  /**
   * D3 scale for X Axis. Set internally by `AreaChart`.
   */
  xScale: any;

  /**
   * D3 scale for Y Axis. Set internally by `AreaChart`.
   */
  yScale: any;

  /**
   * Parsed data shape. Set internally by `AreaChart`.
   */
  data: ChartInternalDataShape[];

  /**
   * Height of the chart. Set internally by `AreaChart`.
   */
  height: number;

  /**
   * Width of the chart. Set internally by `AreaChart`.
   */
  width: number;

  /**
   * Whether to animate the enter/update/exit.
   */
  animated: boolean;

  /**
   * Type of area chart to render.
   */
  type: AreaChartTypes;

  /**
   * Interpolation type for the area/line.
   */
  interpolation: InterpolationTypes;

  /**
   * Tooltip for the chart area.
   */
  tooltip: ReactElement<TooltipAreaProps, typeof TooltipArea>;

  /**
   * Markline for the chart.
   */
  markLine: ReactElement<MarkLineProps, typeof MarkLine> | null;

  /**
   * Symbols used to show points.
   */
  symbols: ReactElement<PointSeriesProps, typeof PointSeries> | null;

  /**
   * Line that is rendered.
   */
  line: ReactElement<LineProps, typeof Line> | null;

  /**
   * Area that is rendered.
   */
  area: ReactElement<AreaProps, typeof Area> | null;

  /**
   * Color scheme for the series.
   */
  colorScheme: ColorSchemeType;

  /**
   * Whether the chart has been zoomed or not. Set internally by `AreaChart`.
   */
  isZoomed: boolean;
}

interface AreaSeriesState {
  activeValues?: any;
  activePoint?: number;
}

// For area charts, often symbols exceed the area
// and we want to add a little bit of padding to prevent clipping
const PADDING = 25;
const HALF_PADDING = PADDING / 2;
const initialAreaState: AreaSeriesState = {
  activePoint: undefined,
  activeValues: undefined
};
export const AreaSeries: FC<Partial<AreaSeriesProps>> = ({
  colorScheme = 'cybertron',
  animated = true,
  interpolation = 'linear',
  type = 'standard',
  line = <Line />,
  area = <Area />,
  markLine = <MarkLine />,
  tooltip = <TooltipArea />,
  symbols = <PointSeries />,
  data,
  height,
  id,
  width,
  isZoomed,
  xScale,
  yScale
}) => {
  const [areaState, setAreaState] = useState<AreaSeriesState>(initialAreaState);

  const getColor = (point, index: number) => {
    const { activeValues } = areaState;
    const key = Array.isArray(point) ? point[0].key : point?.key;

    return getColorCommon({
      data,
      colorScheme,
      active: activeValues,
      point,
      index,
      key
    });
  };

  const onValueEnter = (event: TooltipAreaEvent) => {
    setAreaState({
      activePoint: event.pointX,
      activeValues: event.value
    });
  };

  const onValueLeave = () => {
    setAreaState(initialAreaState);
  };

  const renderArea = useCallback(
    (shallowData: ChartInternalShallowDataShape[], index = 0) => {
      return (
        <Fragment>
          {line && (
            <CloneElement<LineProps>
              element={line}
              xScale={xScale}
              yScale={yScale}
              data={shallowData}
              width={width}
              index={index}
              hasArea={area !== null}
              animated={animated}
              interpolation={interpolation}
              color={getColor}
            />
          )}
          {area && (
            <CloneElement<AreaProps>
              element={area}
              id={`${id}-area-${index}`}
              xScale={xScale}
              yScale={yScale}
              data={shallowData}
              index={index}
              animated={animated}
              interpolation={interpolation}
              color={getColor}
            />
          )}
        </Fragment>
      );
    },
    [line, xScale, yScale, width, animated, interpolation]
  );

  const renderSymbols = useCallback(
    (shallowData: ChartInternalShallowDataShape[], index = 0) => {
      const { activeValues } = areaState;

      const visible = symbols !== null;
      const activeSymbols =
        (symbols && symbols.props.activeValues) || activeValues;

      // Animations are only valid for Area
      const isAnimated = area !== undefined && animated && !activeSymbols;

      return (
        <Fragment>
          {visible && (
            <CloneElement<PointSeriesProps>
              element={symbols}
              key={`point-series-${id}`}
              id={id}
              height={height}
              width={width}
              activeValues={activeSymbols}
              xScale={xScale}
              yScale={yScale}
              index={index}
              data={shallowData}
              animated={isAnimated}
              color={() => getColor(shallowData, index)}
            />
          )}
        </Fragment>
      );
    },
    [areaState, symbols, height, width, xScale, yScale]
  );

  const renderMarkLine = useCallback(() => {
    const { activePoint, activeValues } = areaState;

    return (
      <Fragment>
        {activeValues && markLine && (
          <CloneElement<MarkLineProps>
            element={markLine}
            height={height}
            pointX={activePoint}
          />
        )}
      </Fragment>
    );
  }, [areaState, markLine, height]);

  const renderSingleSeries = useCallback(
    (shallowData: ChartInternalShallowDataShape[]) => {
      return (
        <Fragment>
          {renderArea(shallowData)}
          {renderMarkLine()}
          {renderSymbols(shallowData)}
        </Fragment>
      );
    },
    []
  );

  const renderMultiSeries = useCallback(
    (nestedData: ChartInternalNestedDataShape[]) => {
      return (
        <Fragment>
          {nestedData
            .map((point, index) => (
              <Fragment key={`${point.key!.toString()}`}>
                {renderArea(point.data, index)}
              </Fragment>
            ))
            .reverse()}
          {renderMarkLine()}
          {nestedData
            .map((point, index) => (
              <Fragment key={`${point.key!.toString()}`}>
                {renderSymbols(point.data, index)}
              </Fragment>
            ))
            .reverse()}
        </Fragment>
      );
    },
    []
  );

  const isMulti =
    type === 'grouped' || type === 'stacked' || type === 'stackedNormalized';

  return (
    <Fragment>
      <defs>
        <clipPath id={`${id}-path`}>
          <rect
            width={isZoomed ? width : width + PADDING}
            height={height + PADDING}
            x={isZoomed ? 0 : -HALF_PADDING}
            y={-HALF_PADDING}
          />
        </clipPath>
      </defs>
      <CloneElement<TooltipAreaProps>
        element={tooltip}
        xScale={xScale}
        yScale={yScale}
        data={data}
        height={height}
        width={width}
        color={getColor}
        onValueEnter={(e: TooltipAreaEvent) => onValueEnter(e)}
        onValueLeave={() => onValueLeave()}
      >
        <g clipPath={`url(#${id}-path)`}>
          {isMulti && renderMultiSeries(data as ChartInternalNestedDataShape[])}
          {!isMulti &&
            renderSingleSeries(data as ChartInternalShallowDataShape[])}
        </g>
      </CloneElement>
    </Fragment>
  );
};
