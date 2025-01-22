import { swaggerRoutes } from "../express/routes/swagger";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Expenses API",
    description: "API for managing expenses",
    version: "1.0.0",
    contact: {
      email: "eduardo.hoths@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    ...swaggerRoutes,
  },
};
