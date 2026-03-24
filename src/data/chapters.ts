import chapter1Img from "@/assets/chapter-1.jpg";
import chapter2Img from "@/assets/chapter-2.jpg";
import chapter3Img from "@/assets/chapter-3.jpg";
import chapter4Img from "@/assets/chapter-4.jpg";
import chapter5Img from "@/assets/chapter-5.jpg";
import chapter6Img from "@/assets/chapter-6.jpg";

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  paragraphs: string[];
  gradient: string;
  accentHsl: string;
  image: string;
  imageAlt: string;
  imagePrompt?: string;
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "The Day Work Changed Shape",
    subtitle: "From tools we use to collaborators we direct",
    paragraphs: [
      "The first visible shift in the AI era is not that machines replace every job; it is that work becomes re-architected around judgment, direction, and synthesis.",
      "Routine drafting, tagging, summarizing, and first-pass design become faster. The human role moves upward: define the goal, shape the taste, pressure-test the output, and decide what deserves trust.",
      "That changes hiring, too. Employers will value people who can move from idea to prototype quickly, improve rough output into polished work, and keep quality high while tools accelerate the pace.",
    ],
    gradient: "from-[hsl(220,60%,15%)] via-[hsl(240,50%,25%)] to-[hsl(260,45%,20%)]",
    accentHsl: "240 50% 65%",
    image: chapter1Img,
    imageAlt: "A professional at a modern workspace directing AI-powered design screens and data visualizations",
    imagePrompt: "Modern professional workspace where humans and AI collaborate with glowing design screens and analytics",
  },
  {
    id: 2,
    title: "Personal AI, Personal Mirror",
    subtitle: "Systems that learn your patterns, tone, and blind spots",
    paragraphs: [
      "A future digital assistant will be less like a search box and more like an adaptive layer around daily life.",
      "Used well, this becomes a mirror. It reflects habits back to you: the projects you keep postponing, the tone you use when stressed, and the goals you say matter but never schedule.",
      "The healthiest version of personal AI is not one that takes over agency. It is one that strengthens it.",
    ],
    gradient: "from-[hsl(280,50%,18%)] via-[hsl(300,40%,22%)] to-[hsl(320,35%,18%)]",
    accentHsl: "290 45% 65%",
    image: chapter2Img,
    imageAlt: "A person in contemplation facing a luminous AI presence that mirrors their reflection",
    imagePrompt: "Thoughtful person interacting with an adaptive AI presence that feels reflective and personal",
  },
  {
    id: 3,
    title: "Designing for a World of Infinite Content",
    subtitle: "Why curation becomes more valuable than production alone",
    paragraphs: [
      "When everyone can generate text, images, code, and interfaces in minutes, abundance becomes the default. The new scarcity is clarity.",
      "Strong creators will stand out not by producing more, but by selecting better, editing harder, and making complex things feel simple.",
      "In that future, curation is no longer a supporting skill. It is core creative leverage.",
    ],
    gradient: "from-[hsl(170,45%,12%)] via-[hsl(190,50%,18%)] to-[hsl(210,55%,15%)]",
    accentHsl: "190 50% 60%",
    image: chapter3Img,
    imageAlt: "A curator standing amid an ocean of floating digital content, bringing order from chaos with beams of light",
    imagePrompt: "Vast ocean of floating digital content with a single curator figure bringing order and clarity",
  },
  {
    id: 4,
    title: "Trust, Truth, and Verification",
    subtitle: "The human task that becomes more important as output improves",
    paragraphs: [
      "As generated output becomes smoother and more convincing, surface quality stops being evidence of truth.",
      "People will need to check sources, test claims, compare versions, and understand the difference between plausibility and proof.",
      "The most trusted people in the AI era may be those who can move fast without becoming careless.",
    ],
    gradient: "from-[hsl(20,50%,15%)] via-[hsl(35,55%,20%)] to-[hsl(15,45%,12%)]",
    accentHsl: "30 55% 60%",
    image: chapter4Img,
    imageAlt: "Layered transparent screens showing source comparison and validation in warm amber tones",
    imagePrompt: "Sophisticated scene of analyzing layers of information with source comparison and validation",
  },
  {
    id: 5,
    title: "The Human Advantage That Remains",
    subtitle: "Meaning, values, and the ability to care",
    paragraphs: [
      "AI can simulate style, pattern, and fluency. But people still bring something harder to automate: lived context, moral weight, and genuine care.",
      "A teacher knows when a student is hiding fear behind silence. A designer senses when an interface is technically correct but emotionally cold.",
      "The future will reward technical adaptation, but it will also reward deeply human qualities.",
    ],
    gradient: "from-[hsl(140,40%,12%)] via-[hsl(160,45%,18%)] to-[hsl(130,35%,14%)]",
    accentHsl: "150 40% 55%",
    image: chapter5Img,
    imageAlt: "A teacher and student in warm conversation, conveying empathy and human connection",
    imagePrompt: "Warm human-centered scene showing empathy, care, and emotional intelligence between teacher and student",
  },
  {
    id: 6,
    title: "Co-Creation Instead of Competition",
    subtitle: "A practical way to think about the next decade",
    paragraphs: [
      "The most useful mental model may be partnership, not rivalry.",
      'The question shifts from "Will AI replace me?" to "What becomes possible when I combine my taste, judgment, and goals with systems that can generate, analyze, and iterate at speed?"',
      "The smartest use of technology is not to erase the human role, but to amplify it.",
    ],
    gradient: "from-[hsl(40,50%,15%)] via-[hsl(50,55%,22%)] to-[hsl(30,45%,14%)]",
    accentHsl: "45 55% 60%",
    image: chapter6Img,
    imageAlt: "Humans and AI creating together, with hands working alongside luminous interfaces in golden light",
    imagePrompt: "Future-facing optimistic scene of humans and AI creating together in partnership",
  },
];
