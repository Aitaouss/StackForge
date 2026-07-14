import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

export interface RenderOptions {
  templateDir: string;
  templateName: string;
  outputPath: string;
  data?: Record<string, unknown>;
}

export async function renderTemplate({
  templateDir,
  templateName,
  outputPath,
  data = {},
}: RenderOptions): Promise<void> {
  const templatePath = path.join(templateDir, templateName);

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const rendered = ejs.render(templateContent, data, {
    rmWhitespace: false,
  });

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, rendered, 'utf-8');
}

export async function writeJson(
  outputPath: string,
  data: Record<string, unknown>,
): Promise<void> {
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, data, { spaces: 2 });
}

export async function ensureEmptyDir(dir: string): Promise<void> {
  await fs.ensureDir(dir);
  const files = await fs.readdir(dir);
  if (files.length > 0) {
    throw new Error(
      `Directory "${dir}" is not empty. Please remove it or choose a different name.`,
    );
  }
}

export function getTemplatePath(...segments: string[]): string {
  // dist/src/utils/file.js -> package root is three levels up
  return path.resolve(__dirname, '..', '..', '..', 'templates', ...segments);
}
