export type DatabaseType = 'postgresql' | 'sqlite';

export interface ProjectConfig {
  projectName: string;
  projectDescription: string;
  database: DatabaseType;
  docker: boolean;
  installDependencies: boolean;
  targetDir: string;
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
