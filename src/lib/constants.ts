export const COURSES = [
    // Undergraduate
    "BA Economics (Hons)",
    "BA Political Science (Hons)",
    "BA English (Hons)",
    "BA History (Hons)",
    "BA Philosophy (Hons)",
    "BA Sociology (Hons)",
    "BA Hindi (Hons)",
    "BA Sanskrit (Hons)",
    "BA Prog",
    "B.Com (Hons)",
    "B.Sc (Hons) Physics",
    "B.Sc (Hons) Chemistry",
    "B.Sc (Hons) Mathematics",
    "B.Sc (Hons) Statistics",
    "B.Sc (Hons) Zoology",
    "B.Sc Physical Sciences",

    // Postgraduate
    "MA Economics",
    "MA English",
    "MA History",
    "MA Political Science",
    "MA Philosophy",
    "MA Sanskrit",
    "MA Hindi",
    "MA Mathematics",
    "M.Sc Physics",
    "M.Sc Chemistry",
    "M.Sc Mathematics",
    "M.Sc Zoology",
    "M.Sc Botany",
    "M.Com",
] as const;

export type Course = (typeof COURSES)[number];
