import { useArchetypeReport } from "@/hooks/use-arguments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
  const { data: report, isLoading } = useArchetypeReport();

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Generating analysis...</div>;

  const chartData = report || [];
  const totalArguments = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-primary">Analytics Reports</h2>
        <p className="text-muted-foreground mt-1">Deep dive into your argumentative structure distribution.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="col-span-1 shadow-md border-border/60">
          <CardHeader>
            <CardTitle>Archetype Distribution</CardTitle>
            <CardDescription>Breakdown of arguments by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="archetype"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md border-border/60">
          <CardHeader>
            <CardTitle>Argument Volume</CardTitle>
            <CardDescription>Quantity of arguments per archetype.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="archetype" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm bg-primary/5 border-primary/10">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-primary mb-2">Analysis Summary</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You have cataloged a total of <span className="font-bold text-foreground">{totalArguments}</span> arguments. 
            Your primary focus appears to be within the <span className="font-bold text-foreground">{chartData.sort((a,b) => b.count - a.count)[0]?.archetype || "General"}</span> domain.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
