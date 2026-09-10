// Display metadata lives here so the original essays remain byte-for-byte intact.
export const editorial: Record<
  string,
  { description: string; category: string }
> = {
  "General-purpose-skill": {
    category: "AI & society",
    description:
      "What remains valuable when specialized skills become easier to automate? A case for adaptability, judgment, and learning across domains.",
  },
  Causality: {
    category: "Systems & philosophy",
    description:
      "Success stories rarely explain success. On luck, causality, and learning to see the systems behind individual outcomes.",
  },
  GPT: {
    category: "AI & society",
    description:
      "A time capsule from 2023: an early exploration of GPT, human intelligence, and the future of our relationship with AI.",
  },
  ReconDrive: {
    category: "Research · 3D / 4D",
    description:
      "Turning driving scenes into dynamic 3D worlds. Feed-forward 4D Gaussian splatting for autonomous driving.",
  },
  "Persona-Roundtable": {
    category: "Open source · AI tool",
    description:
      "A command-line tool for exploring questions through conversations between AI personas with different perspectives.",
  },
};
