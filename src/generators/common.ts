import path from 'path';
import { ProjectConfig } from '../types/index.js';
import {
  APPS_API,
  APPS_WEB,
  featuresForPreset,
  resolvePreset,
} from '../layout.js';
import { renderTemplate, getTemplatePath, writeJson } from '../utils/file.js';
import { getStackforgeVersion } from '../utils/stackforge-version.js';

// New scaffolds pin create-stackforge-app for doctor/info/generate. CI smoke scripts
// override with file:${repo} until the matching version is on npm (see smoke-link-local-cli.mjs).
const STACKFORGE_DIAGNOSTICS_DEPENDENCY = '^1.5.2';

export async function generateCommonFiles(
  config: ProjectConfig,
): Promise<void> {
  const sharedTemplateDir = getTemplatePath('shared');
  const preset = resolvePreset(config);
  const features = featuresForPreset(preset);

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
    stackforgeVersion: getStackforgeVersion(),
    stackforgeDiagnosticsDependency: STACKFORGE_DIAGNOSTICS_DEPENDENCY,
    database: config.database,
    docker: config.docker,
    databaseUrl:
      config.database === 'postgresql'
        ? 'postgresql://postgres:postgres@localhost:5433/app'
        : 'file:./dev.db',
    jwtSecret: config.jwtSecret,
    includeWeb: features.web,
    preset,
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
    schemaVersion: 2,
    stackforgeVersion: getStackforgeVersion(),
    preset,
    database: config.database,
    docker: config.docker,
    apps: {
      web: features.web ? APPS_WEB : null,
      api: APPS_API,
    },
    orm: 'prisma',
    features: {
      userAdmin: features.userAdmin,
      profile: features.profilePages,
      web: features.web,
    },
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'AGENTS.md.ejs',
    outputPath: path.join(config.targetDir, 'AGENTS.md'),
    data,
  });

  await renderTemplate({
    templateDir: sharedTemplateDir,
    templateName: 'dot-stackforge/README.md.ejs',
    outputPath: path.join(config.targetDir, '.stackforge', 'README.md'),
    data,
  });
}
