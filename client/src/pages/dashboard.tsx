import { useArguments, useArchetypeReport } from "@/hooks/use-arguments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, FileText, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: argumentsList, isLoading: isArgsLoading } = useArguments();
  const { data: report, isLoading: isReportLoading } = useArchetypeReport();

  if (isArgsLoading || isReportLoading) return <DashboardSkeleton />;

  const totalArguments = argumentsList?.length || 0;
  const recentArguments = argumentsList?.slice(0, 3) || [];
  const topArchetype = report?.sort((a, b) => b.count - a.count)[0]?.archetype || "None";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-primary">Overview</h2>
          <p className="text-muted-foreground mt-1">Snapshot of your research activity.</p>
        </div>
        <Link href="/arguments">
          <Button className="hidden sm:flex gap-2">
            <Plus className="h-4 w-4" /> New Argument
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Total Arguments" 
          value={totalArguments} 
          icon={<FileText className="h-4 w-4 text-primary" />} 
          trend="Lifetime"
        />
        <StatCard 
          title="Dominant Archetype" 
          value={topArchetype} 
          icon={<BarChart3 className="h-4 w-4 text-accent" />} 
          trend="Most Used"
        />
        <StatCard 
          title="Research Velocity" 
          value="Active" 
          icon={<ArrowRight className="h-4 w-4 text-green-600" />} 
          trend="Status"
        />
      </div>

      {/* Recent Arguments Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-semibold">Recent Entries</h3>
            <Link href="/arguments">
              <Button variant="link" className="text-primary p-0 h-auto font-medium">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentArguments.length > 0 ? (
              recentArguments.map((arg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={arg.id}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-default border-border/60">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`p-3 rounded-lg shrink-0 ${
                        arg.archetype === 'Technical' ? 'bg-blue-50 text-blue-600' :
                        arg.archetype === 'Business' ? 'bg-emerald-50 text-emerald-600' :
                        arg.archetype === 'Research' ? 'bg-purple-50 text-purple-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-base truncate pr-4">{arg.title}</h4>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                            {arg.archetype}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{arg.description}</p>
                        <p className="text-xs text-muted-foreground mt-3">
                          {new Date(arg.createdAt!).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Quick Actions / Side Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-semibold">Quick Reports</h3>
          <Card className="bg-primary text-primary-foreground border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Archetype Distribution</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Visualize how your arguments are distributed across categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end gap-2 mt-4 opacity-80">
                {/* Simple CSS bar chart visualization for quick view */}
                {report?.map((item) => (
                  <div 
                    key={item.archetype} 
                    className="bg-white/90 rounded-t w-full transition-all hover:bg-white"
                    style={{ height: `${(item.count / (Math.max(...report.map(r => r.count)) || 1)) * 100}%` }}
                  />
                ))}
              </div>
              <Link href="/reports">
                <Button variant="secondary" className="w-full mt-6 text-primary font-semibold hover:bg-white">
                  View Full Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-secondary/50 rounded-lg">{icon}</div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{trend}</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-primary">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No arguments yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Start building your knowledge base by adding your first argument.
        </p>
        <Link href="/arguments">
          <Button className="mt-4" variant="outline">Create Argument</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-8 w-40" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
