// Everything the containment chamber can show. Swap a file here and the
// chamber re-forms around it. `form` says how the particles get sampled.
export const CATEGORIES = {
  companies: {
    label: 'Companies',
    preview: true,
    kicker: 'For Business',
    items: [
      {
        id: 'brainos',
        title: 'BrAInOS',
        sub: 'Identity, memory and policy for embodied AI',
        blurb: 'An operating layer that gives a robot a persistent identity, an auditable memory and enforceable policy. Phase 0 is the Mini-Blur hexapod.',
        form: { type: 'card', src: '/assets/brand/brainos-logo.png', crop: [230, 195, 510, 430], h: 4.2 },
      },
      {
        id: 'homefax',
        title: 'HomeFAX',
        sub: 'Verified home history for contractors and owners',
        blurb: 'A contractor app that turns every job into a verified record attached to the house, so the next owner inherits the truth.',
        href: 'https://homefax-final.vercel.app',
        form: { type: 'card', src: '/assets/brand/homefax-logo.png', crop: [125, 125, 250, 265], h: 4.2 },
      },
    ],
  },
  research: {
    label: 'Research',
    kicker: 'Papers',
    items: [
      {
        id: 'whitebox',
        title: 'WhiteBOX',
        sub: 'Topological transparency for neural networks',
        blurb: 'Opening the box with math: instruments that read structure out of trained networks, with every failed prediction kept on the record.',
        href: '/assets/research/whitebox.pdf',
        form: { type: 'paper', src: '/assets/research/whitebox.png' },
      },
      {
        id: 'er-epr',
        title: 'ER = EPR',
        sub: 'Persistent homology of the SYK / JT correspondence',
        blurb: 'A structure theorem and an honest negative result: at every accessible N the declared large-N dictionary is falsified.',
        href: '/assets/research/er-epr.pdf',
        form: { type: 'paper', src: '/assets/research/er-epr.png' },
      },
      {
        id: 'drift',
        title: 'Drift Bound',
        sub: 'Paper file not yet added',
        blurb: 'Placeholder. Drop the PDF in public/assets/research and point this entry at it.',
        form: { type: 'text', text: 'DRIFT BOUND' }, // placeholder until the PDF exists; becomes type:'paper'
      },
      {
        id: 'aegis',
        title: 'AEGIS',
        sub: 'Flood prediction and warning, reviewed by GIS',
        blurb: 'Students built a novel flood prediction and early-warning system; this is the white paper.',
        href: '/assets/research/aegis.pdf',
        form: { type: 'paper', src: '/assets/research/aegis.png' },
      },
      {
        id: 'prism-ad',
        title: 'PRISM-AD',
        sub: 'Topology-aware operator learning for fusion plasmas',
        blurb: 'Physics-constrained FNOs with a topological layer to predict and suppress instabilities in Vlasov-Maxwell plasma.',
        href: '/assets/research/prism-ad.pdf',
        form: { type: 'paper', src: '/assets/research/prism-ad.png' },
      },
      {
        id: 'bpu',
        title: 'BrAIn Processing Unit',
        sub: 'A self-assembling stochastic substrate for brain-like and frontier models',
        blurb: 'A non-von Neumann architecture whose primitives are brain circuits: stochastic memristor synapses, runtime growth as compilation, and a persistent-homology check on what the hardware grows. Draft, October 2026.',
        href: '/assets/research/bpu.pdf',
        form: { type: 'paper', src: '/assets/research/bpu.png' },
      },
      {
        id: 'orbit-catastrophes',
        title: 'Orbit Catastrophes',
        sub: 'Elementary catastrophes of circular orbits in Kerr-Newman spacetimes',
        blurb: 'A programme paper: the classification of orbit degeneracies is forced to be catastrophe-theoretic, the cusp locus is a curve, and the kill tests are stated before the work is done. N. Guggilam, in preparation.',
        href: '/assets/research/orbit-catastrophes.pdf',
        form: { type: 'paper', src: '/assets/research/orbit-catastrophes.png' },
      },
      {
        id: 'persistence-bifurcations',
        title: 'Persistence Invariant',
        sub: 'Classifying codimension-two bifurcations from trajectory data alone',
        blurb: 'A topological invariant that tells Bogdanov-Takens, cusp and Bautin points apart from sampled trajectories, with no equations. The Hopf angle is recovered to 0.15 percent by a scaling law. N. Guggilam, interim summary.',
        href: '/assets/research/persistence-bifurcations.pdf',
        form: { type: 'paper', src: '/assets/research/persistence-bifurcations.png' },
      },
    ],
  },
  projects: {
    label: 'Projects',
    preview: true,
    kicker: 'Builds',
    items: [
      {
        id: 'sb8',
        title: 'SB8',
        sub: 'Jet airframe',
        blurb: 'The SB8, rendered straight from its CAD model.',
        form: { type: 'stl', src: '/assets/projects/sb8.stl', size: 4.8, rotX: -Math.PI / 2 },
      },
      {
        id: 'drones',
        title: 'Drones',
        sub: 'Predator airframe',
        blurb: 'Custom designed plane. Placeholder model until the drone CAD is added.',
        form: { type: 'stl', src: '/assets/projects/predator.stl', size: 5.0, rotX: -Math.PI / 2 },
      },
    ],
  },
};
