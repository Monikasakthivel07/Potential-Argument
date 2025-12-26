import { z } from "zod";
import { insertUserSchema, insertArgumentSchema, arguments_table, users, archetypes } from "./schema";

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }),
      }
    },
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: insertUserSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      }
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.void(),
      }
    },
    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.void(),
      }
    }
  },
  arguments: {
    list: {
      method: "GET" as const,
      path: "/api/arguments",
      responses: {
        200: z.array(z.custom<typeof arguments_table.$inferSelect>()),
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/arguments",
      input: insertArgumentSchema,
      responses: {
        201: z.custom<typeof arguments_table.$inferSelect>(),
        401: z.void(),
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/arguments/:id",
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      }
    }
  },
  reports: {
    archetypes: {
      method: "GET" as const,
      path: "/api/reports/archetypes",
      responses: {
        200: z.array(z.object({ archetype: z.string(), count: z.number() })),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
