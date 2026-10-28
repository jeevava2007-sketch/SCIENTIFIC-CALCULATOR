export type FormulaCategory =
  | "Algebra"
  | "Geometry"
  | "Trigonometry"
  | "Calculus"
  | "Statistics"
  | "Physics"
  | "Engineering";

export type FormulaVariable = {
  symbol: string;
  label: string;
};

export type LibraryFormula = {
  id: string;
  category: FormulaCategory;
  name: string;
  latex: string;
  about: string;
  expression?: string;
  variables: FormulaVariable[];
  note?: string;
};

export const FORMULA_CATEGORIES: FormulaCategory[] = [
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Calculus",
  "Statistics",
  "Physics",
  "Engineering",
];

export const LIBRARY: LibraryFormula[] = [
  {
    id: "quadratic",
    category: "Algebra",
    name: "Quadratic formula",
    latex: "x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    about: "Roots of ax² + bx + c = 0. Use the solver for evaluated roots and the discriminant.",
    variables: [],
    note: "Shown as a reference. The equation solver computes the roots and verifies them.",
  },
  {
    id: "slope",
    category: "Algebra",
    name: "Slope",
    latex: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}",
    about: "Slope between two points.",
    expression: "(y2-y1)/(x2-x1)",
    variables: [
      { symbol: "y2", label: "y₂" },
      { symbol: "y1", label: "y₁" },
      { symbol: "x2", label: "x₂" },
      { symbol: "x1", label: "x₁" },
    ],
  },
  {
    id: "circle-area",
    category: "Geometry",
    name: "Circle area",
    latex: "A = \\pi r^2",
    about: "Area of a circle from its radius.",
    expression: "pi*r^2",
    variables: [{ symbol: "r", label: "radius" }],
  },
  {
    id: "sphere-volume",
    category: "Geometry",
    name: "Sphere volume",
    latex: "V = \\dfrac{4}{3}\\pi r^3",
    about: "Volume of a sphere.",
    expression: "(4/3)*pi*r^3",
    variables: [{ symbol: "r", label: "radius" }],
  },
  {
    id: "pythagoras",
    category: "Geometry",
    name: "Pythagorean theorem",
    latex: "c = \\sqrt{a^2 + b^2}",
    about: "Hypotenuse of a right triangle.",
    expression: "sqrt(a^2+b^2)",
    variables: [
      { symbol: "a", label: "leg a" },
      { symbol: "b", label: "leg b" },
    ],
  },
  {
    id: "heron",
    category: "Geometry",
    name: "Heron's formula",
    latex: "A = \\sqrt{s(s-a)(s-b)(s-c)},\\ s=\\dfrac{a+b+c}{2}",
    about: "Triangle area from three side lengths.",
    expression: "sqrt(((a+b+c)/2)*(((a+b+c)/2)-a)*(((a+b+c)/2)-b)*(((a+b+c)/2)-c))",
    variables: [
      { symbol: "a", label: "side a" },
      { symbol: "b", label: "side b" },
      { symbol: "c", label: "side c" },
    ],
  },
  {
    id: "law-cos",
    category: "Trigonometry",
    name: "Law of cosines",
    latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
    about: "Third side from two sides and the included angle. Angle mode follows the calculator setting.",
    expression: "sqrt(a^2+b^2-2*a*b*cos(C))",
    variables: [
      { symbol: "a", label: "side a" },
      { symbol: "b", label: "side b" },
      { symbol: "C", label: "included angle" },
    ],
  },
  {
    id: "identity-sin",
    category: "Trigonometry",
    name: "Pythagorean identity",
    latex: "\\sin^2\\theta + \\cos^2\\theta = 1",
    about: "Reference identity. It is not a substitution formula.",
    variables: [],
  },
  {
    id: "deriv-power",
    category: "Calculus",
    name: "Power rule",
    latex: "\\dfrac{d}{dx} x^n = n x^{n-1}",
    about: "Reference rule. Use the calculus workspace for a numerical derivative of a specific function.",
    variables: [],
    note: "NEXUS does not produce symbolic derivatives.",
  },
  {
    id: "fund-theorem",
    category: "Calculus",
    name: "Fundamental theorem (reference)",
    latex: "\\int_a^b f'(x)\\,dx = f(b) - f(a)",
    about: "Reference statement. Numerical integrals in the calculus workspace are approximations.",
    variables: [],
  },
  {
    id: "mean",
    category: "Statistics",
    name: "Arithmetic mean",
    latex: "\\bar{x} = \\dfrac{1}{n}\\sum x_i",
    about: "Use the statistics workspace for a full data set. This form is for a short explicit sum.",
    expression: "(x1+x2+x3)/3",
    variables: [
      { symbol: "x1", label: "x₁" },
      { symbol: "x2", label: "x₂" },
      { symbol: "x3", label: "x₃" },
    ],
    note: "Fixed at three values. Longer lists belong in Statistics.",
  },
  {
    id: "zscore",
    category: "Statistics",
    name: "z-score",
    latex: "z = \\dfrac{x - \\mu}{\\sigma}",
    about: "Standard score. Sigma is a population or sample standard deviation you supply.",
    expression: "(x-mu)/sigma",
    variables: [
      { symbol: "x", label: "value" },
      { symbol: "mu", label: "mean" },
      { symbol: "sigma", label: "standard deviation" },
    ],
  },
  {
    id: "newton2",
    category: "Physics",
    name: "Newton's second law",
    latex: "F = ma",
    about: "Net force from mass and acceleration.",
    expression: "m*a",
    variables: [
      { symbol: "m", label: "mass" },
      { symbol: "a", label: "acceleration" },
    ],
  },
  {
    id: "kinematic",
    category: "Physics",
    name: "Kinematic energy relation",
    latex: "v^2 = u^2 + 2as",
    about: "Final speed magnitude from initial speed, acceleration, and displacement, when the expression under the root is non-negative.",
    expression: "sqrt(u^2+2*a*s)",
    variables: [
      { symbol: "u", label: "initial speed" },
      { symbol: "a", label: "acceleration" },
      { symbol: "s", label: "displacement" },
    ],
  },
  {
    id: "coulomb",
    category: "Physics",
    name: "Coulomb's law (magnitude)",
    latex: "F = k\\dfrac{|q_1 q_2|}{r^2}",
    about: "Force magnitude. k is 8.9875517923×10⁹ in SI when charges are in coulombs and r in metres.",
    expression: "k*abs(q1*q2)/r^2",
    variables: [
      { symbol: "k", label: "Coulomb constant" },
      { symbol: "q1", label: "charge 1" },
      { symbol: "q2", label: "charge 2" },
      { symbol: "r", label: "distance" },
    ],
  },
  {
    id: "ohms",
    category: "Engineering",
    name: "Ohm's law",
    latex: "V = IR",
    about: "Voltage from current and resistance.",
    expression: "I*R",
    variables: [
      { symbol: "I", label: "current" },
      { symbol: "R", label: "resistance" },
    ],
  },
  {
    id: "power",
    category: "Engineering",
    name: "Electrical power",
    latex: "P = IV",
    about: "Power from current and voltage.",
    expression: "I*V",
    variables: [
      { symbol: "I", label: "current" },
      { symbol: "V", label: "voltage" },
    ],
  },
  {
    id: "stress",
    category: "Engineering",
    name: "Axial stress",
    latex: "\\sigma = \\dfrac{F}{A}",
    about: "Average normal stress.",
    expression: "F/A",
    variables: [
      { symbol: "F", label: "force" },
      { symbol: "A", label: "area" },
    ],
  },
];
