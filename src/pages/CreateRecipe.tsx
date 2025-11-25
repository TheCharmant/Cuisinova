import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Loading from '../components/Loading';
import StepComponent from '../components/Recipe_Creation/StepComponent';
import ReviewComponent from '../components/Recipe_Creation/ReviewIngredients';
import SelectRecipesComponent from '../components/Recipe_Creation/SelectRecipes';
import LimitReached from '../components/Recipe_Creation/LimitReached';
import { call_api, getServerSidePropsUtility } from '../utils/utils';
import { Ingredient, DietaryPreference, Recipe, IngredientDocumentType } from '../types/index';

const steps = [
  'Choose Ingredients',
  'Choose Diet',
  'Review and Create Recipes',
  'Select Recipes',
];

const initialIngredients: Ingredient[] = [];
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
  const [step, setStep] = useState(0);
  const [ingredients, setIngredients] = useState(initialIngredients);
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


  const handleIngredientSubmit = async () => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setLoadingType('generation');

      const { recipes, openaiPromptId } = await call_api({
        address: '/api/generate-recipes',
        method: 'post',
        payload: {
          ingredients,
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
        setStep(step + 1);
      }, 500); // Smooth transition after completion
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleRecipeSubmit = async (recipes: Recipe[]) => {
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
        setPreferences(initialPreferences);
        setGeneratedRecipes(initialRecipes);
        setSelectedRecipeIds(initialSelectedIds);
        setStep(0);
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
  const safeGeneratedRecipes = Array.isArray(generatedRecipes) ? generatedRecipes : [];
  const safeIngredientList = Array.isArray(recipeCreationData.ingredientList) ? recipeCreationData.ingredientList : [];
  return (
  <div className="min-h-screen p-4 md:p-8 flex justify-center relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-10 left-10 text-3xl opacity-60 animate-float">🌸</div>
    <div className="absolute top-20 right-16 text-2xl opacity-50 animate-bounceSparkle">💖</div>
    <div className="absolute bottom-20 left-20 text-2xl opacity-40 animate-float" style={{animationDelay: '1s'}}>✨</div>
    <div className="absolute bottom-10 right-10 text-3xl opacity-30 animate-gentleGlow">🎀</div>

    <div className={`w-full space-y-4 animate-fadeInUp ${safeGeneratedRecipes.length ? 'max-w-7xl' : 'max-w-2xl'}`}>
      <div className="text-center mb-6 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl opacity-70 animate-float">🎀</div>
        <h1 className="text-3xl font-bold coquette-text text-center relative">
           Create Recipe
           <span className="absolute -right-8 top-0 text-2xl animate-bounceSparkle">✨</span>
         </h1>
         {/* eslint-disable-next-line react/no-unescaped-entities */}
         <p className="text-coquette-lavender coquette-body mt-2">Let's whip up something magical together! 💕</p>
      </div>
        {safeGeneratedRecipes.length === 0 ? (
          steps.slice(0, 3).map((title, idx) => (
            <div key={title} className="coquette-card">
              <button
                className={`w-full flex items-center justify-between p-4 font-medium text-left coquette-body ${step === idx ? 'text-coquette-rose' : 'text-coquette-lavender'}`}
                onClick={() => setStep(step === idx ? -1 : idx)}
              >
                <span>{`Step ${idx + 1}: ${title}`}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 transform transition-transform ${step === idx ? 'rotate-180 text-coquette-lavender' : 'text-coquette-blush'}`}
                />
              </button>
              {step === idx && (
                <div className="p-4 border-t border-coquette-blush/30">
                  {isLoading ? (
                    <Loading isProgressBar isComplete={isComplete} loadingType={loadingType} />
                  ) : (
                    <StepComponent
                      step={idx}
                      ingredientList={safeIngredientList}
                      ingredients={ingredients}
                      updateIngredients={setIngredients}
                      preferences={preferences}
                      updatePreferences={setPreferences}
                      editInputs={() => setStep(0)}
                      handleIngredientSubmit={handleIngredientSubmit}
                      generatedRecipes={safeGeneratedRecipes}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="coquette-card">
              <div className="p-4">
                <ReviewComponent
                  ingredients={ingredients}
                  dietaryPreference={preferences}
                  onSubmit={() => {}}
                  onEdit={() => {}}
                  generatedRecipes={safeGeneratedRecipes}
                />
              </div>
            </div>
            <div className="coquette-card p-4">
              {isLoading ? (
                <Loading isProgressBar isComplete={isComplete} loadingType={loadingType} />
              ) : (
                <SelectRecipesComponent
                  generatedRecipes={safeGeneratedRecipes}
                  selectedRecipes={selectedRecipeIds}
                  updateSelectedRecipes={setSelectedRecipeIds}
                  handleRecipeSubmit={handleRecipeSubmit}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getServerSidePropsUtility(context, 'api/get-ingredients', 'recipeCreationData');
};

export default Navigation;
