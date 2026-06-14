import { DietaryPreference } from '../types/index';

// Forbidden ingredients by dietary preference
const forbiddenIngredients: Record<DietaryPreference, RegExp[]> = {
  'Vegetarian': [
    /\b(beef|pork|chicken|meat|fish|seafood|shrimp|crab|lobster|tuna|salmon|anchovy|bacon|ham|sausage|venison|lamb|mutton|goat)\b/gi,
  ],
  'Vegan': [
    /\b(beef|pork|chicken|meat|fish|seafood|shrimp|crab|lobster|tuna|salmon|anchovy|bacon|ham|sausage|venison|lamb|mutton|goat|milk|cheese|butter|cream|yogurt|ghee|paneer|whey|casein|eggs?|honey|gelatin|egg white|egg yolk)\b/gi,
  ],
  'Dairy-Free': [
    /\b(milk|cheese|butter|cream|yogurt|ghee|paneer|whey|casein|lactose|dairy|mozzarella|cheddar|parmesan|brie|feta|ricotta|cottage cheese|mascarpone|sour cream|buttermilk|creme|crème|fromage)\b/gi,
  ],
  'Halal': [
    /\b(pork|bacon|ham|lard|shellfish|alcohol|wine|beer|vodka|whiskey|rum|gin|brandy|gelatin|non-halal)\b/gi,
  ],
  'Kosher': [
    /\b(pork|shellfish|shrimp|crab|lobster|oyster|clam|calamari|squid)\b/gi,
  ],
  'Gluten-Free': [
    /\b(wheat|barley|rye|spelt|kamut|bulgur|semolina|malt|gluten|bread|pasta|noodles|flour|couscous|farina)\b/gi,
  ],
  'Keto': [
    /\b(sugar|bread|pasta|rice|potato|potatoes|corn|oats|cereal|cookies|cake|donuts?|candy|chocolate|soda|juice|high-carb|sweetener|honey|maple|agave)\b/gi,
  ],
};

export const checkRecipeCompliance = (
  recipe: { name: string; ingredients: { name: string; quantity?: string }[] },
  dietaryPreferences: DietaryPreference[]
): { compliant: boolean; violations: string[] } => {
  const violations: string[] = [];

  for (const preference of dietaryPreferences) {
    const patterns = forbiddenIngredients[preference] || [];
    for (const ingredient of recipe.ingredients) {
      for (const pattern of patterns) {
        if (pattern.test(ingredient.name)) {
          violations.push(`${ingredient.name} violates ${preference} requirement`);
          break;
        }
      }
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
};

export const filterCompliantRecipes = (
  recipes: any[],
  dietaryPreferences: DietaryPreference[]
): any[] => {
  if (!dietaryPreferences.length) return recipes;

  return recipes.filter((recipe) => {
    const { compliant } = checkRecipeCompliance(recipe, dietaryPreferences);
    return compliant;
  });
};

export const areAllIngredientsRestrictedForPreferences = (
  ingredients: { name: string }[],
  dietaryPreferences: DietaryPreference[]
): boolean => {
  if (!ingredients.length || !dietaryPreferences.length) return false;

  return ingredients.every((ingredient) => (
    dietaryPreferences.some((preference) => (
      (forbiddenIngredients[preference] || []).some((pattern) => {
        pattern.lastIndex = 0;
        return pattern.test(ingredient.name);
      })
    ))
  ));
};
