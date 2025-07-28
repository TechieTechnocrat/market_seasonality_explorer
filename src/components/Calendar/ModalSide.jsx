import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { setShowModal } from "../../slices/calendarSlice";
export const ModalSide = () => {
  const dispatch = useDispatch();
  const { showModal, selectedDate, calendarData } = useSelector(
    (state) => state.calendar
  );

  const getVolatilityColor = (volatility) => {
    if (volatility < 2) return "low";
    if (volatility < 5) return "medium";
    return "high";
  };

  const getPerformanceIndicator = (priceChange) => {
    if (priceChange > 1) return "positive";
    if (priceChange < -1) return "negative";
    return "neutral";
  };

  const handleCloseModal = () => {
    dispatch(setShowModal(false));
  };

  if (!showModal || !selectedDate) return null;
  // Instead, since selectedDate is already a "YYYY-MM-DD" string
  const dateKey = selectedDate;
  // For display:
  const [year, month, day] = dateKey.split("-");
  const selectedDateObj = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
  const selectedData = calendarData[dateKey];


  if (!selectedData) return null;

  // For trend charts, grab N surrounding days for trendlines
  const trendDays = [];
  for (let offset = -7; offset <= 7; offset++) {
    const d = new Date(selectedDateObj);
    d.setDate(d.getDate() + offset);
    const key = d.toISOString().split("T")[0];
    const data = calendarData[key];
    if (data) trendDays.push({ ...data, date: key });
  }

  // Prepare OHLC
  const ohlcData = [
    { name: "Open", value: selectedData.open },
    { name: "High", value: selectedData.high },
    { name: "Low", value: selectedData.low },
    { name: "Close", value: selectedData.close },
  ];

  // For mini volatility/volume dual line chart (if trendDays available)
  const volatilityVolumeTrend = trendDays.map((d) => ({
    date: d.date.slice(5), // MM-DD for display
    volatility: d.volatility,
    volume: d.volume,
    price: d.close,
    priceChange: d.priceChange,
  }));

  // Example moving average (7-days) on closing price
  let movingAvg = [];
  if (volatilityVolumeTrend.length >= 7) {
    movingAvg = volatilityVolumeTrend
      .map((v, i, arr) => {
        if (i < 3 || i > arr.length - 4) return null;
        const slice = arr.slice(i - 3, i + 4);
        const avg = slice.reduce((sum, d) => sum + d.price, 0) / slice.length;
        return { ...v, MA7: avg };
      })
      .filter(Boolean);
  }

  // Intraday sample (fake if not present)
  const intradaySample = selectedData.intraday
    ? selectedData.intraday
    : [
        { time: "09:10", price: selectedData.open },
        { time: "12:10", price: (selectedData.open + selectedData.close) / 2 },
        { time: "15:10", price: selectedData.close },
      ];

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {selectedDateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Price Change</div>
              <div
                className={`metric-value ${getPerformanceIndicator(
                  selectedData.priceChange
                )}`}
              >
                {selectedData.priceChange > 0 ? "+" : ""}
                {selectedData.priceChange.toFixed(2)}%
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Volatility</div>
              <div
                className={`metric-value ${getVolatilityColor(
                  selectedData.volatility
                )}`}
              >
                {selectedData.volatility.toFixed(2)}%
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Volume</div>
              <div className="metric-value">
                {(selectedData.volume / 1000000).toFixed(1)}M
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Trades</div>
              <div className="metric-value">
                {selectedData.trades.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="price-details">
            <h4>Price Details</h4>
            <div className="price-row">
              <span>Open:</span>
              <span>${selectedData.open.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>High:</span>
              <span>${selectedData.high.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Low:</span>
              <span>${selectedData.low.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Close:</span>
              <span>${selectedData.close.toLocaleString()}</span>
            </div>
          </div>

          <div className="mini-chart" style={{ marginBottom: 0 }}>
            <h5>OHLC for Day</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ohlcData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip />
                <Bar dataKey="value" fill="#308fee" radius={[7, 7, 7, 7]}>
                  <LabelList dataKey="value" position="top" fontSize={13} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Intraday chart (if available) */}
          <div className="mini-chart" style={{ marginBottom: 0 }}>
            <h5>Intraday Price</h5>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={intradaySample}>
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis domain={["dataMin", "dataMax"]} hide />
                <Tooltip />
                <Line
                  dataKey="price"
                  type="monotone"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine
                  y={selectedData.open}
                  label="Open"
                  stroke="#8884d8"
                  strokeDasharray="3 2"
                />
                <ReferenceLine
                  y={selectedData.close}
                  label="Close"
                  stroke="#308fee"
                  strokeDasharray="3 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Trend - Volatility/Volume Dual Axis */}
          {volatilityVolumeTrend.length > 4 && (
            <div className="mini-chart" style={{ marginBottom: 0 }}>
              <h5>Past/Future Trend</h5>
              <ResponsiveContainer width="100%" height={150}>
                <ComposedChart data={volatilityVolumeTrend}>
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <Tooltip />
                  <Bar
                    yAxisId="right"
                    dataKey="volume"
                    fill="#a1a1aa"
                    opacity={0.19}
                    barSize={12}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="volatility"
                    stroke="#eab308"
                    strokeWidth={2}
                  />
                  {movingAvg && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="MA7"
                      stroke="#308fee"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
