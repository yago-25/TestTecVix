import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Vituax",
      version: "1.0.0",
      description: "Documentação da API - Vituax",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Ambiente local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/routes/**/*.ts"],
});
