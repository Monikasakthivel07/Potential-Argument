import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertArgument } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useArguments() {
  return useQuery({
    queryKey: [api.arguments.list.path],
    queryFn: async () => {
      const res = await fetch(api.arguments.list.path);
      if (!res.ok) throw new Error("Failed to fetch arguments");
      return api.arguments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateArgument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertArgument) => {
      const res = await fetch(api.arguments.create.path, {
        method: api.arguments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create argument");
      }

      return api.arguments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.arguments.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.archetypes.path] });
      toast({
        title: "Success",
        description: "Argument created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteArgument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.arguments.delete.path, { id });
      const res = await fetch(url, {
        method: api.arguments.delete.method,
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Argument not found");
        throw new Error("Failed to delete argument");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.arguments.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.archetypes.path] });
      toast({
        title: "Deleted",
        description: "Argument has been removed",
      });
    },
  });
}

export function useArchetypeReport() {
  return useQuery({
    queryKey: [api.reports.archetypes.path],
    queryFn: async () => {
      const res = await fetch(api.reports.archetypes.path);
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.reports.archetypes.responses[200].parse(await res.json());
    },
  });
}
