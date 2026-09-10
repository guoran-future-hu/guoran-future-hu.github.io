interface ProjectPresentation {
  title?: string;
  order: number;
  visual?: "roundtable";
  image?: string;
  imageAlt?: string;
  linkLabel?: string;
}

// Optional card overrides. Projects without an entry use their Markdown metadata.
export const projectPresentation: Record<string, ProjectPresentation> = {
  ReconDrive: {
    title: "ReconDrive",
    order: 0,
    image: "/assets/images/recon-drive-visualization.png",
    imageAlt: "ReconDrive reconstructions of autonomous driving scenes",
    linkLabel: "Explore the research",
  },
  "Persona-Roundtable": {
    title: "Persona Roundtable",
    order: 1,
    visual: "roundtable",
  },
};
