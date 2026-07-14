import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateCommonFiles(
  config: ProjectConfig,
): Promise<void> {
  const sharedTemplateDir = getTemplatePath('shared');

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
    database: config.database,
    databaseUrl:
      config.database === 'postgresql'
        ? 'postgresql://postgres:postgres@localhost:5432/app'
        : 'file:./dev.db',
  };

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'root-package.json.ejs',
    outputPath: path.join(config.targetDir, 'package.json'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: '.env.example.ejs',
    outputPath: path.join(config.targetDir, '.env.example'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'README.md.ejs',
    outputPath: path.join(config.targetDir, 'README.md'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'pnpm-workspace.yaml.ejs',
    outputPath: path.join(config.targetDir, 'pnpm-workspace.yaml'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'root-gitignore.ejs',
    outputPath: path.join(config.targetDir, '.gitignore'),
    data,
  });
}
