import { Ingredient, DietaryPreference, RecipeCategory, Recipe, ExtendedRecipe } from '../types/index'

export const getRecipeGenerationPrompt = (ingredients: Ingredient[], categories: RecipeCategory[], dietaryPreferences: DietaryPreference[]) => {
    // Format ingredients as "name (quantity)" or just "name"
    const ingredientList = ingredients.map(ing => 
        ing.quantity ? `${ing.name} (${ing.quantity})` : ing.name
    ).join(', ');

    const categoryInstruction = categories.length 
        ? `\n\nIMPORTANT: You MUST ONLY generate recipes that belong to the following category/categories: ${categories.join(', ')}. Every recipe must strictly fit the specified category. Do NOT generate recipes from other categories.`
        : '';

    const dietaryInstruction = dietaryPreferences.length
        ? `\n\nDietary Requirements: These recipes MUST adhere to ${dietaryPreferences.join(', ')}. Do not include ingredients that violate these restrictions.`
        : '';

    return `
I have exactly these ingredients: ${ingredientList}.${categoryInstruction}${dietaryInstruction}

Create exactly 3 different recipes using ONLY the ingredients listed above and fitting ONLY the specified category/dietary requirements. The response must be valid JSON only:

[
    {
        "name": "Recipe Name",
        "ingredients": [
            {"name": "Ingredient Name", "quantity": "quantity and unit"},
            {"name": "Another Ingredient", "quantity": "quantity and unit"}
        ],
        "instructions": [
            "Step one.",
            "Step two."
        ],
        "dietaryPreference": ${JSON.stringify(dietaryPreferences)},
        "categories": ${JSON.stringify(categories)},
        "additionalInformation": {
            "tips": "Brief practical tips",
            "variations": "Possible variations using the same ingredients",
            "servingSuggestions": "How to serve",
            "nutritionalInformation": "Nutritional details"
        }
    }
]

STRICT RULES:
- Use ONLY the ingredients provided. No extra ingredients allowed.
- Every recipe MUST belong to the category/categories: ${JSON.stringify(categories)}.
- If dietary preferences are specified, ALL recipes must strictly comply.
- The "categories" field in the JSON must exactly match the specified categories.
- Quantities must include units (grams, cups, tsp, etc.).
- Return exactly 3 recipes in a valid JSON array.
- No markdown, no code blocks, no extra text - JSON only.
`;
};

export const getImageGenerationPrompt = (recipeName: string, ingredients: Recipe['ingredients']): string => {
    const allIngredients = ingredients.map(ingredient => `${ingredient.name} (${ingredient.quantity})`).join(', ');
    const prompt = `
        Create a high-resolution, photorealistic image of a delicious ${recipeName} made of these ingredients: ${allIngredients}. 
        The image should be visually appealing, showcasing the dish in an appetizing manner. 
        It should be plated attractively on a clean white plate with natural lighting, highlighting key ingredients for visual appeal.
    `;
    return prompt.trim();
};

export const getIngredientValidationPrompt = (ingredientName: string): string => {
    const prompt = `Act as a Food Ingredient Validation Assistant. Given the ingredient name: ${ingredientName}, your task is to evaluate the ingredient and return a JSON object with exactly two keys:

{ "isValid": true/false, "possibleVariations": ["variation1", "variation2", "variation3"] }

Rules:

The isValid field must be true if the ingredient is commonly used in recipes, and false otherwise.
The possibleVariations field must contain an array of 2 to 3 valid variations, alternative names, or related ingredients for the given ingredient.
If the ingredient appears to be a misspelling, include the corrected name(s) in this array.
If there are no recognized variations or corrections, return an empty array for possibleVariations.
The output must be strictly valid JSON without any additional text, markdown formatting, or code blocks.
Examples: 
Input: "cheese" Expected Output: { "isValid": true, "possibleVariations": ["cheddar", "mozzarella", "parmesan"] }

Input: "breakfast" Expected Output: { "isValid": false, "possibleVariations": [] }

Input: "cuscus" Expected Output: { "isValid": false, "possibleVariations": ["couscous"] }`;
    return prompt;
}

export const getRecipeNarrationPrompt = (recipe: ExtendedRecipe) => {
    if (!recipe || !recipe.name || !recipe.ingredients || !recipe.instructions) {
        return "Invalid recipe data. Please provide a valid recipe.";
    }

    const { name, ingredients, instructions, additionalInformation } = recipe;

    return `Convert the following recipe into a **clear, well-paced, and engaging spoken narration**.  
- The tone should be **natural, informative, and confident**, like a professional chef explaining a recipe in a calm and collected manner.  
- Keep it **concise and instructional**, focusing on delivering the steps in an **efficient and natural way** without excessive enthusiasm.  
- Transitions should be **smooth but to the point**—avoid over-explaining or dramatizing the process.  

---

### Recipe: **${name}**

#### Ingredients:
${ingredients.map(ing => `- **${ing.quantity}** of **${ing.name}**`).join("\n")}

#### Instructions:
${instructions.map((step, index) => `${index + 1}. ${step}`).join("\n")}

${additionalInformation?.tips ? `#### Tips:\n${additionalInformation.tips}\n` : ""}
${additionalInformation?.variations ? `#### Variations:\n${additionalInformation.variations}\n` : ""}
${additionalInformation?.servingSuggestions ? `#### Serving Suggestions:\n${additionalInformation.servingSuggestions}\n` : ""}
${additionalInformation?.nutritionalInformation ? `#### Nutritional Info:\n${additionalInformation.nutritionalInformation}\n` : ""}

---

**Narration Guidelines:**  
- Deliver the narration in a **calm and professional manner**, without excessive excitement.  
- Read ingredients **clearly and efficiently**—avoid unnecessary emphasis or dramatization.  
- Guide the user **step-by-step with smooth but direct transitions**, keeping it **practical and instructional**.  
- End with a **brief, professional wrap-up**, reinforcing the dish’s appeal in a **neutral and informative way**.  
- **Keep it around 60-90 seconds**—engaging but not rushed.  

Ensure the narration **sounds knowledgeable and practical**, maintaining a **professional and refined delivery.**`;
};

export const getRecipeTaggingPrompt = (recipe: ExtendedRecipe) => {
    const { name, ingredients, dietaryPreference, additionalInformation } = recipe;

    // Extract ingredient names
    const ingredientNames = ingredients.map(ingredient => ingredient.name).join(', ');

    // Extract additional information
    const { tips, variations, servingSuggestions, nutritionalInformation } = additionalInformation;

    // Construct the prompt
    const prompt = `Please generate **10 unique, single-word tags** for the following recipe in a **pure JSON array format**.

**Rules for the response:**
1. The response **must be a valid JSON array** and **must NOT be wrapped in markdown, backticks, or any other formatting**.
2. The array should contain **10 unique, single-word tags** that:
   - **Accurately describe the recipe** based on its name, ingredients, dietary preferences, and additional information.
   - **Are commonly searched terms** for similar recipes.
   - **Include keywords** related to the recipe type, cuisine, or dietary category.
   - **Are concise**, avoiding technical or uncommon terms.

### **Example Valid Response:**
\`["vegetarian", "dessert", "corn", "pudding", "Indian", "sweet", "almond", "cardamom", "saffron", "coconut"]\`

### **Recipe Details:**
- **Recipe Name**: ${name}
- **Main Ingredients**: ${ingredientNames}
- **Dietary Preferences**: ${dietaryPreference.join(', ')}
- **Additional Information**:
  - **Tips**: ${tips}
  - **Variations**: ${variations}
  - **Serving Suggestions**: ${servingSuggestions}
  - **Nutritional Information**: ${nutritionalInformation}`;

    return prompt;
};

export const getChatAssistantSystemPrompt = (recipe: ExtendedRecipe) => {
    const { name, ingredients, instructions, additionalInformation, dietaryPreference } = recipe;
    const systemPrompt = `
You are a helpful recipe assistant. You only respond to questions that are directly related to the following recipe:

Name: ${name}
Ingredients: ${ingredients.map(i => `${i.quantity} ${i.name}`).join(', ')}
Dietary Preferences: ${dietaryPreference.map(p => `${p}`).join(', ')}
Instructions: ${instructions}
Tips: ${additionalInformation.tips}
Variations: ${additionalInformation.variations}
Serving Suggestions: ${additionalInformation.servingSuggestions}
Nutritional Info: ${additionalInformation.nutritionalInformation}

You may provide useful suggestions about ingredient substitutions, dietary modifications, cooking techniques, tools, or serving advice — as long as they apply specifically to this recipe.

If the user asks about anything not related to this recipe — including general cooking topics, science, history, entertainment, or other off-topic subjects — politely decline and guide them back to questions about the recipe: ${name}.
    `.trim();

    return systemPrompt;
}
