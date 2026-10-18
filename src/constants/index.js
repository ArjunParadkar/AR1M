
import {
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
} from "../utils";

export const navLists = ["Home", "Founders", "Contact"];

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#tech", label: "Tech" },
  { href: "#physical", label: "Physical" },
  { href: "#contact", label: "Contact" },
  { href: "/labs", label: "Labs" },
  
];

export const whyArendaReasons = [
  {
    title: "Innovation First",
    image: "/assets/images/placeholder1.jpg",
    bullets: [
      "Cutting-edge research projects",
      "Breakthrough technologies",
      "Future-focused solutions"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "rotate-3"
  },
  {
    title: "Student Driven",
    image: "/assets/images/placeholder2.jpg",
    bullets: [
      "Youth-led initiatives",
      "Student research teams",
      "Peer-to-peer learning"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "-rotate-2"
  },
  {
    title: "Community Impact",
    image: "/assets/images/placeholder3.jpg",
    bullets: [
      "Local problem solving",
      "Community partnerships",
      "Real-world applications"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "rotate-1"
  },
  {
    title: "Excellence Focus",
    image: "/assets/images/placeholder4.jpg",
    bullets: [
      "High standards",
      "Quality assurance",
      "Continuous improvement"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "-rotate-1"
  },
  {
    title: "Global Vision",
    image: "/assets/images/placeholder5.jpg",
    bullets: [
      "International reach",
      "Cross-cultural collaboration",
      "Worldwide impact"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "rotate-2"
  },
  {
    title: "Future Ready",
    image: "/assets/images/placeholder6.jpg",
    bullets: [
      "Next-gen skills",
      "Emerging technologies",
      "Adaptive learning"
    ],
    color: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    rotation: "-rotate-3"
  }
];

export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "BlurOS",
      "The Future of Operating Systems",
      "Kernel level AI control",
    ],
    video: highlightFirstVideo,
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["BrAIn AI", "Do it all", "With a single word"],
    video: highlightSecondVideo,
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Allz Well",
      "Know Your Brain",
      "Know it First",
    ],
    video: highlightThirdVideo,
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["HomeFax", "Its your home", "Its your right"],
    video: highlightFourthVideo,
    videoDuration: 3.63,
  },
];

export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];

export const researchPageContent = ['Arenda Research', 'At Arenda, we believe in pushing the boundaries of science and technology. Our students work on novel, high-impact STEM projects that shape the future.', 'From AI to advanced hardware, our mission is to guide students into becoming world-class innovators and builders—starting with first principles and aiming for mastery.'];

export const projects = [
  {
    id: 1,
    title: "BlurOS",
    description: "A new operating system that is designed to be a more efficient and implement AI from its core",
    imageURL: "https://picsum.photos/400/300?random=1",
    author: "Arjun Paradkar, Nischal Keshav, Arham Shah",
    includesAI: true,
    includesEngineering: false,
    includesSI: false
  },
  {
    id: 2,
    title: "BrAIn",
    description: "A novel AI architecture that is more efficient and cheaper than the current state of the art",
    imageURL: "https://picsum.photos/400/300?random=2",
    author: "Arjun Paradkar",
    includesAI: true,
    includesEngineering: true,
    includesSI: false
  },
  {
    id: 3,
    title: "Allergy App",
    description: "A mobile app that utilizes AI to detect allergies through images and provide personalized recommendations for food and other products",
    imageURL: "https://picsum.photos/400/300?random=4",
    author: "Arjun Paradkar, Satya Achanti, Nischal Keshav, Naman S. Guggilam",
    includesAI: true,
    includesEngineering: false,
    includesSI: true
  },
  {
    id: 4,
    title: "AI-Powered RC Plane",
    description: "An RC plane that is powered by AI to fly autonomously and avoid obstacles",
    imageURL: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z046a387b608e935e9c8c0319_f10395aee86af1630_d20250811_m201006_c005_v0501035_t0017_u01754943006488",
    author: "Arjun Paradkar",
    includesAI: true,
    includesEngineering: true,
    includesSI: false
  },
  {
    id: 5,
    title: "AI-Driven exploration for Alzheimer’s Biomarkers",
    description: "Using new unused AI Architectures to find new RNA biomarkers through data analysis",
    imageURL: "https://picsum.photos/400/300?random=5",
    author: "Naman S. Guggilam",
    includesAI: true,
    includesEngineering: false,
    includesSI: true
  },
  {
    id: 6,
    title: "AI-Integrated Void One Glasses",
    description: "Void One Glasses with D. One OS turn any display into an AI-controlled, voice-driven workspace. It’s the “Android for AI wearables” — sleek, adaptive, and always learning",
    imageURL: "https://picsum.photos/400/300?random=6",
    author: "Arham Shah",
    includesAI: true,
    includesEngineering: true,
    includesSI: true
  },
  {
    id: 7,
    title: "Enhanced Detection of Rare and Misdiagnosed Cancers in Histopathology Images",
    description: "This project aims to develop a convolutional neural network (CNN)-based classification system specialized in identifying rare and frequently misdiagnosed cancers from digitized histopathology slides." ,
    imageURL: "https://picsum.photos/400/300?random=7",
    author: "Naman S. Guggilam",
    includesAI: true,
    includesEngineering: false,
    includesSI: true
  },
  {
    id: 8,
    title: "AlzRate: Multimodal AI for Predicting Individual Alzheimer’s Progression Rate",
    description: "AlzRate uses integrated blood ncRNA expression, baseline neuroimaging features (e.g., hippocampal volume), genetic deposition, and clinical data to predict an individual’s future rate of cognitive decline and time-to-AD conversion",
    imageURL: "https://picsum.photos/400/300?random=8",
    author: "Naman S. Guggilam",
    includesAI: true,
    includesEngineering: true,
    includesSI: true
  },
  {
    id: 9,
    title: " Optimizing Topical Drug Delivery in Eczema Treatment",
    description: "Optimizing drug formulations for better skin penetration or targeted delivery, reducing systemic exposure. Using adjuvants or enhancers that increase drug absorption locally.",
    imageURL: "https://picsum.photos/400/300?random=9",
    author: "Naman S. Guggilam",
    includesAI: true,
    includesEngineering: true,
    includesSI: true
  },
  {
    id: 10,
    title: "NeuroSnap",
    description: "AI-Based Emotion Recognition from EEG Snapshots for Mental Health Insights",
    imageURL: "https://picsum.photos/400/300?random=10",
    author: "Arya Devanath",
    includesAI: true,
    includesEngineering: false,
    includesSI: true
  },
  {
    id: 11,
    title: "GenieTrack",
    description: "A revolutionary educational platform that uniquely utilizes AI and various teaching methods to effectively help students improve in various fields",
    imageURL: "https://picsum.photos/400/300?random=11",
    author: "Reva Paradkar",
    includesAI: true,
    includesEngineering: true,
    includesSI: true
  },
  {
    id: 12,
    title: "AI-Enhanced Insulin Dosing for Pregnant Women with Type-2 Diabetes",
    description: "This project explores how individualized, AI-driven insulin dosing can optimize blood sugar control and reduce hypoglycemia risk in pregnant patients with Type-2 diabetes, compared to standard treatment methods. The goal is to design or propose a system that adapts to each patient’s unique hormonal and metabolic changes during pregnancy",
    imageURL: "https://picsum.photos/400/300?random=12",
    author: "Sifa Siraj",
    includesAI: true,
    includesEngineering: false,
    includesSI: false
 },
  
 ];













