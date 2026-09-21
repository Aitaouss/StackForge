export type DatabaseType = 'postgresql' | 'sqlite';

export type StackforgePreset = 'minimal' | 'api' | 'dashboard' | 'saas';

export interface ProjectConfig {
  projectName: string;
  projectDescription: string;
  database: DatabaseType;
  docker: boolean;
  installDependencies: boolean;
  targetDir: string;
  /** Resolved preset (defaults to dashboard). */
  preset?: StackforgePreset;
  /** Set during generateProject; written to apps/api `.env`. */
  jwtSecret?: string;
}

export interface PackageJson {
  name: string;
  version?: string;
  description?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
