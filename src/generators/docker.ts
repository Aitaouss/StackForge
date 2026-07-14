import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateDockerFiles(
  config: ProjectConfig,
): Promise<void> {
  if (!config.docker) {
    return;
  }

  const sharedTemplateDir = getTemplatePath('shared');

  const data = {
    projectName: config.projectName,
    database: config.database,
    dockerDatabaseUrl:
      config.database === 'postgresql'
        ? 'postgresql://postgres:postgres@postgres:5432/app'
        : 'file:./dev.db',
    jwtSecret: 'supersecret',
  };

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'docker-compose.yml.ejs',
    outputPath: path.join(config.targetDir, 'docker-compose.yml'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: '.dockerignore.ejs',
    outputPath: path.join(config.targetDir, '.dockerignore'),
    data,
  });
}
