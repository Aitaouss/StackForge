import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateBackend(
  config: ProjectConfig,
): Promise<void> {
  const backendDir = path.join(config.targetDir, 'backend');
  const templateDir = getTemplatePath('backend');

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
    database: config.database,
    databaseUrl:
      config.database === 'postgresql'
        ? 'postgresql://postgres:postgres@localhost:5432/app'
        : 'file:./dev.db',
    jwtSecret: 'supersecret',
  };

  const files: { template: string; output: string }[] = [
    { template: 'package.json.ejs', output: path.join(backendDir, 'package.json') },
    { template: 'tsconfig.json.ejs', output: path.join(backendDir, 'tsconfig.json') },
    { template: '.env.ejs', output: path.join(backendDir, '.env') },
    { template: '.env.example.ejs', output: path.join(backendDir, '.env.example') },
    { template: 'src/main.ts.ejs', output: path.join(backendDir, 'src', 'main.ts') },
    { template: 'src/app.module.ts.ejs', output: path.join(backendDir, 'src', 'app.module.ts') },
    {
      template: 'src/prisma/prisma.module.ts.ejs',
      output: path.join(backendDir, 'src', 'prisma', 'prisma.module.ts'),
    },
    {
      template: 'src/prisma/prisma.service.ts.ejs',
      output: path.join(backendDir, 'src', 'prisma', 'prisma.service.ts'),
    },
    {
      template: 'src/auth/auth.module.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'auth.module.ts'),
    },
    {
      template: 'src/auth/auth.controller.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'auth.controller.ts'),
    },
    {
      template: 'src/auth/auth.service.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'auth.service.ts'),
    },
    {
      template: 'src/auth/auth.guard.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'auth.guard.ts'),
    },
    {
      template: 'src/auth/jwt.strategy.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'jwt.strategy.ts'),
    },
    {
      template: 'src/auth/dto/register.dto.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'dto', 'register.dto.ts'),
    },
    {
      template: 'src/auth/dto/login.dto.ts.ejs',
      output: path.join(backendDir, 'src', 'auth', 'dto', 'login.dto.ts'),
    },
    {
      template: 'src/users/users.module.ts.ejs',
      output: path.join(backendDir, 'src', 'users', 'users.module.ts'),
    },
    {
      template: 'src/users/users.controller.ts.ejs',
      output: path.join(backendDir, 'src', 'users', 'users.controller.ts'),
    },
    {
      template: 'src/users/users.service.ts.ejs',
      output: path.join(backendDir, 'src', 'users', 'users.service.ts'),
    },
    {
      template: 'src/users/dto/create-user.dto.ts.ejs',
      output: path.join(backendDir, 'src', 'users', 'dto', 'create-user.dto.ts'),
    },
    {
      template: 'prisma/schema.prisma.ejs',
      output: path.join(backendDir, 'prisma', 'schema.prisma'),
    },
  ];

  if (config.docker) {
    files.push(
      { template: 'Dockerfile.ejs', output: path.join(backendDir, 'Dockerfile') },
      { template: '.dockerignore.ejs', output: path.join(backendDir, '.dockerignore') },
    );
  }

  for (const file of files) {
    await renderTemplate({
      templateDir,
      templateName: file.template,
      outputPath: file.output,
      data,
    });
  }
}
