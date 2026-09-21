import path from 'path';
import { ProjectConfig, StackforgePreset } from './types/index.js';

export const APPS_API = 'apps/api';
export const APPS_WEB = 'apps/web';

export interface PresetFeatures {
  web: boolean;
  userAdmin: boolean;
  profilePages: boolean;
}

export function resolvePreset(config: ProjectConfig): StackforgePreset {
  return config.preset ?? 'dashboard';
}

export function featuresForPreset(preset: StackforgePreset): PresetFeatures {
  switch (preset) {
    case 'api':
      return { web: false, userAdmin: true, profilePages: true };
    case 'minimal':
      return { web: true, userAdmin: false, profilePages: false };
    case 'dashboard':
      return { web: true, userAdmin: true, profilePages: true };
    default:
      return { web: true, userAdmin: true, profilePages: true };
  }
}

export function npmScope(projectName: string): string {
  const base = projectName.replace(/^@/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  const scope = base.length > 0 ? base : 'stackforge-app';
  return `@${scope}`;
}

export function apiDir(targetDir: string): string {
  return path.join(targetDir, APPS_API);
}

export function webDir(targetDir: string): string {
  return path.join(targetDir, APPS_WEB);
}
