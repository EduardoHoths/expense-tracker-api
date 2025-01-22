export const userCreateSwaggerDoc = {
  "/users/create": {
    post: {
      summary: "Create a new user",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "User's name",
                },
                email: {
                  type: "string",
                  description: "User's email",
                },
                password: {
                  type: "string",
                  description: "User's password",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid input data",
        },
        409: {
          description: "User already exists",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
