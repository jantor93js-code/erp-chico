import { ImportChangeSet } from './change-set.interface';
import { ImportSession } from './import-session.interface';
import { PersistencePlan } from './persistence-plan.interface';

export interface ImportPreviewResponse {
  session: ImportSession;
  changeSet: ImportChangeSet;
  persistencePlan: PersistencePlan;
}
