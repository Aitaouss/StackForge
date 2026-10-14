You are working inside the existing StackForge landing page codebase.

Your task is to build a small interactive chatbot assistant for the landing page that answers questions about StackForge.

Do NOT redesign the existing landing page. Reuse the current design system, typography, colors, spacing, components, border radius, shadows, and overall visual language.

## Goal

Create a small floating chatbot called:

**StackForge Assistant**

It should help visitors quickly understand:

- What StackForge is
- What technologies StackForge supports
- How to create a project
- What gets generated
- How StackForge differs from manually setting up a project
- Whether users can customize the generated stack
- Installation and CLI usage
- Requirements
- Common commands
- Basic troubleshooting
- GitHub / documentation links if they already exist in the project

The chatbot is mainly a product guide for the StackForge landing page.

---

## UX

Add a floating chatbot button in the bottom-right corner.

Example:

- Small circular or rounded-square button
- Terminal / spark / bot icon
- Label or tooltip: "Ask StackForge"

When clicked, open a compact chat panel.

Desktop size approximately:

- width: 380–420px
- height: 500–600px

On mobile:

- open as a nearly full-screen bottom sheet or responsive panel

The chat UI should include:

- Header
  - StackForge logo/icon
  - "StackForge Assistant"
  - small status text like "Ask me about StackForge"
  - close button

- Conversation area

- Suggested questions shown when the chat is empty

Examples:

- "What is StackForge?"

- "What stack can it generate?"

- "How do I create a new project?"

- "Does it support Docker?"

- "Can I choose Prisma?"

- "What does the generated project include?"

- Input at the bottom

- Send button

- Enter sends the message

- Shift+Enter creates a new line if textarea is used

Add subtle opening/closing animation consistent with the existing website.

---

## Important implementation requirement

For the first version, DO NOT require a real AI API.

Build the chatbot using a local knowledge base and deterministic/fuzzy matching.

The chatbot should work completely on the frontend without API keys.

Create something like:

```ts
type ChatbotKnowledgeItem = {
  id: string;
  keywords: string[];
  questions?: string[];
  answer: string;
};
```

Store StackForge knowledge in a dedicated file, for example:

```txt
src/data/stackforge-chatbot.ts
```

or whichever folder structure matches the existing project.

The answers should NOT be scattered throughout the component.

---

## Matching behavior

When the user asks a question:

1. Normalize the input:
   - lowercase
   - trim spaces
   - remove unnecessary punctuation

2. Match against:
   - keywords
   - common question variations

3. Return the closest StackForge answer.

It does not need advanced NLP.

Simple keyword scoring is enough.

For example:

```txt
"does stackforge support prisma?"
```

could match:

```txt
keywords: ["prisma", "database", "orm"]
```

If several entries match, choose the one with the highest score.

If there is no confident match, respond with something friendly such as:

"I'm not sure about that yet. I can answer questions about StackForge's CLI, supported technologies, generated projects, setup, Docker, databases, authentication, and project structure."

Then display 2–3 suggested questions.

---

## Knowledge the chatbot should support

Inspect the StackForge repository before implementing this.

DO NOT invent features.

Use the repository itself as the source of truth.

Check things such as:

- README
- package.json
- CLI source
- templates
- available commands
- configuration files
- supported frameworks
- ORM/database options
- authentication options
- Docker support
- package manager support
- generated folder structure
- installation instructions

Build the chatbot's knowledge base based on what StackForge actually supports.

At minimum, prepare answers for these topics:

### General

"What is StackForge?"

Explain StackForge in 2–4 concise sentences.

### Getting started

"How do I use StackForge?"

Show the actual CLI command from the repository.

Use formatted code blocks where appropriate.

### Supported technologies

"What technologies does StackForge support?"

Return only technologies confirmed by the codebase.

Potential categories may include:

- frontend
- backend
- ORM
- database
- styling
- authentication
- Docker
- package manager

Do not include something unless the repository supports it.

### Project generation

"What does StackForge generate?"

Explain the generated project structure and major included features.

### Customization

"Can I choose my stack?"

Explain the available CLI choices based on the actual implementation.

### Docker

"Does StackForge support Docker?"

Explain what Docker-related files/configuration are generated, if supported.

### Authentication

"Does StackForge generate authentication?"

Explain the exact authentication setup if it exists.

### Prisma/database

Questions like:

- "Does it support Prisma?"
- "What database can I use?"
- "Does it configure PostgreSQL?"

### Requirements

"What do I need installed?"

Mention the real requirements.

### GitHub

"Where is the source code?"

Use the StackForge repository URL already available in the project.

### Troubleshooting

Support common simple questions discovered from the README/codebase.

---

## Response style

The bot should sound:

- concise
- developer-friendly
- helpful
- slightly technical
- not overly conversational

Bad:

"Absolutely! I'd be delighted to tell you all about the incredible StackForge platform!"

Good:

"StackForge is a CLI for bootstrapping a production-ready full-stack project. It can generate the frontend, backend, database setup, authentication, and development tooling based on your selected stack."

Keep most answers below 120 words.

---

## Message rendering

Support basic formatting in bot messages:

- inline code
- code blocks
- links
- bullet lists

If the project already has a Markdown renderer, reuse it.

Otherwise implement a lightweight safe solution rather than introducing a large dependency unnecessarily.

---

## Conversation behavior

On first open, display:

"Hey 👋 I'm the StackForge Assistant. Ask me anything about StackForge."

Then show suggested questions.

When a suggestion is clicked:

- insert/send that question automatically
- display the corresponding answer

Maintain conversation state while the widget stays mounted.

No persistence is necessary for version 1.

---

## Micro-interactions

Add a short fake response delay, around 300–600 ms, so the interaction feels natural.

During that delay show a simple typing indicator:

```txt
● ● ●
```

or something visually consistent with the website.

Do not make the UI overly animated.

---

## Component architecture

Keep the implementation clean.

A possible structure:

```txt
components/
  chatbot/
    StackForgeChatbot.tsx
    ChatMessage.tsx
    ChatInput.tsx
    SuggestedQuestions.tsx

data/
  stackforge-chatbot.ts

lib/
  chatbot/
    find-chatbot-answer.ts
```

Adapt this structure to the existing repository conventions instead of forcing it.

---

## Code quality

Use:

- TypeScript
- existing project conventions
- existing UI components where possible
- reusable components
- accessible buttons
- proper aria labels
- responsive behavior

Avoid:

- giant components
- duplicated answers
- hardcoded styles everywhere
- unnecessary libraries
- external AI APIs for this first iteration

---

## Important

Before coding:

1. Inspect the StackForge repository.
2. Understand what StackForge currently supports.
3. Inspect the existing landing page styles/components.
4. Reuse those patterns.

Do not guess functionality.

After implementation, verify:

- chatbot opens/closes correctly
- suggestions work
- messages render correctly
- matching works for different wording
- unknown questions have a fallback
- mobile layout works
- no existing landing page behavior is broken
- TypeScript/build/lint pass

The result should feel like a native part of the StackForge website, not a third-party chat widget.
