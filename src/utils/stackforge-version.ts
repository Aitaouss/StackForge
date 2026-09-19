import fs from 'fs-extra';
import path from 'path';

/** Version of the create-stackforge-app package (written into generated stackforge.json). */
export function getStackforgeVersion(): string {
  const packageJsonPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
  const pkg = fs.readJsonSync(packageJsonPath) as { version?: string };
  if (!pkg.version) {
    throw new Error('create-stackforge-app package.json is missing version');
  }
  return pkg.version;
}
