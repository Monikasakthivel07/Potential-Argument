import { useArguments, useCreateArgument, useDeleteArgument } from "@/hooks/use-arguments";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArgumentSchema, archetypes } from "@shared/schema";
import { type InsertArgument } from "@shared/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ArgumentsPage() {
  const { data: argumentsList, isLoading } = useArguments();
  const { mutate: deleteArgument } = useDeleteArgument();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredArguments = argumentsList?.filter(arg => {
    const matchesFilter = filter === "all" || arg.archetype === filter;
    const matchesSearch = arg.title.toLowerCase().includes(search.toLowerCase()) || 
                          arg.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading arguments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-primary">Arguments</h2>
          <p className="text-muted-foreground mt-1">Manage and organize your logical structures.</p>
        </div>
        <CreateArgumentDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-border/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search arguments..." 
            className="pl-9 bg-slate-50 border-border/50 focus:bg-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground mr-1" />
          <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          {archetypes.map(type => (
            <FilterPill 
              key={type} 
              label={type} 
              active={filter === type} 
              onClick={() => setFilter(type)} 
            />
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredArguments?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No arguments found matching your criteria.
            </div>
          ) : (
            filteredArguments?.map((arg) => (
              <motion.div
                key={arg.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="hover:border-primary/30 transition-colors duration-200 group">
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{arg.title}</h3>
                        <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                          {arg.archetype}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{arg.description}</p>
                      <p className="text-xs text-muted-foreground mt-3 font-medium">
                        Added on {new Date(arg.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex sm:flex-col justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteArgument(arg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "bg-transparent text-muted-foreground hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function CreateArgumentDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createArgument, isPending } = useCreateArgument();
  
  const form = useForm<InsertArgument>({
    resolver: zodResolver(insertArgumentSchema),
    defaultValues: { title: "", description: "", archetype: "Technical" },
  });

  const onSubmit = (data: InsertArgument) => {
    createArgument(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" /> Add Argument
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Argument</DialogTitle>
          <DialogDescription>
            Catalog a new logical structure or reasoning pattern.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Sunk Cost Fallacy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="archetype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archetype</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select archetype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {archetypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain the reasoning..." 
                      className="min-h-[100px] resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Argument"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
