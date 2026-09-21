export type ContributingSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  commands?: string[];
  list?: string[];
};

export const contributingSections: ContributingSection[] = [
  {
    id: "cli",
    title: "Develop the CLI (StackForge repository)",
    paragraphs: [
      "The create-stackforge-app and stackforge binaries live in the repository root—not in generated apps.",
    ],
    commands: [
      "pnpm install",
      "pnpm run build",
      "node ./bin/create-stackforge-app.js",
      "pnpm run smoke:sqlite",
      "pnpm run smoke:docker",
    ],
    list: [
      "Templates under templates/ drive generated output",
      "Smoke scripts in scripts/ validate fresh scaffolds and Docker",
    ],
  },
  {
    id: "landing",
    title: "Landing site (this website)",
    paragraphs: ["Marketing site source lives in the landing/ directory of the StackForge repo."],
    commands: ["cd landing", "pnpm install", "pnpm dev", "pnpm run lint", "pnpm run build"],
    list: [
      "Home: product overview, CLI demo, npm downloads",
      "/docs: user documentation",
      "/contributing: this page (maintainers)",
      "StackForge Assistant: local knowledge base, no external API",
    ],
  },
];
