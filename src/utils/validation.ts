import validateNpmPackageName from 'validate-npm-package-name';
import path from 'path';
import fs from 'fs-extra';

export function sanitizeProjectName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '');
}

export function isValidProjectName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return 'Project name is required.';
  }

  if (name.length > 214) {
    return 'Project name must be 214 characters or less.';
  }

  const result = validateNpmPackageName(name);

  if (!result.validForNewPackages) {
    return (
      result.errors?.[0] ||
      result.warnings?.[0] ||
      'Project name is not a valid npm package name.'
    );
  }

  return true;
}

export async function isDirectoryEmpty(targetDir: string): Promise<boolean> {
  if (!(await fs.pathExists(targetDir))) {
    return true;
  }

  const files = await fs.readdir(targetDir);
  return files.length === 0;
}

export function resolveTargetDir(projectName: string, cwd?: string): string {
  return path.resolve(cwd || process.cwd(), projectName);
}
