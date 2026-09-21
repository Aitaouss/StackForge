import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { featuresForPreset, resolvePreset } from '../layout.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateDockerFiles(
  config: ProjectConfig,
): Promise<void> {
  if (!config.docker) {
    return;
  }

  const sharedTemplateDir = getTemplatePath('shared');

  const preset = resolvePreset(config);
  const features = featuresForPreset(preset);

  const data = {
    projectName: config.projectName,
    database: config.database,
    dockerDatabaseUrl:
      config.database === 'postgresql'
        ? 'postgresql://postgres:postgres@postgres:5432/app?sslmode=disable'
        : 'file:./dev.db',
    jwtSecret: config.jwtSecret,
    includeWeb: features.web,
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
