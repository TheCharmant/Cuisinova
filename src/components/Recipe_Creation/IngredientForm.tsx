import { useMemo, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Ingredient, Recipe, IngredientDocumentType } from '../../types/index';
import { call_api } from '../../utils/utils';

type ComboIngredient = { id: number; name: string };

const initialComboIngredient: ComboIngredient = { id: 0, name: '' };

const Chip = ({ ingredient, onDelete }: { ingredient: Ingredient; onDelete: (id: string) => void }) => {
    return (
        <div className="flex items-center bg-brand-500 text-white text-sm font-medium px-3 py-1.5 rounded-full m-1 transition transform hover:scale-105">
            <span>{`${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity})` : ''}`}</span>
            <button onClick={() => onDelete(ingredient.id)} className="ml-2 focus:outline-none">
                <XMarkIcon className="w-4 h-4 text-white hover:text-gray-200" />
            </button>
        </div>
    );
};

interface IngredientListProps {
    ingredientList: IngredientDocumentType[];
    ingredientUpdate: (val: string | undefined) => void;
    generatedRecipes: Recipe[];
}

function IngredientList({ ingredientList, ingredientUpdate, generatedRecipes }: IngredientListProps) {
    const [selectedIngredient, setSelectedIngredient] = useState(initialComboIngredient);
    const [query, setQuery] = useState('');

    const filteredIngredients: IngredientDocumentType[] =
        query === ''
            ? ingredientList
            : ingredientList.filter((ingredient) =>
                ingredient.name.toLowerCase().includes(query.toLowerCase())
            );

    const handleSelectedIngredient = (ingredient: ComboIngredient) => {
        setSelectedIngredient(initialComboIngredient);
        setQuery('');
        ingredientUpdate(ingredient?.name);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            setSelectedIngredient(initialComboIngredient);
            ingredientUpdate(query.trim());
            setQuery('');
        }
    };

    return (
        <div className="relative w-full">
            <Combobox
                value={selectedIngredient}
                onChange={handleSelectedIngredient}
                disabled={Boolean(generatedRecipes.length)}
            >
                <div className="relative w-full">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-9 text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-300'
                        )}
                        displayValue={(ingredient: ComboIngredient) => ingredient?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type an ingredient name"
                        value={query}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>
                </div>

                {filteredIngredients.length > 0 && (
                    <ComboboxOptions
                        className="absolute z-modal-top mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm transition-all"
                    >
                        {filteredIngredients.map((ingredient) => (
                            <ComboboxOption
                                key={ingredient._id}
                                value={ingredient}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 transition-colors ${active ? 'text-white bg-brand-600' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ focus, selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {ingredient.name}
                                        </span>
                                        {selected && (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-brand-600'
                                                    }`}
                                            >
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </Combobox>
        </div>
    );
}

interface IngredientFormProps {
    ingredientList: IngredientDocumentType[];
    ingredients: Ingredient[];
    updateIngredients: (ingredients: Ingredient[]) => void;
    generatedRecipes: Recipe[];
}

