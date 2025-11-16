# LandOS Simulation Platform Design Spec

## 1. Initial Directory Layout

The LandOS workspace is organized to isolate API concerns from simulation engines and supporting utilities. The high-level directories are:

- `api/`
  - `routers/`: HTTP route handlers for REST and websocket endpoints.
  - `controllers/`: Orchestrates engine requests, enforces validation, and mediates auth/session context.
  - `schemas/`: zod / JSON Schema validators shared across handlers.
  - `services/`: Implements business workflows such as simulation creation, scenario comparison, and reporting.
  - `clients/`: Outbound adapters (message bus, persistence, third-party data feeds).
- `engines/`
  - `analytics/`: Runs agronomic KPIs, telemetry transforms, and forecasting logic.
  - `optimization/`: Handles prescriptive recommendations (crop rotation, irrigation, robotic scheduling).
  - `operations/`: Simulates machinery dispatch, task queues, and resource usage.
  - `shared/`: Common math libs, stochastic helpers, and canonical data contracts.
- `tests/`
  - `unit/`: Focused suites for API routers/controllers and isolated engine modules.
  - `integration/`: Exercises API-to-engine boundaries with in-memory adapters.
  - `process/`: End-to-end flows covering scenario ingestion → simulation run → reporting payloads.
- `infra/`: IaC templates, Dockerfiles, and CI scripts (kept orthogonal to app logic).
- `docs/`: Specs, ADRs, and operational runbooks.

This layout keeps the LandOS API cohesive while allowing each engine to evolve independently behind consistent contracts.

## 2. Boundary Interfaces & Shared Data Models

### API ↔ Analytics Engine

- **Entry Point**: `api/services/analyticsService.runKpiBatch()` delegates to `engines/analytics/kpiRunner.evaluate()`.
- **Request Model**: `AnalyticsJobRequest` (`jobId`, `fieldId`, `timeWindow`, `sensorSeries[]`, `statFunctions[]`).
- **Response Model**: `AnalyticsJobResult` (`jobId`, `kpis[]`, `confidenceInterval`, `alerts[]`).
- **Transport**: Synchronous call over in-process adapter; background jobs use message bus client exposed via `api/clients/eventBusAdapter`.

### API ↔ Optimization Engine

- **Entry Point**: `api/services/prescriptionService.generatePlan()` → `engines/optimization/planner.solve()`.
- **Request Model**: `OptimizationJobRequest` (`jobId`, `constraints`, `objectives`, `resourceInventory`, `environmentalLimits`).
- **Response Model**: `OptimizationPlan` (`jobId`, `planVersion`, `taskAssignments[]`, `expectedYieldDelta`, `costSummary`).
- **Transport**: Promise-based contract to support long-running solvers; API stores plan snapshots via `api/clients/stateStore`.

### API ↔ Operations Engine

- **Entry Point**: `api/services/operationsService.simulateRun()` → `engines/operations/scheduler.execute()`.
- **Request Model**: `OperationsRunRequest` (`scenarioId`, `calendarRange`, `fleetConfig[]`, `workOrders[]`).
- **Response Model**: `OperationsRunResult` (`scenarioId`, `timelineEvents[]`, `resourceUsage`, `exceptions[]`).
- **Transport**: Streaming iterator to surface progress updates through websocket routes; persisted via `api/controllers/streamController`.

### Shared Data Contracts

All engines depend on `engines/shared/models.ts` (re-exported through `@landos/models`) containing:

- `FieldDescriptor`, `CropProfile`, `MachineSpec`, `WeatherSlice`, `SensorDatum`.
- Versioned discriminated unions (`SimulationEvent`, `EngineError`, `PlanChange`).
- Utility codecs that mirror API `schemas/` definitions so validation is centralized.

Contracts are published as an internal NPM package to ensure both API and engines consume identical typings and serialization helpers.

## 3. Test Plan

### Unit Tests

- **API Routers & Controllers**: Validate routing logic, auth guards, and schema validation using mocked engine adapters (Vitest + Supertest).
- **Analytics Engine Modules**: Cover KPI calculators, normalization utilities, and anomaly detection thresholds.
- **Optimization Engine Solvers**: Test objective composition, constraint satisfaction, and fallback heuristics with deterministic seeds.
- **Operations Engine Scheduler**: Verify task prioritization, resource reservation, and exception handling when telemetry is missing.

### Integration Tests

- **API ↔ Engines**: Use in-memory adapters replicating the boundary interfaces to ensure serialization/deserialization symmetry.
- **Eventing & Persistence**: Exercise message bus adapter + stateStore client to verify job lifecycle transitions.
- **Streaming Routes**: Simulate websocket clients to confirm operations run events stream without leaking state.

### Process (End-to-End) Tests

- Scenario ingestion → analytics batch → optimization plan → operations simulation, asserting:
  1. Canonical `SimulationScenario` stored via API services.
  2. Analytics outputs feed optimization inputs without manual mapping.
  3. Operations engine consumes optimization plan and emits final timeline/report payloads.
- Regression flows for “what-if” comparisons to ensure plan deltas propagate to reporting services.

## 4. TDD & Documentation Rationale

- **Outside-in development**: Begin with failing process tests that express desired simulation flows. This ensures business value drives implementation order.
- **Interface-first unit tests**: Author unit tests for each API service and engine entry point before coding internals. Contracts stay immutable and engines can iterate independently.
- **Contract test harness**: Integration suites double as living documentation; they lock the JSON schema and streaming behaviors shared between teams.
- **Continuous feedback**: Tests run via CI on every commit, while docs in `docs/` summarize scenarios, enabling contributors to understand the system without diving into code immediately.

This TDD approach minimizes regression risk across multiple engines, keeps interfaces honest, and accelerates onboarding by pairing executable specifications with human-readable design notes.
