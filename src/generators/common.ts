import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, getTemplatePath, writeJson } from '../utils/file.js';
import { getStackforgeVersion } from '../utils/stackforge-version.js';

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
        ? 'postgresql://postgres:postgres@localhost:5433/app'
        : 'file:./dev.db',
    jwtSecret: config.jwtSecret,
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

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'github/workflows/ci.yml.ejs',
    outputPath: path.join(config.targetDir, '.github', 'workflows', 'ci.yml'),
    data: {
      ...data,
      database: config.database,
    },
  });

  await writeJson(path.join(config.targetDir, 'stackforge.json'), {
    schemaVersion: 1,
    stackforgeVersion: getStackforgeVersion(),
    preset: config.preset,
    database: config.database,
    docker: config.docker,
    features: {},
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'AGENTS.md.ejs',
    outputPath: path.join(config.targetDir, 'AGENTS.md'),
    data: {
      ...data,
      stackforgeVersion: getStackforgeVersion(),
    },
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'dot-stackforge/README.md.ejs',
    outputPath: path.join(config.targetDir, '.stackforge', 'README.md'),
    data,
  });
}
