# PMO Import Module

This module implements the PMO import preview/run flow for the ERP CHICO backend.

## Location
- `backend/src/modules/pmo/import`

## Responsibilities
- Validate incoming PMO import contract JSON
- Compare contract documents against the current database snapshot
- Build a change set and persistence plan
- Execute create/update operations against Prisma-managed entities
- Expose preview/run endpoints for frontend integration

## Key services
- `ImportApplicationService`
  - `preview(...)`: reads contract input, validates it, loads a database snapshot, builds change sets, and creates a persistence plan.
  - `execute(...)`: reuses preview logic, then runs `CreateDocumentExecutorService` and `UpdateDocumentExecutorService`.
- `ContractReaderService`
  - Parses JSON contract input from either a string or inline object.
- `ContractValidatorService`
  - Validates required contract metadata, catalogs, and documents structure.
- `DatabaseSnapshotProviderService`
  - Loads active `document`, `area`, `process`, `documentStatusRef`, `user`, and `documentTypeRef` records from the database.
- `ChangeSetBuilderService`
  - Compares incoming contract documents with the snapshot and groups them into new, updated, unchanged, or no-code sets.
- `PersistencePlannerService`
  - Converts a change set into a list of persistence operations.
- `CreateDocumentExecutorService` / `UpdateDocumentExecutorService`
  - Apply create and update operations on the Prisma `document` table.

## Endpoints
- `POST /api/v1/pmo/import/preview`
  - Accepts `source`, `tenantId`, and `usuario`
  - Returns preview response with session, change set, and persistence plan
- `POST /api/v1/pmo/import/run`
  - Accepts the same payload as preview
  - Executes the import flow and returns import execution status
- `GET /api/v1/pmo/import/status/:id`
  - Currently implemented on the controller, but backend status tracking is not completed in this module.

## Current limitations
- `ImportApplicationService.execute(...)` currently performs import execution synchronously and in-memory.
- `ImportSessionService` only builds session objects in memory; there is no persisted job history yet.
- `CreateDocumentExecutorService` persists a minimal set of fields from contract payload.
- `UpdateDocumentExecutorService` currently updates only fields detected in differences, such as document name and version.
- Run/status job persistence and audit storage are not implemented.

## Notes
- Temporary console instrumentation has been removed from `backend/src/modules/pmo/import/services`.
- The module still contains legacy scaffolded services such as `ImportPreviewService`, `ImportRunService`, and `ImportAuditService` that are not currently wired into the active preview/run flow.
