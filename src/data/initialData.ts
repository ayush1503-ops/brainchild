import { Game, Article, Job, StudioTimelineItem, TeamMember } from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-01',
    slug: 'aetherbound-echoes-of-zero',
    title: 'AETHERBOUND',
    subtitle: 'Echoes of Zero',
    genre: 'Atmospheric Gravity Adventure',
    platforms: ['PC (Steam)', 'PlayStation 5', 'Xbox Series X|S'],
    status: 'Wishlist Now',
    releaseYear: 'Q4 2026',
    description: 'A gravity-defying expedition across shattered crystalline archipelagoes drifting within a living dying nebula.',
    longDescription: 'In Aetherbound, players step into the boots of a stranded celestial cartographer traversing fragmented planetary rings where gravity fractures along light vectors. Utilize fluid momentum redirection, magnetic grappling, and ancient resonance tuners to navigate colossal monoliths and uncover what brought silence to the cradle worlds.',
    heroImage: '/src/assets/images/aetherbound_hero_1789202758885.jpg',
    secondaryImage: '/src/assets/images/chrono_game_1789202792978.jpg',
    screenshots: [
      '/src/assets/images/aetherbound_hero_1789202758885.jpg',
      '/src/assets/images/solaris_game_1789202777740.jpg',
      '/src/assets/images/chrono_game_1789202792978.jpg',
      '/src/assets/images/void_heist_1789202835481.jpg'
    ],
    tags: ['Sci-Fi', 'Zero-G Physics', 'Exploration', 'Atmospheric', 'Single Player'],
    features: [
      'Seamless 360° Omnidirectional Vector Movement with custom momentum physics',
      'Living bioluminescent ecosystem reacting to sonic resonance frequencies',
      'Dynamic celestial storm simulations altering local gravity currents in real time',
      'Modular exploration suit upgrades discovered through environmental archeology'
    ],
    gameplayMechanics: [
      {
        title: 'Vector-Shift Locomotion',
        description: 'Anchor personal gravity to any crystalline surface or slingshot across orbital chasms without loading screens.'
      },
      {
        title: 'Resonance Tuning',
        description: 'Harmonize ancient acoustic beacons to bridge light bridges and awake long-dormant planetary engines.'
      },
      {
        title: 'Atmospheric Navigation',
        description: 'Read particulate solar wind patterns and magnetic anomalies to plot perilous pathways through dust ribbons.'
      }
    ],
    devStory: 'Conceived in a late-night whiteboard session exploring the physical sensation of falling sideways through starlight. Built with custom Unreal Engine 5 gravity physics solvers tuned over four years of iterative flight tests.',
    storeLinks: [
      { name: 'Steam', url: '#steam', badge: 'Wishlist' },
      { name: 'PlayStation Store', url: '#psn', badge: 'Coming Soon' },
      { name: 'Xbox', url: '#xbox', badge: 'Coming Soon' }
    ],
    awards: ['Best Art Direction Nominee — Indie Game Festival', 'Most Anticipated World — PlayForward 2025'],
    featured: true
  },
  {
    id: 'game-02',
    slug: 'solaris-diver',
    title: 'SOLARIS DIVER',
    subtitle: 'Into the Corona',
    genre: 'Solar Expedition Deep-Space RPG',
    platforms: ['PC (Steam / GOG)', 'Mac'],
    status: 'Early Access',
    releaseYear: 'Live Now',
    description: 'Command an experimental solar skiff skimming the turbulent surface of a dying golden star to harvest radiant stellar anomalies.',
    longDescription: 'Solaris Diver puts you at the helm of an insulated deep-core submersible spaceship. Balance heat dissipation, solar radiation shields, and crew morale as you plunge into blinding magnetic arches and retrieve relics trapped before stellar collapse.',
    heroImage: '/src/assets/images/solaris_game_1789202777740.jpg',
    secondaryImage: '/src/assets/images/aetherbound_hero_1789202758885.jpg',
    screenshots: [
      '/src/assets/images/solaris_game_1789202777740.jpg',
      '/src/assets/images/chrono_game_1789202792978.jpg',
      '/src/assets/images/void_heist_1789202835481.jpg'
    ],
    tags: ['Survival', 'Space Flight', 'Procedural', 'Resource Management'],
    features: [
      'Realistic thermal hydrodynamic simulation of solar flares and magnetic reconnection loops',
      'Deep modular skiff customization with over 80 radiant hull alloys and cooling fins',
      'Emergent radio telescope eavesdropping on ancient deep-space communication buoys'
    ],
    gameplayMechanics: [
      {
        title: 'Thermal Drift Mechanics',
        description: 'Ride blistering convection currents to preserve fuel while venting excess plasma before hull breaches.'
      },
      {
        title: 'Solar Harpoons',
        description: 'Tether unstable hyperdense cores and extract them through high-gravity radiation torrents.'
      }
    ],
    devStory: 'Created after studying NASA SDO solar telescope footage, translating solar thermodynamics into a high-stakes, nerve-wracking mechanical experience.',
    storeLinks: [
      { name: 'Steam Early Access', url: '#steam', badge: 'Play Now ($24.99)' },
      { name: 'GOG', url: '#gog', badge: 'DRM-Free' }
    ],
    awards: ['Innovation in Audio Excellence 2024'],
    featured: false
  },
  {
    id: 'game-03',
    slug: 'chrono-monolith',
    title: 'CHRONO MONOLITH',
    subtitle: 'The Architecture of Time',
    genre: 'Surreal Architectural Puzzle Mystery',
    platforms: ['PC', 'Nintendo Switch', 'PlayStation 5'],
    status: 'In Development',
    releaseYear: '2026',
    description: 'Rewind, shatter, and rebuild colossal non-Euclidean ruins across three concurrent temporal eras in a desert defying entropy.',
    longDescription: 'A contemplative puzzle odyssey where every structure exists simultaneously in ancient genesis, golden decay, and futuristic petrification. Rotate temporal perspectives to reconstruct collapsed aqueducts, sand cascades, and lost stone automata.',
    heroImage: '/src/assets/images/chrono_game_1789202792978.jpg',
    secondaryImage: '/src/assets/images/aetherbound_hero_1789202758885.jpg',
    screenshots: [
      '/src/assets/images/chrono_game_1789202792978.jpg',
      '/src/assets/images/solaris_game_1789202777740.jpg'
    ],
    tags: ['Puzzle', 'Narrative', 'Architectural', 'Atmospheric', 'Stylized'],
    features: [
      'Simultaneous triple-era timeline manipulation with zero loading delay',
      'Mind-bending non-Euclidean spatial geometries influenced by Escher and brutalism',
      'Orchestral acoustic score composed with microtonal analog synthesizers and cello'
    ],
    gameplayMechanics: [
      {
        title: 'Tri-Phase Slicing',
        description: 'Bisect your physical chamber with past and future planes to step through doors that haven’t been carved yet.'
      },
      {
        title: 'Entropy Reversion',
        description: 'Reconstitute shattered pillars by freezing dust torrents into solid climbable marble.'
      }
    ],
    devStory: 'Inspired by Mediterranean brutalist sanctuaries and the philosophy of temporal persistence.',
    storeLinks: [
      { name: 'Steam', url: '#steam', badge: 'Wishlist' },
      { name: 'Nintendo eShop', url: '#eshop', badge: 'Coming Soon' }
    ],
    awards: ['Selected for BitSummit Showcase Kyoto'],
    featured: false
  },
  {
    id: 'game-04',
    slug: 'void-protocol',
    title: 'VOID PROTOCOL',
    subtitle: 'Tactical Kinetic Infiltration',
    genre: 'Stylized Cyber-Heist Tactical Action',
    platforms: ['PC', 'Xbox Series X|S', 'PlayStation 5'],
    status: 'In Development',
    releaseYear: '2027',
    description: 'Coordinate synchronized team infiltrations through brutalist corporate megaliths bathed in twilight phosphor glows.',
    longDescription: 'Void Protocol blends tactical planning phases with fluid real-time breach execution. Hack orbital telemetry networks, bypass biometric lasers, and coordinate four asymmetric operatives through vertical skyscraper labyrinths.',
    heroImage: '/src/assets/images/void_heist_1789202835481.jpg',
    secondaryImage: '/src/assets/images/solaris_game_1789202777740.jpg',
    screenshots: [
      '/src/assets/images/void_heist_1789202835481.jpg',
      '/src/assets/images/aetherbound_hero_1789202758885.jpg'
    ],
    tags: ['Tactical', 'Cyberpunk', 'Co-op', 'Heist', 'Stealth'],
    features: [
      'Synchronized timeline tactical planner: plan in milliseconds, execute in fluid real-time',
      'Asymmetric 4-player operative roles: Infiltrator, Net-Weaver, Heavy Kinetic, and Spotter',
      'Tactile retro-futuristic holographic interfaces inspired by early 90s anime'
    ],
    gameplayMechanics: [
      {
        title: 'Synchro-Breach',
        description: 'Queue multi-agent explosive entries down to individual frame triggers for seamless tactical mastery.'
      }
    ],
    devStory: 'Born from our obsession with 90s cyber-noir aesthetics and mechanical precision, pushing tactical stealth into a high-art visual territory.',
    storeLinks: [
      { name: 'Steam', url: '#steam', badge: 'Wishlist' }
    ],
    featured: false
  }
];

