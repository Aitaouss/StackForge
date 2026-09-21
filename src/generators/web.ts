import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types/index.js';
import {
  featuresForPreset,
  npmScope,
  resolvePreset,
  webDir,
} from '../layout.js';
import { renderTemplate, getTemplatePath } from '../utils/file.js';

export async function generateWeb(config: ProjectConfig): Promise<void> {
  const preset = resolvePreset(config);
  const features = featuresForPreset(preset);
  if (!features.web) {
    return;
  }

  const webRoot = webDir(config.targetDir);
  const templateDir = getTemplatePath('web');
  const scope = npmScope(config.projectName);

  const data = {
    projectName: config.projectName,
    projectDescription: config.projectDescription,
    scope,
    includeUserAdmin: features.userAdmin,
    includeProfilePages: features.profilePages,
  };

  const files: { template: string; output: string }[] = [
    { template: 'package.json.ejs', output: path.join(webRoot, 'package.json') },
    { template: 'tsconfig.json.ejs', output: path.join(webRoot, 'tsconfig.json') },
    { template: 'next.config.js.ejs', output: path.join(webRoot, 'next.config.js') },
    { template: 'next-env.d.ts.ejs', output: path.join(webRoot, 'next-env.d.ts') },
    { template: 'tailwind.config.ts.ejs', output: path.join(webRoot, 'tailwind.config.ts') },
    { template: 'postcss.config.js.ejs', output: path.join(webRoot, 'postcss.config.js') },
    { template: 'components.json.ejs', output: path.join(webRoot, 'components.json') },
    { template: '.env.local.ejs', output: path.join(webRoot, '.env.local') },
    { template: '.env.local.example.ejs', output: path.join(webRoot, '.env.local.example') },
    {
      template: 'src/middleware.ts.ejs',
      output: path.join(webRoot, 'src', 'middleware.ts'),
    },
    {
      template: 'src/app/globals.css.ejs',
      output: path.join(webRoot, 'src', 'app', 'globals.css'),
    },
    {
      template: 'src/app/layout.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', 'layout.tsx'),
    },
    {
      template: 'src/app/(marketing)/page.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(marketing)', 'page.tsx'),
    },
    {
      template: 'src/app/(auth)/layout.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(auth)', 'layout.tsx'),
    },
    {
      template: 'src/app/(auth)/login/page.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(auth)', 'login', 'page.tsx'),
    },
    {
      template: 'src/app/(auth)/register/page.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(auth)', 'register', 'page.tsx'),
    },
    {
      template: 'src/app/(dashboard)/layout.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(dashboard)', 'layout.tsx'),
    },
    {
      template: 'src/app/(dashboard)/dashboard/page.tsx.ejs',
      output: path.join(webRoot, 'src', 'app', '(dashboard)', 'dashboard', 'page.tsx'),
    },
    {
      template: 'src/lib/utils.ts.ejs',
      output: path.join(webRoot, 'src', 'lib', 'utils.ts'),
    },
    {
      template: 'src/lib/auth-cookie.ts.ejs',
      output: path.join(webRoot, 'src', 'lib', 'auth-cookie.ts'),
    },
    {
      template: 'src/hooks/use-auth-mutations.ts.ejs',
      output: path.join(webRoot, 'src', 'hooks', 'use-auth-mutations.ts'),
    },
    {
      template: 'src/contexts/auth-context.tsx.ejs',
      output: path.join(webRoot, 'src', 'contexts', 'auth-context.tsx'),
    },
    {
      template: 'src/components/query-provider.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'query-provider.tsx'),
    },
    {
      template: 'src/components/providers.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'providers.tsx'),
    },
    {
      template: 'src/components/theme-provider.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'theme-provider.tsx'),
    },
    {
      template: 'src/components/theme-toggle.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'theme-toggle.tsx'),
    },
    {
      template: 'src/components/password-input.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'password-input.tsx'),
    },
    {
      template: 'src/components/dashboard-header.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'dashboard-header.tsx'),
    },
    {
      template: 'src/components/ui/button.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'button.tsx'),
    },
    {
      template: 'src/components/ui/card.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'card.tsx'),
    },
    {
      template: 'src/components/ui/input.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'input.tsx'),
    },
    {
      template: 'src/components/ui/label.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'label.tsx'),
    },
    {
      template: 'src/components/ui/avatar.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'avatar.tsx'),
    },
    {
      template: 'src/components/ui/badge.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'badge.tsx'),
    },
    {
      template: 'src/components/ui/dropdown-menu.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'dropdown-menu.tsx'),
    },
    {
      template: 'src/components/ui/separator.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'separator.tsx'),
    },
    {
      template: 'src/components/ui/sonner.tsx.ejs',
      output: path.join(webRoot, 'src', 'components', 'ui', 'sonner.tsx'),
    },
    {
      template: 'src/services/api.ts.ejs',
      output: path.join(webRoot, 'src', 'services', 'api.ts'),
    },
    {
      template: 'src/services/auth.service.ts.ejs',
      output: path.join(webRoot, 'src', 'services', 'auth.service.ts'),
    },
  ];

  if (features.userAdmin) {
    files.push(
      {
        template: 'src/lib/query-keys.ts.ejs',
        output: path.join(webRoot, 'src', 'lib', 'query-keys.ts'),
      },
      {
        template: 'src/hooks/use-users.ts.ejs',
        output: path.join(webRoot, 'src', 'hooks', 'use-users.ts'),
      },
      {
        template: 'src/hooks/use-user-mutations.ts.ejs',
        output: path.join(webRoot, 'src', 'hooks', 'use-user-mutations.ts'),
      },
      {
        template: 'src/components/user-admin-panel.tsx.ejs',
        output: path.join(webRoot, 'src', 'components', 'user-admin-panel.tsx'),
      },
      {
        template: 'src/components/ui/skeleton.tsx.ejs',
        output: path.join(webRoot, 'src', 'components', 'ui', 'skeleton.tsx'),
      },
      {
        template: 'src/components/ui/table.tsx.ejs',
        output: path.join(webRoot, 'src', 'components', 'ui', 'table.tsx'),
      },
      {
        template: 'src/services/users.service.ts.ejs',
        output: path.join(webRoot, 'src', 'services', 'users.service.ts'),
      },
    );
  }

  if (features.profilePages) {
    files.push(
      {
        template: 'src/hooks/use-profile-mutations.ts.ejs',
        output: path.join(webRoot, 'src', 'hooks', 'use-profile-mutations.ts'),
      },
      {
        template: 'src/app/(dashboard)/dashboard/profile/page.tsx.ejs',
        output: path.join(webRoot, 'src', 'app', '(dashboard)', 'dashboard', 'profile', 'page.tsx'),
      },
      {
        template: 'src/app/(dashboard)/dashboard/settings/page.tsx.ejs',
        output: path.join(webRoot, 'src', 'app', '(dashboard)', 'dashboard', 'settings', 'page.tsx'),
      },
    );
  }

  if (config.docker) {
    files.push(
      { template: 'Dockerfile.ejs', output: path.join(webRoot, 'Dockerfile') },
      { template: '.dockerignore.ejs', output: path.join(webRoot, '.dockerignore') },
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

  await fs.copy(
    path.join(templateDir, '.eslintrc.json'),
    path.join(webRoot, '.eslintrc.json'),
  );
}

/** @deprecated use generateWeb */
export const generateFrontend = generateWeb;
