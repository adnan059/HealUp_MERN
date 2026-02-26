export const specialties = [
  "cardiology",
  "rheumatology",
  "neurology",
  "pediatrics",
  "endocrinology",
  "dermatology",
  "nephrology",
  "orthopedics",
  "oncology",
] as const;

export const sortingOptions = [
  { value: "fees_high", title: "Fees (High to Low)" },
  { value: "fees_low", title: "Fees (Low to High)" },
  { value: "exp_high", title: "Experience (High to Low)" },
  { value: "exp_low", title: "Experience (Low to High)" },
] as const;

export const workingDaysList = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
] as const;
