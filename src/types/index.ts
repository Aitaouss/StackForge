export type DatabaseType = 'postgresql' | 'sqlite';

/** Preset name when using `--preset` (Phase 2+). Null until presets are exposed in CLI. */
export type StackforgePreset = 'minimal' | 'api' | 'dashboard' | 'saas';

export interface ProjectConfig {
  projectName: string;
  projectDescription: string;
  database: DatabaseType;
  docker: boolean;
  installDependencies: boolean;
  targetDir: string;
  /** Recorded in stackforge.json; null when not selected via preset flag. */
  preset: StackforgePreset | null;
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
