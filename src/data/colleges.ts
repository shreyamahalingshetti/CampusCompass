export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  rating: number;
  fees: string; // e.g. "₹2.2 Lakhs / yr"
  feesNum: number; // e.g. 220000 (for logic/sorting)
  avgPlacement: string; // e.g. "21.8 LPA"
  avgPlacementNum: number; // e.g. 2180000
  highestPlacement: string; // e.g. "1.6 CPA"
  courses: string[];
  description: string;
  image: string;
  accredited: string;
  facultyRatio: string;
}

export const mockColleges: College[] = [
  {
    id: "iitb",
    name: "Indian Institute of Technology (IIT) Bombay",
    shortName: "IIT Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.9,
    fees: "₹2.2L / yr",
    feesNum: 220000,
    avgPlacement: "21.8 LPA",
    avgPlacementNum: 2180000,
    highestPlacement: "1.6 CPA",
    courses: ["B.Tech Computer Science", "B.Tech Electrical", "M.Tech", "Dual Degree"],
    description: "Ranked #1 in India for engineering, offering state-of-the-art research labs, a vibrant campus life, and unmatched global alumni network.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    accredited: "NAAC A++",
    facultyRatio: "1:10"
  },
  {
    id: "iisc",
    name: "Indian Institute of Science (IISc)",
    shortName: "IISc Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    rating: 4.8,
    fees: "₹35K / yr",
    feesNum: 35000,
    avgPlacement: "23.0 LPA",
    avgPlacementNum: 2300000,
    highestPlacement: "86 LPA",
    courses: ["Bachelor of Science (Research)", "M.Tech", "Ph.D. Programs"],
    description: "A premier institute for scientific research and education, located in the tech hub of Bengaluru, known for its lush green campus and stellar research output.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    accredited: "NAAC A++",
    facultyRatio: "1:8"
  },
  {
    id: "bits",
    name: "Birla Institute of Technology and Science (BITS) Pilani",
    shortName: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    rating: 4.7,
    fees: "₹4.8L / yr",
    feesNum: 480000,
    avgPlacement: "15.6 LPA",
    avgPlacementNum: 1560000,
    highestPlacement: "60 LPA",
    courses: ["B.E. Computer Science", "B.E. Electronics", "M.Sc. Economics"],
    description: "Renowned private university with a 'No Attendance Policy' and dual-degree options, fostering high entrepreneurial spirit and top-tier placements.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
    accredited: "NAAC A",
    facultyRatio: "1:12"
  },
  {
    id: "iima",
    name: "Indian Institute of Management (IIM) Ahmedabad",
    shortName: "IIM Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: 4.9,
    fees: "₹12.5L / yr",
    feesNum: 1250000,
    avgPlacement: "32.7 LPA",
    avgPlacementNum: 3270000,
    highestPlacement: "1.2 CPA",
    courses: ["MBA (PGP)", "Executive MBA", "PhD in Management"],
    description: "The gold standard of management education in India, famous for its case-study pedagogy, Louis Kahn architecture, and stellar business placements.",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=600",
    accredited: "EQUIS Accredited",
    facultyRatio: "1:9"
  },
  {
    id: "stephens",
    name: "St. Stephen's College, Delhi University",
    shortName: "St. Stephen's",
    city: "New Delhi",
    state: "Delhi",
    rating: 4.6,
    fees: "₹42K / yr",
    feesNum: 42000,
    avgPlacement: "8.4 LPA",
    avgPlacementNum: 840000,
    highestPlacement: "29 LPA",
    courses: ["B.A. Economics (Hons)", "B.Sc. Physics", "B.A. English"],
    description: "One of India's oldest and most prestigious liberal arts and sciences colleges, boasting historic brick buildings and a rich tradition of leadership.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=600",
    accredited: "DU Affiliate",
    facultyRatio: "1:15"
  },
  {
    id: "nid",
    name: "National Institute of Design (NID)",
    shortName: "NID Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: 4.5,
    fees: "₹3.5L / yr",
    feesNum: 350000,
    avgPlacement: "12.0 LPA",
    avgPlacementNum: 1200000,
    highestPlacement: "36 LPA",
    courses: ["B.Des Product Design", "B.Des Graphic Design", "M.Des Animation"],
    description: "Globally acclaimed design school, under the Ministry of Commerce & Industry, focusing on innovation, user-centricity, and studio-based learning.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600",
    accredited: "Institute of National Importance",
    facultyRatio: "1:10"
  },
  {
    id: "vit",
    name: "Vellore Institute of Technology (VIT)",
    shortName: "VIT Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    rating: 4.1,
    fees: "₹1.9L / yr",
    feesNum: 190000,
    avgPlacement: "8.1 LPA",
    avgPlacementNum: 810000,
    highestPlacement: "44 LPA",
    courses: ["B.Tech CSE", "B.Tech Mech", "MCA", "B.Sc Biotechnology"],
    description: "A private university with high-tech infrastructure, a massive student community, and flexible credit system, offering rich placement opportunities.",
    image: "https://images.unsplash.com/photo-1607013407627-6ee814329547?auto=format&fit=crop&q=80&w=600",
    accredited: "NAAC A++",
    facultyRatio: "1:14"
  }
];
