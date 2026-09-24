export type ResourceField = {
  name: string;
  type: "string";
  required: boolean;
};

export type ResourceNaming = {
  singular: string;
  plural: string;
  pascal: string;
  table: string;
};

export type PlannedFileChange = {
  action: "CREATE" | "MODIFY";
  path: string;
};

export type GeneratedResourceRecord = {
  name: string;
  plural: string;
  addedAt: string;
  stackforgeVersion: string;
};

export type GenerateResourceContext = {
  projectRoot: string;
  apiRoot: string;
  contractsRoot: string;
  scope: string;
  naming: ResourceNaming;
  fields: ResourceField[];
  dryRun: boolean;
};
