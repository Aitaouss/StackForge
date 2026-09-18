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
      template: 'src/middleware.ts.ejs',
      output: path.join(frontendDir, 'src', 'middleware.ts'),
    },
    {
      template: 'src/app/globals.css.ejs',
      output: path.join(frontendDir, 'src', 'app', 'globals.css'),
    },
    {
      template: 'src/app/layout.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', 'layout.tsx'),
    },
    {
      template: 'src/app/(marketing)/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(marketing)', 'page.tsx'),
    },
    {
      template: 'src/app/(auth)/layout.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(auth)', 'layout.tsx'),
    },
    {
      template: 'src/app/(auth)/login/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(auth)', 'login', 'page.tsx'),
    },
    {
      template: 'src/app/(auth)/register/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(auth)', 'register', 'page.tsx'),
    },
    {
      template: 'src/app/(dashboard)/layout.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(dashboard)', 'layout.tsx'),
    },
    {
      template: 'src/app/(dashboard)/dashboard/page.tsx.ejs',
      output: path.join(frontendDir, 'src', 'app', '(dashboard)', 'dashboard', 'page.tsx'),
    },
    {
      template: 'src/lib/utils.ts.ejs',
      output: path.join(frontendDir, 'src', 'lib', 'utils.ts'),
    },
    {
      template: 'src/lib/auth-cookie.ts.ejs',
      output: path.join(frontendDir, 'src', 'lib', 'auth-cookie.ts'),
    },
    {
      template: 'src/lib/query-keys.ts.ejs',
      output: path.join(frontendDir, 'src', 'lib', 'query-keys.ts'),
    },
    {
      template: 'src/hooks/use-users.ts.ejs',
      output: path.join(frontendDir, 'src', 'hooks', 'use-users.ts'),
    },
    {
      template: 'src/hooks/use-auth-mutations.ts.ejs',
      output: path.join(frontendDir, 'src', 'hooks', 'use-auth-mutations.ts'),
    },
    {
      template: 'src/contexts/auth-context.tsx.ejs',
      output: path.join(frontendDir, 'src', 'contexts', 'auth-context.tsx'),
    },
    {
      template: 'src/components/query-provider.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'query-provider.tsx'),
    },
    {
      template: 'src/components/providers.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'providers.tsx'),
    },
    {
      template: 'src/components/theme-provider.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'theme-provider.tsx'),
    },
    {
      template: 'src/components/theme-toggle.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'theme-toggle.tsx'),
    },
    {
      template: 'src/components/password-input.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'password-input.tsx'),
    },
    {
      template: 'src/components/dashboard-header.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'dashboard-header.tsx'),
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
      template: 'src/components/ui/avatar.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'avatar.tsx'),
    },
    {
      template: 'src/components/ui/badge.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'badge.tsx'),
    },
    {
      template: 'src/components/ui/skeleton.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'skeleton.tsx'),
    },
    {
      template: 'src/components/ui/separator.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'separator.tsx'),
    },
    {
      template: 'src/components/ui/dropdown-menu.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'dropdown-menu.tsx'),
    },
    {
      template: 'src/components/ui/table.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'table.tsx'),
    },
    {
      template: 'src/components/ui/sonner.tsx.ejs',
      output: path.join(frontendDir, 'src', 'components', 'ui', 'sonner.tsx'),
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
