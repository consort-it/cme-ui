import { MetaDataPerson } from './meta-data-person';
import { MetadataProjectPhase } from './meta-data-phase';

/**
 * A project is the 'root entity' of CME. It contains Services.
 */
export interface MetadataProject {
  id: string;
  name: string;
  description?: string;
  context?: string;

  /**
   * The phases of this project
   */
  phases: Array<MetadataProjectPhase>;

  team: Array<MetaDataPerson>;
}
