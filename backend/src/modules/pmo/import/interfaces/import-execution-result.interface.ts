import { CreateExecutionResult } from './create-execution-result.interface';
import { ImportChangeSet } from './change-set.interface';
import { ImportSession } from './import-session.interface';
import { PersistencePlan } from './persistence-plan.interface';

export interface ImportExecutionResult {
  session: ImportSession;
  preview?: unknown;
  changeSet: ImportChangeSet;
  persistencePlan: PersistencePlan;
  executionResult: CreateExecutionResult;
}
