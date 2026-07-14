import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateFrontend(
  config: ProjectConfig,
): Promise<void> {
  const frontendDir = path.join(config.targetDir, 'frontend');
  const templateDir = getTemplatePath('frontend');

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
  };

  const files: { template: string; output: string }[] = [
    { template: 'package.json.ejs', output: path.join(frontendDir, 'package.json') },
    { template: 'tsconfig.json.ejs', output: path.join(frontendDir, 'tsconfig.json') },
    { template: 'next.config.js.ejs', output: path.join(frontendDir, 'next.config.js') },
    { template: 'next-env.d.ts.ejs', output: path.join(frontendDir, 'next-env.d.ts') },
    { template: 'tailwind.config.ts.ejs', output: path.join(frontendDir, 'tailwind.config.ts') },
    { template: 'postcss.config.js.ejs', output: path.join(frontendDir, 'postcss.config.js') },
    { template: 'components.json.ejs', output: path.join(frontendDir, 'components.json') },
    { template: '.env.local.ejs', output: path.join(frontendDir, '.env.local') },
    { template: '.env.local.example.ejs', output: path.join(frontendDir, '.env.local.example') },
    {
      template: 'src/app/globals.css.ejs',
      output: path.join(frontendDir, 'src', 'app', 'globals.css'),
    },
    {
      template: 'src/app/layout.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', 'layout.tsx'),
    },
    {
      template: 'src/app/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', 'page.tsx'),
    },
    {
      template: 'src/app/login/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', 'login', 'page.tsx'),
    },
    {
      template: 'src/app/register/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', 'register', 'page.tsx'),
    },
    {
      template: 'src/lib/utils.ts.ejs',
      output: path.join(frontendDir, 'src', 'lib', 'utils.ts'),
    },
    {
      template: 'src/components/ui/button.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'button.tsx'),
    },
    {
      template: 'src/components/ui/card.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'card.tsx'),
    },
    {
      template: 'src/components/ui/input.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'input.tsx'),
    },
    {
      template: 'src/components/ui/label.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'label.tsx'),
    },
    {
      template: 'src/services/api.ts.ejs',
      output: path.join(frontendDir, 'src', 'services', 'api.ts'),
    },
    {
      template: 'src/services/auth.service.ts.ejs',
      output: path.join(frontendDir, 'src', 'services', 'auth.service.ts'),
    },
    {
      template: 'src/services/users.service.ts.ejs',
      output: path.join(frontendDir, 'src', 'services', 'users.service.ts'),
    },
  ];

  if (config.docker) {
    files.push(
      { template: 'Dockerfile.ejs', output: path.join(frontendDir, 'Dockerfile') },
      { template: '.dockerignore.ejs', output: path.join(frontendDir, '.dockerignore') },
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
