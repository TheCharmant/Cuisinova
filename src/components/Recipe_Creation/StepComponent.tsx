import IngredientForm from "./IngredientForm";
import DietaryPreferences from "./DietaryPreferences";
import ReviewComponent from "./ReviewIngredients";
import {
  Ingredient,
  DietaryPreference,
  RecipeCategory,
  Recipe,
  IngredientDocumentType,
} from "../../types/index";

interface StepComponentProps {
  step: number;
  ingredientList: IngredientDocumentType[];
  ingredients: Ingredient[];
  updateIngredients: (ingredients: Ingredient[]) => void;
  categories: RecipeCategory[];
  updateCategories: (categories: RecipeCategory[]) => void;
  preferences: DietaryPreference[];
  updatePreferences: (preferences: DietaryPreference[]) => void;
  editInputs: () => void;
  handleIngredientSubmit: () => void;
  generatedRecipes: Recipe[];
}

export default function StepComponent({
  step,
  ingredientList,
  ingredients,
  updateIngredients,
  categories,
  updateCategories,
  preferences,
  updatePreferences,
  editInputs,
  handleIngredientSubmit,
  generatedRecipes,
}: StepComponentProps) {
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <IngredientForm
            ingredientList={ingredientList}
            ingredients={ingredients}
            updateIngredients={updateIngredients}
            generatedRecipes={generatedRecipes}
          />
        );

      case 1:
        return (
          <DietaryPreferences
            categories={categories}
            preferences={preferences}
            updateCategories={updateCategories}
            updatePreferences={updatePreferences}
            generatedRecipes={generatedRecipes}
          />
        );

      case 2:
        return (
          <ReviewComponent
            ingredients={ingredients}
            categories={categories}
            dietaryPreference={preferences}
            onEdit={editInputs}
            onSubmit={handleIngredientSubmit}
            generatedRecipes={generatedRecipes}
          />
        );

      default:
        return (
          <div className="flex justify-center items-center py-10">
            <h1 className="text-xl font-semibold text-gray-400 bg-gradient-to-r from-brand-500/40 to-violet-500/40 bg-clip-text text-transparent">
              Coming Soon
            </h1>
          </div>
        );
    }
  };

  return (
    <div
      className="
        mt-8 
        w-full 
        rounded-2xl 
        transition-all 
        duration-300 
        bg-white/70 
        backdrop-blur-sm 
        shadow-md 
        border 
        border-violet-100 
        p-5 
        md:p-6
      "
    >
      {renderStep()}
    </div>
  );
}
