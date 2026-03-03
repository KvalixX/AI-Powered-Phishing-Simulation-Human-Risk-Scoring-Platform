import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

// Sample data for different chart types
const areaChartData = [
  { month: "Jan", sent: 24000, reported: 12400 },
  { month: "Feb", sent: 18500, reported: 8750 },
  { month: "Mar", sent: 32000, reported: 15800 },
  { month: "Apr", sent: 27800, reported: 13200 },
  { month: "May", sent: 21900, reported: 9600 },
  { month: "Jun", sent: 29500, reported: 16300 },
];

const lineChartData = [
  { day: "Mon", clicks: 24, trainings: 45 },
  { day: "Tue", clicks: 13, trainings: 32 },
  { day: "Wed", clicks: 98, trainings: 67 },
  { day: "Thu", clicks: 39, trainings: 54 },
  { day: "Fri", clicks: 48, trainings: 78 },
  { day: "Sat", clicks: 38, trainings: 56 },
  { day: "Sun", clicks: 43, trainings: 65 },
];

const pieChartData = [
  { name: "Urgency", value: 65, fill: "#ef4444" },
  { name: "Authority", value: 28, fill: "#0c0a09" },
  { name: "Opportunity", value: 7, fill: "#22c55e" },
];

const barChartData = [
  { category: "Q1", risk_high: 120, risk_low: 480 },
  { category: "Q2", risk_high: 90, risk_low: 560 },
  { category: "Q3", risk_high: 60, risk_low: 620 },
  { category: "Q4", risk_high: 40, risk_low: 900 },
];

const areaChartConfig = {
  sent: {
    label: "Emails Sent",
    color: "#22c55e",
  },
  reported: {
    label: "Reported",
    color: "#0c0a09",
  },
};

const lineChartConfig = {
  clicks: {
    label: "Phishing Clicks",
    color: "#ef4444",
  },
  trainings: {
    label: "Trainings Completed",
    color: "#22c55e",
  },
};

const barChartConfig = {
  risk_high: {
    label: "High Risk",
    color: "#ef4444",
  },
  risk_low: {
    label: "Low Risk",
    color: "#22c55e",
  },
};

const pieChartConfig = {
  urgency: {
    label: "Urgency",
    color: "#ef4444",
  },
  authority: {
    label: "Authority",
    color: "#0c0a09",
  },
  opportunity: {
    label: "Opportunity",
    color: "#22c55e",
  },
};

export function ChartsShowcase() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Area Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Campaign Efficacy</CardTitle>
          <p className="text-sm text-gray-500">Sent vs Reported emails</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaChartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c0a09" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0c0a09" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stackId="1"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stackId="1"
                  stroke="#0c0a09"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Human Risk Activity</CardTitle>
          <p className="text-sm text-gray-500">Clicks vs Trainings</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="day"
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2, fill: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="trainings"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Phishing Styles</CardTitle>
          <p className="text-sm text-gray-500">Simulated attack vectors</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quarterly Risk Posture</CardTitle>
          <p className="text-sm text-gray-500">High vs Low risk employees</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="category"
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="risk_low"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Low Risk"
                />
                <Bar
                  dataKey="risk_high"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="High Risk"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}