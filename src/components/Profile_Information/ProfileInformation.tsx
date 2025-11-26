import { useSession } from "next-auth/react";
import Image from "next/image";
import { ExtendedRecipe } from "../../types";
import { Button } from "@headlessui/react";
import { motion } from "framer-motion";

interface ProfileInformationProps {
    recipes: ExtendedRecipe[];
    updateSelection: (s: string) => void;
    selectedDisplay: string;
    AIusage: number;
    totalGeneratedCount?: number;
    apiRequestLimit?: number;
}

export default function ProfileInformation({
  recipes,
  updateSelection,
  selectedDisplay,
  AIusage,
  totalGeneratedCount = 0,
  apiRequestLimit = 10,
}: ProfileInformationProps) {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const { user } = session;

  const ownedRecipes = recipes.filter((r) => r.owns);
  const favoriteRecipes = recipes.filter((r) => r.liked);
  const votesReceived = ownedRecipes.reduce(
    (total, recipe) => total + recipe.likedBy.length,
    0
  );

  const getUsageColor = (usage: number) => {
    if (usage <= 50)
      return "bg-gradient-to-r from-brand-500 to-violet-500";
    if (usage <= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-sm bg-white border border-violet-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-5"
    >
      <div className="flex flex-col items-center pb-8 pt-7 px-5 w-full">

        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.06 }}>
          <Image
            src={
              user?.image ??
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            width={90}
            height={90}
            className="w-24 h-24 mb-4 rounded-full shadow-xl border-2 border-violet-300 object-cover"
            alt={`profile-${user.name}`}
          />
        </motion.div>

        {/* Name + Email */}
        <h5 className="mb-1 text-xl font-semibold bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent text-center">
          {user.name}
        </h5>

        <span className="text-sm text-gray-500 text-center">{user.email}</span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mt-6 w-full">
          {[
            {
              label: "Recipes Created",
              value: ownedRecipes.length,
              key: "created",
            },
            {
              label: "Votes Received",
              value: votesReceived,
              key: "votes received",
            },
            {
              label: "Favorites",
              value: favoriteRecipes.length,
              key: "favorites",
            },
          ].map((item) => (
            <div key={item.key} className="flex flex-col items-center gap-1">
              <div className="text-lg font-semibold text-black">
                {item.value}
              </div>

              <Button
                onClick={() => updateSelection(item.key)}
                className={`rounded-full px-2.5 py-1 text-xs transition-all duration-300 border shadow-sm ${
                  selectedDisplay === item.key
                    ? "bg-gradient-to-r from-brand-500 to-violet-500 text-white font-semibold shadow-md border-transparent"
                    : "bg-white text-gray-700 border-violet-200 hover:border-violet-400 hover:text-violet-700"
                }`}
              >
                {item.label}
              </Button>
            </div>
          ))}
        </div>

        {/* AI Usage */}
        <div className="w-full mt-7">
          <div className="text-sm text-violet-600 font-medium text-center mb-1">
            AI Generations: {totalGeneratedCount}/{apiRequestLimit}
          </div>
          <div className="text-xs text-gray-500 text-center mb-2">
            {Math.max(0, apiRequestLimit - totalGeneratedCount)} generations left
          </div>

          <div className="w-full bg-violet-100 rounded-full h-3 shadow-inner overflow-hidden">
            <motion.div
              className={`${getUsageColor((totalGeneratedCount / apiRequestLimit) * 100)} h-3 rounded-full shadow-md`}
              initial={{ width: 0 }}
              animate={{ width: `${(totalGeneratedCount / apiRequestLimit) * 100}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
