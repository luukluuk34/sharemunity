/**
 * Base class for all entities that are part of communication to/from services.
 */
import { Id } from '@sharemunity-workspace/shared/api';

export interface IEntity {
    readonly _id: Id;
}
