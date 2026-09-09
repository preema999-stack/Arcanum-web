/**
 * Arcanum Tech & Engineering Motivational Quotes
 * Displayed upon staff check-in to provide positive momentum and daily energy.
 */

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  role?: string;
  category: 'innovation' | 'craftsmanship' | 'perseverance' | 'focus' | 'teamwork';
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 'q1',
    quote: "The only way to do great work is to love what you do. Make today's code count.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    category: "craftsmanship",
  },
  {
    id: 'q2',
    quote: "Simplicity is prerequisite for reliability. Build clean, build bold today.",
    author: "Edsger W. Dijkstra",
    role: "Computer Scientist",
    category: "craftsmanship",
  },
  {
    id: 'q3',
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    role: "Pioneer of OOP & GUI",
    category: "innovation",
  },
  {
    id: 'q4',
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    role: "Software Architect",
    category: "focus",
  },
  {
    id: 'q5',
    quote: "It always seems impossible until it is done. Let's push the boundaries today.",
    author: "Nelson Mandela",
    role: "Leader & Visionary",
    category: "perseverance",
  },
  {
    id: 'q6',
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    role: "Creator of Extreme Programming",
    category: "craftsmanship",
  },
  {
    id: 'q7',
    quote: "Great things in business are never done by one person; they're done by a team of people.",
    author: "Steve Jobs",
    role: "Innovator",
    category: "teamwork",
  },
  {
    id: 'q8',
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    role: "Software Engineer & Author",
    category: "craftsmanship",
  },
  {
    id: 'q9',
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    author: "Robert Greene",
    role: "Author",
    category: "innovation",
  },
  {
    id: 'q10',
    quote: "Focus is a muscle. Train it every single morning.",
    author: "Cal Newport",
    role: "Computer Scientist & Author",
    category: "focus",
  },
  {
    id: 'q11',
    quote: "Quality is not an act, it is a habit. Let's deliver excellence today.",
    author: "Aristotle",
    role: "Philosopher",
    category: "craftsmanship",
  },
  {
    id: 'q12',
    quote: "Code is like humor. When you have to explain it, it’s bad. Keep it elegant.",
    author: "Cory House",
    role: "Software Architect",
    category: "craftsmanship",
  },
  {
    id: 'q13',
    quote: "Small daily improvements over time lead to stunning enterprise results.",
    author: "Robin Sharma",
    role: "Leadership Expert",
    category: "perseverance",
  },
];

/**
 * Returns a motivational quote for the day or random pick
 */
export function getDailyQuote(seed?: string): MotivationalQuote {
  if (!seed) {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[index];
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}

/**
 * Get random quote
 */
export function getRandomQuote(): MotivationalQuote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}
