import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@brainchild.games';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const adminName = process.env.ADMIN_NAME || 'Studio Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'SUPER_ADMIN'
    }
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: { name: 'News', slug: 'news', color: '#FF5A3C' }
    }),
    prisma.category.upsert({
      where: { slug: 'devlog' },
      update: {},
      create: { name: 'Devlog', slug: 'devlog', color: '#6C4CF1' }
    }),
    prisma.category.upsert({
      where: { slug: 'behind-the-scenes' },
      update: {},
      create: { name: 'Behind the Scenes', slug: 'behind-the-scenes', color: '#FFC53D' }
    }),
    prisma.category.upsert({
      where: { slug: 'announcement' },
      update: {},
      create: { name: 'Announcement', slug: 'announcement', color: '#A8D92C' }
    }),
    prisma.category.upsert({
      where: { slug: 'studio' },
      update: {},
      create: { name: 'Studio', slug: 'studio', color: '#2FB9DD' }
    }),
    prisma.category.upsert({
      where: { slug: 'community' },
      update: {},
      create: { name: 'Community', slug: 'community', color: '#FF5A3C' }
    })
  ]);
  console.log(`✅ ${categories.length} categories created`);

  const newsCategory = categories.find(c => c.slug === 'news')!;
  const devlogCategory = categories.find(c => c.slug === 'devlog')!;
  const studioCategory = categories.find(c => c.slug === 'studio')!;

  // Create games
  const games = [
    {
      slug: 'aetherbound-echoes-of-zero',
      title: 'AETHERBOUND',
      subtitle: 'Echoes of Zero',
      genre: 'Sky-Island Adventure',
      categories: ['Adventure', 'Action', 'Indie'],
      rating: 4.9,
      price: 'Wishlist free',
      currency: 'INR',
      isFree: true,
      platforms: ['PC (Steam)', 'PlayStation 5', 'Xbox Series X|S'],
      status: 'WISHLIST_NOW',
      releaseYear: 'Q4 2026',
      description: 'Swing, glide and grapple across floating sky-islands where waterfalls fall forever into a sea of clouds.',
      longDescription: `In Aetherbound you play a young cartographer charting a sky full of drifting islands. Ride warm wind currents, tether-grapple between vine-wrapped ruins, and wake the ancient wind shrines that keep the whole archipelago afloat. Every island is a little pocket world: a garden, a bell tower, a sleepy village, a storm you can surf.`,
      heroImage: '/uploads/aetherbound-hero.jpg',
      secondaryImage: '/uploads/aetherbound-wide.jpg',
      screenshots: [
        '/uploads/aetherbound-1.jpg',
        '/uploads/aetherbound-2.jpg',
        '/uploads/aetherbound-3.jpg'
      ],
      tags: ['Sky Islands', 'Grapple', 'Exploration', 'Feel-Good', 'Single Player'],
      features: [
        'Momentum-based tether grappling with zero loading screens between islands',
        'A living sky: weather fronts, hot-air currents and cloud seas that react to you',
        'Hand-painted shrines, bell towers and villages full of small friendly stories',
        'A collectible sticker journal that records every island you chart'
      ],
      devStory: 'Born in a greybox room where we spent three months doing nothing but swinging at a wall and laughing. If the swing stopped feeling good, we threw the build away and started again.',
      storeLinks: [
        { name: 'Steam', url: '#steam', badge: 'Wishlist' },
        { name: 'PlayStation Store', url: '#psn', badge: 'Coming Soon' },
        { name: 'Xbox', url: '#xbox', badge: 'Coming Soon' }
      ],
      awards: ['Best Art Direction Nominee — Indie Game Festival', 'Most Anticipated World — PlayForward 2025'],
      featured: true,
      featuredOrder: 1,
      published: true,
      gameplayMechanics: [
        { title: 'Tether Swing', description: 'Fire your coral tether into any grapple point and swing with real weight and momentum — easy to learn, delicious to master.' },
        { title: 'Wind Reading', description: 'Watch the clouds and banners to spot rising currents that launch you across huge gaps in a single breath.' },
        { title: 'Shrine Tuning', description: 'Ring the old wind shrines in the right order to rebuild bridges of solid breeze between broken islands.' }
      ]
    },
    {
      slug: 'solaris-diver',
      title: 'SOLARIS DIVER',
      subtitle: 'Into the Corona',
      genre: 'Golden-Sea Expedition RPG',
      categories: ['RPG', 'Adventure'],
      rating: 4.7,
      price: '$24.99',
      currency: 'USD',
      isFree: false,
      platforms: ['PC (Steam / GOG)', 'Mac'],
      status: 'EARLY_ACCESS',
      releaseYear: 'Live Now',
      description: 'Pilote a cozy little submarine through an ocean of liquid light, harvesting glowing anomalies before the tide turns.',
      longDescription: `Solaris Diver puts you at the helm of a round, creaky, loveable diving bell. Balance heat, ballast and crew morale as you descend through golden currents, tether shining cores back to the surface, and trade them for a bigger bell, a faster propeller, and a very unnecessary brass horn.`,
      heroImage: '/uploads/solaris-hero.jpg',
      secondaryImage: '/uploads/solaris-wide.jpg',
      screenshots: [
        '/uploads/solaris-1.jpg',
        '/uploads/solaris-2.jpg',
        '/uploads/solaris-3.jpg'
      ],
      tags: ['Survival', 'Deep Dive', 'Procedural', 'Resource Management'],
      features: [
        'A warm, wobbling buoyancy sim that rewards patience and clever routes',
        'Over 80 hull plates, fins and lamps to kit out your diving bell',
        'A radio that picks up half-heard songs from other divers down in the glow'
      ],
      devStory: 'Created after a studio trip to a bioluminescent bay in Puerto Rico. We wanted that exact feeling: dark water, glowing everywhere, and nobody wanting to go back to shore.',
      storeLinks: [
        { name: 'Steam Early Access', url: '#steam', badge: 'Play Now ($24.99)' },
        { name: 'GOG', url: '#gog', badge: 'DRM-Free' }
      ],
      awards: ['Innovation in Audio Excellence 2024'],
      featured: false,
      published: true,
      gameplayMechanics: [
        { title: 'Thermal Drift', description: 'Ride warm updrafts to save ballast, then vent heat in time before your glass dome foggs up.' },
        { title: 'Light Harpoons', description: 'Tether unstable glow-cores and reel them in through swirling golden currents without snapping the line.' }
      ]
    },
    {
      slug: 'chrono-monolith',
      title: 'CHRONO MONOLITH',
      subtitle: 'The Architecture of Time',
      genre: 'Surreal Puzzle Mystery',
      categories: ['Puzzle', 'Indie'],
      rating: 4.8,
      price: 'Wishlist free',
      currency: 'INR',
      isFree: true,
      platforms: ['PC', 'Nintendo Switch', 'PlayStation 5'],
      status: 'IN_DEVELOPMENT',
      releaseYear: '2026',
      description: 'Rewind, shatter and rebuild impossible marble ruins that exist in three time periods at once.',
      longDescription: `A contemplative puzzle odyssey set in a desert that refuses to settle on a century. Every structure exists simultaneously as fresh-built, golden-age and crumbled ruin. Slide between the three eras to reconnect aqueducts, freeze sandfalls into climbable stairs, and wake the stone automata who still remember the architects.`,
      heroImage: '/uploads/chrono-hero.jpg',
      secondaryImage: '/uploads/chrono-wide.jpg',
      screenshots: [
        '/uploads/chrono-1.jpg',
        '/uploads/chrono-2.jpg'
      ],
      tags: ['Puzzle', 'Narrative', 'Architecture', 'Stylized', 'Cozy Brain-Bender'],
      features: [
        'Seamless triple-era sliding with zero loading delay',
        'Impossible staircases and Escher-flavoured courtyards that always play fair',
        'An orchestral score recorded with broken tape delays and a very patient cellist'
      ],
      devStory: 'Inspired by a rainy week spent sketching brutalist chapels and arguing about whether ruins are sadder or happier than new buildings.',
      storeLinks: [
        { name: 'Steam', url: '#steam', badge: 'Wishlist' },
        { name: 'Nintendo eShop', url: '#eshop', badge: 'Coming Soon' }
      ],
      awards: ['Selected for BitSummit Showcase Kyoto'],
      featured: false,
      published: true,
      gameplayMechanics: [
        { title: 'Tri-Phase Slicing', description: 'Split your chamber between past and future planes to step through doors that have not been carved yet.' },
        { title: 'Entropy Reversion', description: 'Freeze a collapsing sandfall mid-fall and climb it like a marble staircase.' }
      ]
    },
    {
      slug: 'void-protocol',
      title: 'VOID PROTOCOL',
      subtitle: 'The Great Rooftop Caper',
      genre: 'Co-op Heist Action',
      categories: ['Action', 'Indie'],
      rating: 4.6,
      price: 'Alpha soon',
      currency: 'INR',
      isFree: true,
      platforms: ['PC', 'Xbox Series X|S', 'PlayStation 5'],
      status: 'IN_DEVELOPMENT',
      releaseYear: '2027',
      description: 'Plan the perfect rooftop heist with three friends, then watch it gloriously survive contact with reality.',
      longDescription: `Void Protocol blends a chill planning phase with a fizzy real-time caper. Mark the guard routes, rig the zip-lines, assign who carries the snacks — then execute together as four gloriously mismatched thieves across a city of round towers, string lights and very confused pigeons.`,
      heroImage: '/uploads/void-hero.jpg',
      secondaryImage: '/uploads/void-wide.jpg',
      screenshots: [
        '/uploads/void-1.jpg',
        '/uploads/void-2.jpg'
      ],
      tags: ['Tactical', 'Co-op', 'Heist', 'Stealth', 'Comedy'],
      features: [
        'A sync-planner: draw the plan in seconds, execute it in fluid real-time',
        'Four asymmetric roles: Infiltrator, Rigger, Heavy and Lookout',
        'Every heist ends with a replay card of your best (and worst) moment'
      ],
      devStory: 'Born from friday-night co-op sessions where the plan never survived the first guard. We decided that was the game.',
      storeLinks: [
        { name: 'Steam', url: '#steam', badge: 'Wishlist' }
      ],
      awards: [],
      featured: false,
      published: true,
      gameplayMechanics: [
        { title: 'Synchro-Breach', description: 'Queue simultaneous entries down to the frame — or panic and improvise, which also works, sometimes.' }
      ]
    }
  ];

  for (const gameData of games) {
    const { gameplayMechanics, storeLinks, ...game } = gameData;
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: {
        ...game,
        gameplayMechanics: { create: gameplayMechanics },
        storeLinks: { create: storeLinks }
      }
    });
  }
  console.log(`✅ ${games.length} games created`);

  // Create news posts
  const newsPosts = [
    {
      slug: 'defying-gravity-gliding-aetherbound',
      title: 'Defying Gravity: How We Made Gliding Feel Like a Deep Breath',
      excerpt: 'How we threw out conventional third-person camera rules to build a wind-current flight system that feels weightless yet completely under control.',
      content: `When we began prototyping Aetherbound in early 2023, our biggest challenge was comfort: in a world with no floor, traditional cameras become disorienting within minutes.

To solve this, our technical director designed what we call the "Horizon Anchor Algorithm". Rather than forcing the camera to roll against an arbitrary world vector, it builds a soft optical horizon from your last three swing impulses and the curve of the nearest island.

### The Physics of Cloud Drifts

Every particle in the cloud sea carries a dynamic velocity vector. When you fire your tether into a vine-wrapped ruin, tension propagates through custom spline spring dampers. You do not just snap to the rock — you feel the island sway slightly under your weight.

### Sound Where There Is Only Wind

Your tether hums, the canvas of your glide-suit flaps, and distant shrines chime when a weather front passes. We recorded over 400 real mechanical impacts using contact mics on playground swings, boat rigging and old church bells around Montreal.`,
      coverImage: '/uploads/news-gliding.jpg',
      categoryId: devlogCategory.id,
      authorName: 'Elena Rostova',
      authorRole: 'Lead Systems & Physics Programmer',
      tags: ['Physics Engine', 'Game Feel', 'Aetherbound'],
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date('2026-10-15')
    },
    {
      slug: 'meet-pix-studio-heart',
      title: 'Meet Pix: The Little Robot Who Became Our Studio Heart',
      excerpt: 'Why a chunky cream-and-coral robot with a purple controller became the guiding mascot for our studio culture.',
      content: `When Brainchild Games was founded in 2019, we didn't want a cold geometric badge or an aggressive predator logo. We wanted a player. A buddy who is curious rather than competitive, who holds a controller slightly too big for its hands and grins anyway.

Pix was born in an old sketchbook during a late train ride. The star-tipped antenna represents the small spark of every new prototype. The coral joints stand for human warmth, and the purple controller is a playful nod to the four-button pads we grew up on.

Whenever a new member joins the studio, they receive an enamel Pix pin and a tiny desk statue. Pix reminds us why we make games: that childhood feeling of pressing start and believing, completely, that something wonderful is on the other side of the screen.`,
      coverImage: '/uploads/news-pix.jpg',
      categoryId: studioCategory.id,
      authorName: 'Julian Vance',
      authorRole: 'Creative Director & Co-Founder',
      tags: ['Studio Culture', 'Brand Identity', 'Character Design'],
      status: 'PUBLISHED',
      featured: false,
      publishedAt: new Date('2026-08-01')
    },
    {
      slug: 'solaris-diver-update-prominence',
      title: 'Solaris Diver: Update 0.8 "Prominence" Is Live on Steam',
      excerpt: 'Dive deeper into the golden sea with 14 new hull modules, dynamic light-storms, and expanded radio lore.',
      content: `Update 0.8 is our largest Early Access content drop to date for Solaris Diver. Based on feedback from over 45,000 divers, we have overhauled the core heat dispersion mechanics and added two completely new deep-glow biomes: the Prominence Hollows and the Lantern Trench.

Check out the full patch notes on our Steam community hub, or hop into our studio Discord to share your bell loadouts!`,
      coverImage: '/uploads/news-solaris-update.jpg',
      categoryId: newsCategory.id,
      authorName: 'Kai Takahashi',
      authorRole: 'Lead Producer',
      tags: ['Solaris Diver', 'Patch Notes', 'Early Access'],
      status: 'PUBLISHED',
      featured: false,
      publishedAt: new Date('2026-07-15')
    }
  ];

  for (const postData of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData
    });
  }
  console.log(`✅ ${newsPosts.length} news posts created`);

  // Create website content
  const websiteContent = [
    {
      key: 'about.heading',
      value: { text: 'We make games worth playing', highlight: 'playing' },
      section: 'about'
    },
    {
      key: 'about.description',
      value: { text: 'Brainchild started in a Montreal basement in 2019 with two devs, one manifest and a pizza oven we still regret buying. Today we are 28 people who believe games are the warmest medium ever invented — and that a world should hug you back.' },
      section: 'about'
    },
    {
      key: 'contact.email',
      value: { text: 'hello@brainchild.games' },
      section: 'contact'
    },
    {
      key: 'contact.phone',
      value: { text: '+1 (514) 555-0199' },
      section: 'contact'
    },
    {
      key: 'footer.copyright',
      value: { text: '© 2019–2026 Brainchild Games Inc.' },
      section: 'footer'
    },
    {
      key: 'footer.socialLinks',
      value: {
        links: [
          { name: 'Discord', url: '#discord', icon: 'MessageCircle' },
          { name: 'Twitter', url: '#twitter', icon: 'Twitter' },
          { name: 'YouTube', url: '#youtube', icon: 'Youtube' },
          { name: 'Twitch', url: '#twitch', icon: 'Twitch' }
        ]
      },
      section: 'footer'
    }
  ];

  for (const content of websiteContent) {
    await prisma.websiteContent.upsert({
      where: { key: content.key },
      update: { value: content.value, section: content.section },
      create: content
    });
  }
  console.log(`✅ ${websiteContent.length} website content items created`);

  // Create jobs
  const jobs = [
    {
      title: 'Lead Systems & Physics Programmer',
      department: 'Engineering',
      location: 'Montreal, Canada / Remote (Americas & EU)',
      type: 'FULL_TIME',
      experience: 'Lead',
      description: 'Lead the design and implementation of the swing, glide and wind systems that make our worlds feel alive under the player\'s hands.',
      responsibilities: [
        'Architect and optimize real-time physics and movement systems in Unreal Engine 5 (C++)',
        'Tune kinematic feel, momentum preservation and responsive control with game designers',
        'Mentor a tight-knit team of 6 systems and gameplay engineers',
        'Profile memory, cache locality and thread budgets across PC, PS5 and Xbox Series X'
      ],
      requirements: [
        '7+ years of gameplay and systems engineering with at least 1 shipped high-profile title',
        'Deep mastery of modern C++, vector math, rigid body dynamics and engine optimization',
        'Proven track record building bespoke character controllers or vehicle physics',
        'Passion for game feel, micro-feedback and tactile responsiveness'
      ],
      niceToHave: [
        'Experience with custom HLSL/GLSL compute shaders for particle simulation',
        'Familiarity with network prediction for physics-driven co-op play'
      ],
      perks: [
        'Competitive salary with a generous project profit-sharing pool',
        'Comprehensive health, dental and wellness coverage',
        'Flexible 4-day work week (Monday–Thursday, 36 hours)',
        '$4,000 annual home office & gaming hardware stipend',
        'Annual studio retreat to a cabin with questionable Wi-Fi and excellent board games'
      ],
      status: 'OPEN',
      postedDate: 'SEPTEMBER 2026'
    }
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
  console.log(`✅ ${jobs.length} jobs created`);

  // Create subscribers
  const subscribers = [
    { email: 'pilot.orion@nebula.io', name: 'Commander Orion', interests: ['Aetherbound', 'Beta Testing'], subscribedAt: new Date('2026-08-14') },
    { email: 'mira.design@celestial.dev', name: 'Mira Vance', interests: ['Devlogs', 'Studio News'], subscribedAt: new Date('2026-09-02') }
  ];

  for (const sub of subscribers) {
    await prisma.subscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: sub
    });
  }
  console.log(`✅ ${subscribers.length} subscribers created`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });