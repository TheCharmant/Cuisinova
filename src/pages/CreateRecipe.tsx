import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Loading from '../components/Loading';
import IngredientForm from '../components/Recipe_Creation/IngredientForm';
import DietaryPreferences from '../components/Recipe_Creation/DietaryPreferences';
import ReviewIngredients from '../components/Recipe_Creation/ReviewIngredients';
import SelectRecipes from '../components/Recipe_Creation/SelectRecipes';
import LimitReached from '../components/Recipe_Creation/LimitReached';
import { call_api, getServerSidePropsUtility } from '../utils/utils';
import { Ingredient, DietaryPreference, RecipeCategory, Recipe, IngredientDocumentType } from '../types/index';

const steps = [
  'Choose Ingredients',
  'Choose Dietary Preferences',
  'Review & Generate Recipes',
  'Select Recipes',
];

const initialIngredients: Ingredient[] = [];
const initialCategories: RecipeCategory[] = [];
const initialPreferences: DietaryPreference[] = [];
const initialRecipes: Recipe[] = [];
const initialSelectedIds: string[] = [];

function Navigation({
  recipeCreationData,
}: {
  recipeCreationData: {
    ingredientList: IngredientDocumentType[];
    reachedLimit: boolean;
  };
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [categories, setCategories] = useState(initialCategories);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [generatedRecipes, setGeneratedRecipes] = useState(initialRecipes);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(initialSelectedIds);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingType, setLoadingType] = useState<'generation' | 'saving'>('generation')

  const router = useRouter();
  const { oldIngredients } = router.query;

  useEffect(() => {
    if (oldIngredients && Array.isArray(oldIngredients)) {
      setIngredients(
        oldIngredients.map((i) => ({ name: i, quantity: null, id: uuidv4() }))
      );
    }
  }, [oldIngredients]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setLoadingType('generation');

      const { recipes, openaiPromptId } = await call_api({
        address: '/api/generate-recipes',
        method: 'post',
        payload: {
          ingredients,
          categories,
          dietaryPreferences: preferences,
        },
      });
      let parsedRecipes = JSON.parse(recipes);
      parsedRecipes = parsedRecipes.map((recipe: Recipe, idx: number) => ({
        ...recipe,
        openaiPromptId: `${openaiPromptId}-${idx}`, // Make unique for client key iteration
      }));

      setGeneratedRecipes(parsedRecipes);
      setIsComplete(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(3); // Go to select recipes
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSave = async (recipes: Recipe[]) => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setLoadingType('saving');
      await call_api({
        address: '/api/save-recipes',
        method: 'post',
        payload: { recipes },
      });
      setIsComplete(true);

      setTimeout(() => {
        setIsLoading(false);
        setIngredients(initialIngredients);
        setCategories(initialCategories);
        setPreferences(initialPreferences);
        setGeneratedRecipes(initialRecipes);
        setSelectedRecipeIds(initialSelectedIds);
        setCurrentStep(0);
        router.push('/Profile');
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Defensive checks for undefined/null data
  if (!recipeCreationData || typeof recipeCreationData !== 'object') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (recipeCreationData.reachedLimit) {
    return (
      <LimitReached
        message="You have reached the maximum number of interactions with our AI services. Please try again later."
        actionText="Go to Home"
        fullHeight
      />
    );
  }

  const safeIngredientList = Array.isArray(recipeCreationData.ingredientList) ? recipeCreationData.ingredientList : [];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <IngredientForm
            ingredientList={safeIngredientList}
            ingredients={ingredients}
            updateIngredients={setIngredients}
            generatedRecipes={[]}
          />
        );
      case 1:
        return (
          <DietaryPreferences
            categories={categories}
            preferences={preferences}
            updateCategories={setCategories}
            updatePreferences={setPreferences}
            generatedRecipes={[]}
          />
        );
      case 2:
        return (
          <ReviewIngredients
            ingredients={ingredients}
            categories={categories}
            dietaryPreference={preferences}
            onSubmit={handleGenerate}
            onEdit={() => setCurrentStep(0)}
            generatedRecipes={[]}
          />
        );
      case 3:
        return (
          <SelectRecipes
            generatedRecipes={generatedRecipes}
            selectedRecipes={selectedRecipeIds}
            updateSelectedRecipes={setSelectedRecipeIds}
            handleRecipeSubmit={handleSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center relative overflow-hidden">
      <div className="w-full max-w-4xl space-y-6 animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <h1 className="text-3xl font-bold coquette-text text-center relative">
             Create Recipe
           </h1>
           <p className="text-coquette-lavender coquette-body mt-2">Let's whip up something magical together! 💕</p>
        </div>

        {/* Progress Bar */}
        <div className="coquette-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold coquette-text">Step {currentStep + 1} of {steps.length}</h2>
            <span className="text-sm text-coquette-lavender">{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-coquette-softPink rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-coquette-blush to-coquette-lavender h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-coquette-lavender">
            {steps.map((step, index) => (
              <span key={index} className={index <= currentStep ? 'text-coquette-rose font-medium' : ''}>
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="coquette-card p-6 pb-12 mb-16">
          {isLoading ? (
            <Loading isProgressBar isComplete={isComplete} loadingType={loadingType} />
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Navigation Buttons */}
        {!isLoading && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coquette-blush to-coquette-lavender text-white rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-delicate hover:shadow-glow"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Back
            </button>
            <div className="text-sm text-coquette-lavender font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 2 && (ingredients.length === 0 || preferences.length === 0)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coquette-blush to-coquette-lavender text-white rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-delicate hover:shadow-glow"
              >
                Next
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <div></div> // Placeholder for alignment
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getServerSidePropsUtility(context, 'api/get-ingredients', 'recipeCreationData');
};

export default Navigation;
