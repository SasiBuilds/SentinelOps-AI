// =============================================================================
// SentinelOps AI – OpenAPI 3.0 Specification
// Generated manually from the backend routes, services, and response helpers.
// =============================================================================

import config from '../config/index.js';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SentinelOps AI – Backend API',
    version: '1.0.0',
    description: 'Autonomous Disaster Detection & Recovery Platform – REST API reference.',
    contact: { name: 'SentinelOps AI Team' },
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/${config.apiVersion}`,
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'System health & readiness probes' },
    { name: 'Auth', description: 'Authentication and user management' },
    { name: 'Incidents', description: 'Incident lifecycle management' },
    { name: 'Alerts', description: 'Alert ingestion and management' },
    { name: 'Recovery', description: 'Automated recovery actions' },
    { name: 'Stats', description: 'Dashboard statistics' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      pathId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Resource UUID (v4)',
        schema: { type: 'string', format: 'uuid' },
      },
      queryPage: {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number (1-based)',
        schema: { type: 'integer', minimum: 1, default: 1 },
      },
      queryLimit: {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of items per page (max 100)',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['fail', 'error'] },
          message: { type: 'string' },
          code: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string' },
                param: { type: 'string' },
                location: { type: 'string' },
              },
              required: ['msg', 'param', 'location'],
            },
          },
        },
        required: ['status', 'message'],
        additionalProperties: false,
      },
      ValidationErrorResponse: {
        allOf: [
          { $ref: '#/components/schemas/ErrorResponse' },
          {
            properties: {
              status: { enum: ['fail'] },
              errors: {
                type: 'array',
                items: { $ref: '#/components/schemas/ErrorResponse/properties/errors/items' },
              },
            },
            required: ['errors'],
          },
        ],
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { type: ['object', 'array', 'string', 'number', 'boolean', 'null'], nullable: true },
        },
        required: ['status', 'message'],
        additionalProperties: false,
      },
      CreatedResponse: {
        allOf: [
          { $ref: '#/components/schemas/SuccessResponse' },
          { properties: { status: { enum: ['success'] } } },
        ],
      },
      HealthPayload: {
        type: 'object',
        properties: {
          uptime: { type: 'number' },
          environment: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          database: { type: 'string', enum: ['connected', 'disconnected'] },
          aiService: { type: 'string' },
          version: { type: 'string' },
          healthy: { type: 'boolean' },
        },
        required: ['uptime', 'environment', 'timestamp', 'database', 'aiService', 'version', 'healthy'],
        additionalProperties: false,
      },
      HealthResponse: {
        allOf: [
          { $ref: '#/components/schemas/SuccessResponse' },
          { properties: { data: { $ref: '#/components/schemas/HealthPayload' } } },
        ],
      },
      UserSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'OPERATOR', 'VIEWER'] },
        },
        required: ['id', 'email', 'name', 'role'],
        additionalProperties: false,
      },
      UserProfile: {
        allOf: [
          { $ref: '#/components/schemas/UserSummary' },
          {
            properties: {
              isActive: { type: 'boolean' },
              lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
            },
            required: ['isActive', 'createdAt'],
          },
        ],
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string', format: 'password' },
          role: { type: 'string', enum: ['ADMIN', 'OPERATOR', 'VIEWER'] },
        },
        required: ['email', 'name', 'password'],
        additionalProperties: false,
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
        required: ['email', 'password'],
        additionalProperties: false,
      },
      RefreshTokenRequest: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
        additionalProperties: false,
      },
      AuthTokenData: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
        required: ['accessToken', 'refreshToken', 'user'],
        additionalProperties: false,
      },
      TokenPairData: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
        required: ['accessToken', 'refreshToken'],
        additionalProperties: false,
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/UserProfile' },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      AuthTokenResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/AuthTokenData' },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      TokenPairResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/TokenPairData' },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      MeResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/UserProfile' },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      LabelMap: {
        type: 'object',
        additionalProperties: true,
      },
      AnnotationMap: {
        type: 'object',
        additionalProperties: true,
      },
      AlertIncidentSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
        },
        required: ['id', 'title', 'status'],
        additionalProperties: false,
      },
      AlertSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          alertname: { type: 'string' },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          status: { type: 'string', enum: ['FIRING', 'RESOLVED', 'SILENCED'] },
          source: { type: 'string', nullable: true },
          service: { type: 'string', nullable: true },
          namespace: { type: 'string', nullable: true },
          labels: { $ref: '#/components/schemas/LabelMap' },
          annotations: { $ref: '#/components/schemas/AnnotationMap' },
          startsAt: { type: 'string', format: 'date-time' },
          endsAt: { type: 'string', format: 'date-time', nullable: true },
          incident: { $ref: '#/components/schemas/AlertIncidentSummary' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'alertname', 'severity', 'status', 'startsAt', 'createdAt', 'updatedAt', 'incident'],
        additionalProperties: false,
      },
      IncidentAssigneeSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['id', 'name', 'email'],
        additionalProperties: false,
      },
      IncidentCountSummary: {
        type: 'object',
        properties: {
          recoveries: { type: 'integer', minimum: 0 },
          alerts: { type: 'integer', minimum: 0 },
        },
        required: ['recoveries', 'alerts'],
        additionalProperties: false,
      },
      IncidentSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
          source: { type: 'string', nullable: true },
          service: { type: 'string', nullable: true },
          region: { type: 'string', nullable: true },
          rootCause: { type: 'string', nullable: true },
          resolvedAt: { type: 'string', format: 'date-time', nullable: true },
          detectedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          assignee: { $ref: '#/components/schemas/IncidentAssigneeSummary' },
          _count: { $ref: '#/components/schemas/IncidentCountSummary' },
        },
        required: ['id', 'title', 'severity', 'status', 'detectedAt', 'createdAt', 'updatedAt'],
        additionalProperties: false,
      },
      IncidentDetail: {
        allOf: [
          { $ref: '#/components/schemas/IncidentSummary' },
          {
            properties: {
              recoveries: {
                type: 'array',
                items: { $ref: '#/components/schemas/RecoverySummary' },
              },
              alerts: {
                type: 'array',
                items: { $ref: '#/components/schemas/AlertSummary' },
              },
            },
          },
        ],
      },
      CreateIncidentRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          service: { type: 'string' },
          source: { type: 'string' },
          region: { type: 'string' },
          rootCause: { type: 'string' },
        },
        required: ['title'],
        additionalProperties: false,
      },
      UpdateIncidentRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
          service: { type: 'string' },
          region: { type: 'string' },
          rootCause: { type: 'string' },
          assigneeId: { type: 'string', format: 'uuid' },
        },
        additionalProperties: false,
      },
      CreateIncidentResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/IncidentSummary' },
        },
        required: ['status', 'message', 'data'],
      },
      GetIncidentResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/IncidentDetail' },
        },
        required: ['status', 'message', 'data'],
      },
      UpdateIncidentResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/IncidentSummary' },
        },
        required: ['status', 'message', 'data'],
      },
      PaginatedIncidentsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/IncidentSummary' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', minimum: 1 },
              limit: { type: 'integer', minimum: 1 },
              total: { type: 'integer', minimum: 0 },
              totalPages: { type: 'integer', minimum: 0 },
            },
            required: ['page', 'limit', 'total', 'totalPages'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data', 'pagination'],
        additionalProperties: false,
      },
      IngestAlertRequest: {
        type: 'object',
        properties: {
          alertname: { type: 'string' },
          severity: { type: 'string' },
          source: { type: 'string' },
          service: { type: 'string' },
          namespace: { type: 'string' },
          labels: { $ref: '#/components/schemas/LabelMap' },
          annotations: { $ref: '#/components/schemas/AnnotationMap' },
        },
        required: ['alertname'],
        additionalProperties: false,
      },
      IngestAlertResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/AlertSummary' },
        },
        required: ['status', 'message', 'data'],
      },
      GetAlertResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/AlertSummary' },
        },
        required: ['status', 'message', 'data'],
      },
      ResolveAlertResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/AlertSummary' },
        },
        required: ['status', 'message', 'data'],
      },
      TriggerRecoveryRequest: {
        type: 'object',
        properties: {
          incidentId: { type: 'string', format: 'uuid' },
          action: {
            type: 'string',
            enum: ['RESTART', 'SCALE_UP', 'SCALE_DOWN', 'FAILOVER', 'ROLLBACK', 'NOTIFY', 'MANUAL'],
          },
          targetService: { type: 'string' },
          automated: { type: 'boolean' },
        },
        required: ['incidentId', 'action'],
        additionalProperties: false,
      },
      RecoveryIncidentSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          status: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
        },
        required: ['id', 'title'],
        additionalProperties: false,
      },
      RecoverySummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          incidentId: { type: 'string', format: 'uuid' },
          action: {
            type: 'string',
            enum: ['RESTART', 'SCALE_UP', 'SCALE_DOWN', 'FAILOVER', 'ROLLBACK', 'NOTIFY', 'MANUAL'],
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'SKIPPED'],
          },
          automated: { type: 'boolean' },
          targetService: { type: 'string', nullable: true },
          output: { type: 'string', nullable: true },
          errorMessage: { type: 'string', nullable: true },
          startedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          incident: { $ref: '#/components/schemas/RecoveryIncidentSummary' },
        },
        required: ['id', 'incidentId', 'action', 'status', 'automated', 'startedAt', 'createdAt', 'updatedAt', 'incident'],
        additionalProperties: false,
      },
      TriggerRecoveryResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/RecoverySummary' },
        },
        required: ['status', 'message', 'data'],
      },
      GetRecoveryResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/RecoverySummary' },
        },
        required: ['status', 'message', 'data'],
      },
      PaginatedAlertsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/AlertSummary' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', minimum: 1 },
              limit: { type: 'integer', minimum: 1 },
              total: { type: 'integer', minimum: 0 },
              totalPages: { type: 'integer', minimum: 0 },
            },
            required: ['page', 'limit', 'total', 'totalPages'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data', 'pagination'],
        additionalProperties: false,
      },
      PaginatedRecoveriesResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecoverySummary' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', minimum: 1 },
              limit: { type: 'integer', minimum: 1 },
              total: { type: 'integer', minimum: 0 },
              totalPages: { type: 'integer', minimum: 0 },
            },
            required: ['page', 'limit', 'total', 'totalPages'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data', 'pagination'],
        additionalProperties: false,
      },
      IncidentStatsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              bySeverity: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    severity: {
                      type: 'string',
                      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
                    },
                    count: { type: 'integer' },
                  },
                  required: ['severity', 'count'],
                },
              },
              byStatus: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
                    },
                    count: { type: 'integer' },
                  },
                  required: ['status', 'count'],
                },
              },
              resolvedLast7Days: { type: 'integer' },
            },
            required: ['total', 'bySeverity', 'byStatus', 'resolvedLast7Days'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      RecoveryStatsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              byStatus: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'SKIPPED'],
                    },
                    count: { type: 'integer' },
                  },
                  required: ['status', 'count'],
                },
              },
              byAction: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: {
                      type: 'string',
                      enum: ['RESTART', 'SCALE_UP', 'SCALE_DOWN', 'FAILOVER', 'ROLLBACK', 'NOTIFY', 'MANUAL'],
                    },
                    count: { type: 'integer' },
                  },
                  required: ['action', 'count'],
                },
              },
            },
            required: ['total', 'byStatus', 'byAction'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
      DashboardStatsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              incidents: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  open: { type: 'integer' },
                  last30Days: { type: 'integer' },
                  byStatus: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
                        },
                        count: { type: 'integer' },
                      },
                      required: ['status', 'count'],
                    },
                  },
                  bySeverity: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        severity: {
                          type: 'string',
                          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
                        },
                        count: { type: 'integer' },
                      },
                      required: ['severity', 'count'],
                    },
                  },
                },
                required: ['total', 'open', 'last30Days', 'byStatus', 'bySeverity'],
                additionalProperties: false,
              },
              alerts: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  firing: { type: 'integer' },
                  last24h: { type: 'integer' },
                },
                required: ['total', 'firing', 'last24h'],
                additionalProperties: false,
              },
              recovery: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  successful: { type: 'integer' },
                  failed: { type: 'integer' },
                  last7Days: { type: 'integer' },
                  successRatePct: { type: 'integer' },
                },
                required: ['total', 'successful', 'failed', 'last7Days', 'successRatePct'],
                additionalProperties: false,
              },
            },
            required: ['incidents', 'alerts', 'recovery'],
            additionalProperties: false,
          },
        },
        required: ['status', 'message', 'data'],
        additionalProperties: false,
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness & readiness probe',
        description: 'Returns the health status of the API, database, and AI service.',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
          '503': {
            description: 'System is degraded – one or more dependencies unavailable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        operationId: 'register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' },
              },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive access + refresh tokens',
        operationId: 'login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokenResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token using a refresh token',
        operationId: 'refreshToken',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'New token pair issued',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TokenPairResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and revoke the refresh token',
        operationId: 'logout',
        requestBody: {
          required: false,
          description: 'Optional – provide the refresh token to revoke it. If omitted the call is a no-op.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the authenticated user profile',
        operationId: 'getMe',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MeResponse' },
              },
            },
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/incidents': {
      get: {
        tags: ['Incidents'],
        summary: 'List incidents (paginated)',
        operationId: 'listIncidents',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/queryPage' },
          { $ref: '#/components/parameters/queryLimit' },
          {
            name: 'status', in: 'query', required: false,
            description: 'Filter by incident status',
            schema: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
          },
          {
            name: 'severity', in: 'query', required: false,
            description: 'Filter by incident severity',
            schema: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          },
          {
            name: 'service', in: 'query', required: false,
            description: 'Filter by service name (partial match)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of incidents',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedIncidentsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Incidents'],
        summary: 'Create a new incident',
        operationId: 'createIncident',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateIncidentRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Incident created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateIncidentResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden – requires OPERATOR or ADMIN role',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/incidents/stats': {
      get: {
        tags: ['Incidents'],
        summary: 'Aggregated incident statistics',
        operationId: 'incidentStats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Incident statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IncidentStatsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/incidents/{id}': {
      parameters: [{ $ref: '#/components/parameters/pathId' }],
      get: {
        tags: ['Incidents'],
        summary: 'Get a single incident by ID',
        operationId: 'getIncident',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Incident found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GetIncidentResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Incidents'],
        summary: 'Partially update an incident',
        operationId: 'updateIncident',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateIncidentRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Incident updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateIncidentResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Incidents'],
        summary: 'Delete an incident',
        operationId: 'deleteIncident',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Incident deleted – no content returned' },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden – requires ADMIN role',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/alerts': {
      get: {
        tags: ['Alerts'],
        summary: 'List alerts (paginated)',
        operationId: 'listAlerts',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/queryPage' },
          { $ref: '#/components/parameters/queryLimit' },
          {
            name: 'status', in: 'query', required: false,
            description: 'Filter by alert status',
            schema: { type: 'string', enum: ['FIRING', 'RESOLVED', 'SILENCED'] },
          },
          {
            name: 'severity', in: 'query', required: false,
            description: 'Filter by alert severity',
            schema: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          },
          {
            name: 'alertname', in: 'query', required: false,
            description: 'Filter by alert name (partial match)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of alerts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedAlertsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Alerts'],
        summary: 'Ingest a new alert (Alertmanager webhook or direct POST)',
        operationId: 'ingestAlert',
        description: 'Public endpoint – no JWT required. Accepts alerts from Prometheus Alertmanager or the sentinel-ai engine.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/IngestAlertRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Alert ingested and incident linked',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IngestAlertResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/alerts/{id}': {
      parameters: [{ $ref: '#/components/parameters/pathId' }],
      get: {
        tags: ['Alerts'],
        summary: 'Get a single alert by ID',
        operationId: 'getAlert',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Alert found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GetAlertResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Alert not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/alerts/{id}/resolve': {
      parameters: [{ $ref: '#/components/parameters/pathId' }],
      patch: {
        tags: ['Alerts'],
        summary: 'Resolve a firing alert',
        operationId: 'resolveAlert',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Alert resolved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResolveAlertResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden – requires OPERATOR or ADMIN role',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Alert not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/recovery': {
      get: {
        tags: ['Recovery'],
        summary: 'List recovery records (paginated)',
        operationId: 'listRecoveries',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/queryPage' },
          { $ref: '#/components/parameters/queryLimit' },
          {
            name: 'incidentId', in: 'query', required: false,
            description: 'Filter by linked incident UUID',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'status', in: 'query', required: false,
            description: 'Filter by recovery status',
            schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'SKIPPED'] },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of recovery records',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedRecoveriesResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Recovery'],
        summary: 'Trigger a recovery action for an incident',
        operationId: 'triggerRecovery',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TriggerRecoveryRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Recovery action triggered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TriggerRecoveryResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Forbidden – requires OPERATOR or ADMIN role',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/recovery/stats': {
      get: {
        tags: ['Recovery'],
        summary: 'Aggregated recovery statistics',
        operationId: 'recoveryStats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Recovery statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecoveryStatsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/recovery/{id}': {
      parameters: [{ $ref: '#/components/parameters/pathId' }],
      get: {
        tags: ['Recovery'],
        summary: 'Get a single recovery record by ID',
        operationId: 'getRecovery',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Recovery record found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GetRecoveryResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Recovery record not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/stats': {
      get: {
        tags: ['Stats'],
        summary: 'Dashboard – aggregated platform statistics',
        operationId: 'getDashboardStats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Aggregate platform statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardStatsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};
