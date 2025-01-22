
export const loginSwaggerDoc = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User authentication',
      description: 'Authenticate user with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                },
                password: {
                  type: 'string',
                  example: '123456'
                }
              },
              required: ['email', 'password']
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Successful authentication',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Invalid credentials'
        },
        '500': {
          description: 'Internal server error'
        }
      }
    }
  }
}