export default function IngredientForm({
    ingredientList: originalIngredientList,
    ingredients,
    updateIngredients,
    generatedRecipes,
}: IngredientFormProps) {
    const [ingredientList, setIngredientList] = useState(originalIngredientList);
    const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'pantry'>('all');
  const [pantryItems, setPantryItems] = useState<{ name: string }[]>([]);
  const [isPantryLoading, setIsPantryLoading] = useState(false);
    const progressPercent = Math.min(ingredients.length, 10) * 10;

  useEffect(() => {
    const loadPantry = async () => {
      try {
        setIsPantryLoading(true);
        const data = await call_api({ address: '/api/pantry', method: 'get' });
        setPantryItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        // Pantry is additive; failures should not block recipe creation.
        setPantryItems([]);
      } finally {
        setIsPantryLoading(false);
      }
    };
    loadPantry();
  }, []);

  const pantryNames = useMemo(
    () => new Set(pantryItems.map((i) => i.name.toLowerCase())),
    [pantryItems]
  );

  const isInIngredientList = (val: string) =>
    ingredientList.some((i) => i.name.toLowerCase() === val.toLowerCase());

  const handleChange = async (val: string | undefined) => {
        if (!val) return;
    const trimmed = val.trim();
    if (!trimmed) return;
        const isRepeat = ingredients.some(
      (i) => i.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (isRepeat) {
            setError('This ingredient is already selected.');
            return;
        }
        if(ingredients.length >= 10){
            setError('You can select up to 10 ingredients only.');
            return
        }
        setError(null);

    let finalName = trimmed;

    // If user typed a new ingredient, validate spelling/validity first.
    if (!isInIngredientList(trimmed)) {
      try {
        const validation = await call_api({
          address: '/api/validate-ingredient',
          method: 'post',
          payload: { ingredientName: trimmed },
        });

        if (validation?.message === 'Invalid') {
          const suggested = Array.isArray(validation?.suggested) ? validation.suggested : [];
          setError(
            suggested.length
              ? `Ingredient not recognized. Did you mean: ${suggested.join(', ')}?`
              : 'Ingredient not recognized. Please check spelling.'
          );
          return;
        }

        if (validation?.newIngredient?.name) {
          finalName = validation.newIngredient.name;
          // Add to local list so it appears in suggestions next time
          setIngredientList((prev) => {
            if (prev.some((i) => i.name.toLowerCase() === finalName.toLowerCase())) return prev;
            return [{ _id: validation.newIngredient._id, name: finalName } as any, ...prev];
          });
        }
      } catch {
        // If validation fails, don't block entry (keeps existing functionality).
        finalName = trimmed;
      }
    }

    updateIngredients([
      ...ingredients,
      { name: finalName, id: uuidv4() },
    ]);

    // Auto-add every used ingredient to pantry (best-effort, non-blocking)
    addToPantry(finalName);
    };

  const addToPantry = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (pantryNames.has(trimmed.toLowerCase())) return;
    try {
      const data = await call_api({ address: '/api/pantry', method: 'post', payload: { name: trimmed } });
      const newName = data?.item?.name ?? trimmed;
      setPantryItems((prev) => [{ name: newName }, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      // Ignore: pantry is optional.
    }
  };

  const removeFromPantry = async (name: string) => {
    try {
      await call_api({ address: '/api/pantry', method: 'delete', payload: { name } });
      setPantryItems((prev) => prev.filter((i) => i.name !== name));
    } catch {
      // Ignore: pantry is optional.
    }
  };

    const deleteIngredient = (id: string) => {
        if (Boolean(generatedRecipes.length)) return;
        updateIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    };

    return (
        <div
            className="w-full p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-stone-100 shadow-md rounded-xl animate-fadeInUp"
        >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-white shadow-sm border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-full transition-colors',
              tab === 'all' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            )}
            disabled={Boolean(generatedRecipes.length)}
          >
            All ingredients
          </button>
          <button
            type="button"
            onClick={() => setTab('pantry')}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-full transition-colors',
              tab === 'pantry' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            )}
            disabled={Boolean(generatedRecipes.length)}
          >
            Pantry
          </button>
        </div>

        {tab === 'pantry' && (
          <button
            type="button"
            onClick={() => addToPantry(ingredients[ingredients.length - 1]?.name ?? '')}
            className="text-sm font-medium text-brand-700 hover:text-brand-800 disabled:opacity-50"
            disabled={!ingredients.length || Boolean(generatedRecipes.length)}
            title="Adds your most recently selected ingredient to your pantry"
          >
            Add last selected to pantry
          </button>
        )}
      </div>

            <div className="w-full max-w-full overflow-x-hidden">
        {tab === 'all' ? (
          <IngredientList
            ingredientList={ingredientList}
            ingredientUpdate={(val) => handleChange(val)}
            generatedRecipes={generatedRecipes}
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-4 w-full max-w-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Your Pantry</h2>
                <p className="text-xs text-gray-500">Tap an item to add it to this recipe.</p>
              </div>
              {isPantryLoading && <span className="text-xs text-gray-500">Loading…</span>}
            </div>
            {!pantryItems.length ? (
              <p className="text-sm text-gray-600">
                Your pantry is empty. Add ingredients as you go (use &quot;Add last selected to pantry&quot;), or type an ingredient in &quot;All ingredients&quot;.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 w-full">
                {pantryItems.map((item) => {
                  const alreadySelected = ingredients.some((i) => i.name.toLowerCase() === item.name.toLowerCase());
                  return (
                    <div
                      key={item.name}
                      className={clsx(
                        'group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap',
                        alreadySelected ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50 cursor-pointer'
                      )}
                      onClick={() => {
                        if (alreadySelected || generatedRecipes.length) return;
                        handleChange(item.name);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromPantry(item.name);
                        }}
                        aria-label={`Remove ${item.name} from pantry`}
                        disabled={Boolean(generatedRecipes.length)}
                        title="Remove from pantry"
                      >
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
                <div className="mt-3 w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{ingredients.length}/10 ingredients selected</p>
                </div>
                {error && (
                    <p className="mt-2 text-red-500 text-sm">
                        {error}
                    </p>
                )}
            </div>
            {ingredients.length > 0 && (
                <div className="mt-6 w-full">
                    <h2 className="text-lg font-semibold text-brand-600 mb-3">Selected Ingredients:</h2>
                    <div className="flex flex-wrap max-h-32 overflow-y-auto">
                        {ingredients.map((ingredient: Ingredient) => (
                            <Chip
                                ingredient={ingredient}
                                key={ingredient.id}
                                onDelete={(id: string) => deleteIngredient(id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
