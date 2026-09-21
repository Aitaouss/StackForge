import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { npmScope } from '../layout.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generatePackages(config: ProjectConfig): Promise<void> {
  const templateDir = getTemplatePath('packages');
  const packagesRoot = path.join(config.targetDir, 'packages');
  const scope = npmScope(config.projectName);

  const data = {
    projectName: config.projectName,
    scope,
  };

  const files: { template: string; output: string }[] = [
    {
      template: 'eslint-config/package.json.ejs',
      output: path.join(packagesRoot, 'eslint-config', 'package.json'),
    },
    {
      template: 'eslint-config/index.js.ejs',
      output: path.join(packagesRoot, 'eslint-config', 'index.js'),
    },
    {
      template: 'typescript-config/package.json.ejs',
      output: path.join(packagesRoot, 'typescript-config', 'package.json'),
    },
    {
      template: 'typescript-config/base.json.ejs',
      output: path.join(packagesRoot, 'typescript-config', 'base.json'),
    },
    {
      template: 'typescript-config/nextjs.json.ejs',
      output: path.join(packagesRoot, 'typescript-config', 'nextjs.json'),
    },
    {
      template: 'typescript-config/nestjs.json.ejs',
      output: path.join(packagesRoot, 'typescript-config', 'nestjs.json'),
    },
    {
      template: 'ui/package.json.ejs',
      output: path.join(packagesRoot, 'ui', 'package.json'),
    },
    {
      template: 'ui/src/index.ts.ejs',
      output: path.join(packagesRoot, 'ui', 'src', 'index.ts'),
    },
  ];

  for (const file of files) {
    await renderTemplate({
      templateDir,
      templateName: file.template,
      outputPath: file.output,
      data,
    });
  }
}