export const founders = [
  {
    id: 1,
    name: "Arjun Paradkar",
    title: "Founder",
    description:"Arjun founded Arenda Innovations with one goal: To \"Build the Future\". He firmly believes that there is no time, no age, and no place that limits that pursuit. He is a dual enrolled student at the University of Arkansas and specializes in Math, Physics, and AI research. He frontiers Arenda's quest to create the system that defines how humans interact with tech for decades to come.",
    imageUrl: "/assets/images/ArjunP1.jpg",
    orientation: "right"
  },
   
  
  {
    id: 3,
    name: "Nischal Keshav",
    title: "Head of Arenda Labs",
    description: "Nischal Keshav is the Technical Lead at Arenda Innovations and built this website. He is a Junior at Bentonville High School and is interested in pursuing a career in Computer Science. He is also a Founder of the ISEF club at Bentonville High School.",
    imageUrl: "/assets/images/Nischal1.jpg",
    orientation: "left"
  },
 {
    id: 4,
    name: "Naman S. Guggilam",
    title: "Head of Arenda Vision",
    description: "Naman Guggilam is a BHS student passionate about Theoretical Physics. He is very ambitious and is intensely driven by curiosity. He thrives on self-study, exploring any subject (mainly physics) that fuels his ambition.  Naman believes that reaching great goals requires intense hard work, discipline, and determination, and he values knowledge as the key to transformation.",
    imageUrl: "/assets/images/Naman1.png",
    orientation: "right"
  },
  {
    id: 5,
    name: "Arham Shah",
    title: "Lead of Arenda Risk Taking",
    description: "",
    imageUrl: "",
    orientation: "left"
  },
 
];

export const upcomingEvents = [
  {
    id: 1,
    title: "Coming Soon",
    date: "Coming Soon",
    time: "Coming Soon",
    location: "Coming Soon",
    description: "Coming Soon",
    type: "Coming Soon",
    featured: false
  },
  {
    id: 2,
    title: "Coming Soon",
    date: "Coming Soon",
    time: "Coming Soon",
    location: "Coming Soon",
    description: "Coming Soon",
    type: "Coming Soon",
    featured: false
  },
  {
    id: 3,
    title: "Coming Soon",
    date: "Coming Soon",
    time: "Coming Soon",
    location: "Coming Soon",
    description: "Coming Soon",
    type: "Coming Soon",
    featured: false
  },
  {
    id: 4,
    title: "Coming Soon",
    date: "Coming Soon",
    time: "Coming Soon",
    location: "Coming Soon",
    description: "Coming Soon",
    type: "Coming Soon",
    featured: false
  }
];
