import fs from 'fs-extra';
import path from 'path';

export interface StackforgeManifestV2 {
  schemaVersion: number;
  stackforgeVersion: string;
  preset: string | null;
  database: string;
  docker: boolean;
  apps: {
    web: string | null;
    api: string;
  };
  orm?: string;
  features?: Record<string, unknown>;
}

export async function readManifest(cwd: string): Promise<StackforgeManifestV2> {
  const manifestPath = path.join(cwd, 'stackforge.json');
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error('Not a StackForge project: missing stackforge.json in the current directory.');
  }
  const raw = await fs.readJson(manifestPath);
  return raw as StackforgeManifestV2;
}

export function resolveAppPath(cwd: string, manifest: StackforgeManifestV2, app: 'api' | 'web'): string {
  const rel = app === 'api' ? manifest.apps?.api : manifest.apps?.web;
  if (!rel) {
    if (app === 'web') {
      throw new Error('This project has no web app (API-only preset).');
    }
    throw new Error('stackforge.json is missing apps.api path.');
  }
  return path.join(cwd, rel);
}