export const INITIAL_NEWS: Article[] = [
  {
    id: 'article-01',
    slug: 'crafting-zero-gravity-kinetics-in-aetherbound',
    title: 'Defying Physics: Crafting Zero-Gravity Fluid Kinetics in Aetherbound',
    category: 'DEVLOG',
    date: 'SEPTEMBER 2026',
    readTime: '6 MIN READ',
    excerpt: 'How we threw out conventional third-person camera physics to build an omnidirectional flight system that feels weightless yet tactile.',
    content: `When we began prototyping Aetherbound in early 2023, our biggest challenge was vestibular vertigo: in a true zero-gravity environment without a persistent "floor", traditional cameras become violently disorienting within minutes.

To solve this, our technical director designed what we call the "Horizon Anchor Algorithm". Rather than forcing the player's camera to roll against an arbitrary world vector, the camera dynamically creates a soft optical horizon based on the player's last three vector impulses and the curvature of nearby crystalline masses.

### The Physics of Celestial Drifts

Every particle in the nebular field carries dynamic velocity vectors. When you fire an anchor cable into a drifting crystalline asteroid, tension forces propagate through custom spline spring dampers. You do not just snap to the rock—you feel the micro-rotations of the asteroid as your mass interacts with its inertia.

### Acoustic Feedback in a Vacuum

While true space is silent, your exploration suit transmits bone-conducted acoustic frequencies: the groaning resonance of magnetic clamps, the low rumble of thruster gas expanding in cold vacuum, and the eerie chime of charged crystals vibrating against your outer visor. We captured over 400 real mechanical impacts using hydrophones and contact mics on industrial equipment in Montreal.`,
    coverImage: '/src/assets/images/aetherbound_hero_1789202758885.jpg',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Systems & Physics Programmer'
    },
    tags: ['Physics Engine', 'Game Feel', 'Unreal Engine', 'Aetherbound'],
    featured: true,
    published: true
  },
  {
    id: 'article-02',
    slug: 'meet-nova-the-astronaut-heart-of-brainchild',
    title: 'The Origin of Nova: Designing Brainchild Games’ Wandering Astronaut',
    category: 'BEHIND THE SCENES',
    date: 'AUGUST 2026',
    readTime: '4 MIN READ',
    excerpt: 'Why an analog astronaut with mismatched boots and a warm orange pack became the guiding beacon for our studio culture.',
    content: `When Brainchild Games was founded in 2019, we didn't want a cold geometric badge or an aggressive predator logo. We wanted a wanderer. An explorer who is curious rather than militaristic, who travels to strange places not to conquer them, but to gaze up at colossal cosmic ruins and take notes.

Nova—our astronaut mascot—was born in an old sketchbook during a late train ride. The oversized helmet with the reflective navy visor reflects whatever world the studio happens to be building at that moment. The orange oxygen pack represents human warmth, while the striped planetary boots are a playful nod to retro space exploration patches.

Whenever a new member joins the studio, they receive an enamel Nova pin and their own personalized mini-statue on their desk. Nova reminds us of why we make games: to give people that magical childhood feeling of staring out into an endless sky and wanting to see what's on the other side.`,
    coverImage: '/src/assets/images/mascot_astro_1789202807233.jpg',
    author: {
      name: 'Julian Vance',
      role: 'Creative Director & Co-Founder'
    },
    tags: ['Studio Culture', 'Brand Identity', 'Character Design'],
    featured: false,
    published: true
  },
  {
    id: 'article-03',
    slug: 'solaris-diver-major-update-prominence',
    title: 'Solaris Diver: Update 0.8 "Prominence" Now Live on Steam',
    category: 'ANNOUNCEMENT',
    date: 'JULY 2026',
    readTime: '3 MIN READ',
    excerpt: 'Dive deeper into the solar chromosphere with 14 new skiff chassis modules, dynamic magnetic reconnection storms, and expanded radio lore.',
    content: `Update 0.8 is our largest Early Access content drop to date for Solaris Diver. Based on community feedback from over 45,000 pilots, we have overhauled the core heat dispersion mechanics and added two completely new deep-corona biomes: the Prominence Hollows and the Magnetic Maw.

Check out the full patch notes on our Steam community hub or hop into our studio Discord to share your skiff loadouts!`,
    coverImage: '/src/assets/images/solaris_game_1789202777740.jpg',
    author: {
      name: 'Kai Takahashi',
      role: 'Lead Producer'
    },
    tags: ['Solaris Diver', 'Patch Notes', 'Early Access'],
    featured: false,
    published: true
  },
  {
    id: 'article-04',
    slug: 'music-of-the-monolith-analog-synthesis',
    title: 'Sounding the Monolith: Composing with Broken Synthesizers & Cellos',
    category: 'DEVLOG',
    date: 'JUNE 2026',
    readTime: '5 MIN READ',
    excerpt: 'Behind the haunting, acoustic-synthetic soundscapes shaping the surreal architectural puzzles of Chrono Monolith.',
    content: `For Chrono Monolith, standard orchestral strings felt too grounded in human history. We wanted a score that sounds like ancient stone groaning under the weight of eons. 

We brought vintage tape delays, custom resonant filters, and microtonal cello bowing into an abandoned cathedral in Normandy to capture pure natural reverberations. The resulting textures pulse with the architectural shifts in the game.`,
    coverImage: '/src/assets/images/chrono_game_1789202792978.jpg',
    author: {
      name: 'Sariel Moreau',
      role: 'Audio Director'
    },
    tags: ['Sound Design', 'Chrono Monolith', 'Music'],
    featured: false,
    published: true
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-01',
    title: 'Lead Systems & Physics Programmer',
    department: 'Engineering',
    location: 'Montreal, Canada / Remote (Americas & EU)',
    type: 'Full-time',
    experience: 'Lead',
    description: 'Lead the architectural design and implementation of novel physical locomotion, zero-gravity mechanics, and environmental simulation for our upcoming flagship titles.',
    responsibilities: [
      'Architect and optimize real-time custom physics simulation systems in Unreal Engine 5 (C++)',
      'Collaborate directly with game designers to tune kinematic feel, momentum preservation, and responsive player control',
      'Mentor and guide a tight-knit team of 6 systems and gameplay engineers',
      'Profile memory, cache locality, and multi-threaded CPU budgets across PC, PS5, and Xbox Series X'
    ],
    requirements: [
      '7+ years of professional gameplay and systems engineering experience with at least 1 shipped AAA or high-profile indie title',
      'Deep mastery of modern C++, vector mathematics, rigid body dynamics, and low-level engine optimization',
      'Proven track record building bespoke kinematic character controllers or vehicle physics',
      'Passion for game feel, micro-feedback, and tactile player responsiveness'
    ],
    niceToHave: [
      'Experience with custom HLSL/GLSL compute shaders for physical particle simulation',
      'Familiarity with network prediction and replication for physics-driven cooperative games'
    ],
    perks: [
      'Competitive salary with generous project profit-sharing pool',
      'Comprehensive health, dental, and wellness coverage',
      'Flexible 4-day work week (Monday–Thursday 36-hour schedule)',
      '$4,000 annual home office & gaming hardware stipend',
      'Annual studio retreat to scenic mountain cabins'
    ],
    status: 'open',
    postedDate: 'SEPTEMBER 2026'
  },
  {
    id: 'job-02',
    title: 'Senior 3D Technical Environment Artist',
    department: 'Art & Animation',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Shape the crystalline archipelagos, shifting brutalist monoliths, and cosmic nebular vistas that define Brainchild Games’ visual signature.',
    responsibilities: [
      'Build breathtaking modular environment kits, bespoke hero props, and procedural landscape shaders',
      'Establish technical art pipelines for Nanite, Lumen, and custom volumetric atmospheric shaders',
      'Collaborate with the Art Director to push color balance, focal lighting, and architectural mood',
      'Optimize geometry budgets and texture memory without sacrificing painterly editorial fidelity'
    ],
    requirements: [
      '5+ years of experience in 3D environment production for games',
      'Strong portfolio demonstrating high-concept sci-fi or surreal architectural landscapes with distinct artistic style',
      'Expertise in Blender/Maya, Substance Designer/Painter, and Unreal Engine 5 shader graph',
      'Firm grasp of lighting theory, composition, and visual storytelling'
    ],
    niceToHave: [
      'Experience with Houdini procedural asset generation',
      'Sculpting proficiency in ZBrush for stylized organic stone and crystal formations'
    ],
    perks: [
      'Full health benefits & wellness allowance',
      'Flexible asynchronous working hours across timezones',
      'Generous gear & software license provisions',
      'Profit sharing on all studio releases'
    ],
    status: 'open',
    postedDate: 'AUGUST 2026'
  },
  {
    id: 'job-03',
    title: 'Senior Narrative Designer & Worldbuilder',
    department: 'Game Design',
    location: 'Montreal / Hybrid',
    type: 'Full-time',
    experience: 'Senior',
    description: 'Craft the enigmatic lore, environmental storytelling beats, and memorable character dialogues for our unannounced sci-fi and speculative mystery titles.',
    responsibilities: [
      'Write compelling in-world documentation, cryptic terminal logs, celestial audio logs, and atmospheric dialogue',
      'Collaborate with level designers to embed narrative clues subtly inside environmental architecture',
      'Maintain the studio’s overarching "Worldbuilding Bible" across connected cosmic realities'
    ],
    requirements: [
      '4+ years of professional narrative design or game writing experience',
      'A writing sample demonstrating subtle, evocative, non-expository storytelling',
      'Ability to integrate narrative mechanics directly into gameplay systems'
    ],
    niceToHave: [
      'Background in speculative fiction, poetry, or architectural history',
      'Experience scripting branching dialogue in tools like Ink or Twine'
    ],
    perks: [
      'Book purchase stipend & attendance at major writing/game festivals',
      '4-day work week and generous paid time off',
      'Studio profit sharing'
    ],
    status: 'open',
    postedDate: 'SEPTEMBER 2026'
  },
  {
    id: 'job-04',
    title: 'Audio Director & Sound Designer',
    department: 'Audio',
    location: 'Remote / Montreal',
    type: 'Full-time',
    experience: 'Director',
    description: 'Direct the auditory soul of Brainchild Games, blending physical Foley recording with modular synth soundscapes and dynamic audio implementation in Wwise.',
    responsibilities: [
      'Establish the auditory identity for all Brainchild titles from concept to final ship',
      'Design, record, and process bespoke sci-fi audio assets, cosmic atmospheric drones, and tactile UI clicks',
      'Manage and implement interactive audio graphs in Wwise / UE5 Sound Cues'
    ],
    requirements: [
      '6+ years of sound design experience in games, with at least 1 shipped title as Lead or Director',
      'Expertise in DAW tools (Pro Tools / Reaper), modular synthesis, and Wwise',
      'Exceptional creative ear for unconventional and emotional sound palettes'
    ],
    niceToHave: [
      'Experience recording real-world industrial Foley and contact microphone audio',
      'C++ or visual scripting skills for procedural audio triggers'
    ],
    perks: [
      'Dedicated studio sound lab equipment budget',
      'Profit sharing & comprehensive healthcare',
      '4-day work week'
    ],
    status: 'open',
    postedDate: 'AUGUST 2026'
  }
];

