export interface CategoryDefinition {
  name: string;
  description: string;
}

/**
 * Central catalog of categories we want to surface across the site.
 * Even if a category currently has zero posts, we still list it to
 * help readers understand the scope of topics we cover.
 */
export const CATEGORY_CATALOG: CategoryDefinition[] = [
  {
    name: "Energy",
    description: "Evidence-based strategies for sustaining steady energy throughout the day.",
  },
  {
    name: "Gut Health",
    description: "Digestive system support, microbiome education, and probiotic-forward tips.",
  },
  {
    name: "Meal Planning",
    description: "Weekly prep methods, grocery tactics, and time-saving kitchen systems.",
  },
  {
    name: "Weight Loss",
    description: "Metabolism-friendly habits and realistic nutrition guidance for weight goals.",
  },
  {
    name: "Heart Health",
    description: "Cardiovascular-friendly recipes and nutrient tips for a stronger heart.",
  },
  {
    name: "Mental Wellness",
    description: "Nutrition, habits, and routines that nurture mood and cognitive balance.",
  },
];