export const STUDIO_TIMELINE: StudioTimelineItem[] = [
  {
    year: '2019',
    title: 'THE SPARK IN THE BASEMENT',
    description: 'Founded by two indie developers tired of predictable mechanics. The studio was established with a singular manifesto: "Build places you want to inhabit."',
    tag: 'ORIGIN'
  },
  {
    year: '2021',
    title: 'BIRTH OF NOVA',
    description: 'Created our studio mascot "Nova the Astro-Explorer" and released our first experimental physics prototype "Orbital Drift", winning Best Student/Indie Prototype.',
    tag: 'MILESTONE'
  },
  {
    year: '2023',
    title: 'SOLARIS DIVER UNVEILED',
    description: 'Launched Solaris Diver into Early Access on Steam to critical acclaim from survival and space simulation enthusiasts, crossing 100,000 wishlist targets.',
    tag: 'RELEASE'
  },
  {
    year: '2025',
    title: 'TEAM EXPANSION & UNREAL 5',
    description: 'Expanded the studio to 28 passionate artists, programmers, and designers worldwide. Transitioned full development of Aetherbound onto Unreal Engine 5.',
    tag: 'EXPANSION'
  },
  {
    year: '2026 & BEYOND',
    title: 'THE NEXT HORIZON',
    description: 'Preparing the global launch of Aetherbound: Echoes of Zero and prototyping two radical new genre experiments.',
    tag: 'PRESENT'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Julian Vance',
    role: 'Creative Director & Co-Founder',
    bio: 'Former architect turned worldbuilder. Obsessed with brutalist monoliths, zero-gravity physics, and modular analog synthesizers.',
    favoriteGame: 'Outer Wilds & Shadow of the Colossus',
    photoColor: '#ff5722'
  },
  {
    name: 'Maya Lin-Torvalds',
    role: 'Technical Director & Co-Founder',
    bio: 'Veteran graphics and physics architect. Loves rendering volumetric clouds, writing custom compute shaders, and brewing dark roast espresso.',
    favoriteGame: 'Homeworld & Metroid Prime',
    photoColor: '#22d3ee'
  },
  {
    name: 'Elena Rostova',
    role: 'Lead Systems Programmer',
    bio: 'Mathematics enthusiast who believes every mechanic should have physical inertia and weight. Built Aetherbound’s zero-g flight model.',
    favoriteGame: 'Kerbal Space Program & Portal 2',
    photoColor: '#fbbf24'
  },
  {
    name: 'Sariel Moreau',
    role: 'Audio Director',
    bio: 'Sound sculptor who records creaking metal in abandoned factories and turns them into cosmic nebular symphonies.',
    favoriteGame: 'Silent Hill 2 & Journey',
    photoColor: '#f43f5e'
  }
];
