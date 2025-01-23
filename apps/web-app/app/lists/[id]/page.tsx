"use client";
import { useParams } from "next/navigation";

import { prisma } from "@repo/database";
import { ShoppingListView } from "@/components/shopping-list/list";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ListPageProps {
  params: {
    id: string;
  };
}

export default function ListPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [recipeUrl, setRecipeUrl] = useState("");
  const [isParsingRecipe, setIsParsingRecipe] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [list, setList] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = useCallback(async () => {
    try {
      const response = await fetch(`/api/lists/${params.id}`);
      if (!response.ok) {
        throw new Error("List not found");
      }
      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error("Error fetching list:", error);
      notFound();
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const parseRecipe = async () => {
    if (!recipeUrl.trim()) return;

    setIsParsingRecipe(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/recipe/parse", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: recipeUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse recipe");
      }

      const data = await response.json();
      setIngredients(JSON.parse(data.ingredients));
    } catch (error) {
      console.error("Error parsing recipe:", error);
      setError(
        error instanceof Error ? error.message : "Failed to parse recipe"
      );
    } finally {
      setIsParsingRecipe(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  };

  const addSelectedIngredients = async () => {
    if (selectedIngredients.size === 0) return;

    try {
      const response = await fetch(`/api/lists/${params.id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: Array.from(selectedIngredients).map((ingredient) => ({
            name: ingredient,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add ingredients");
      }

      // Clear the form and refresh the list
      setRecipeUrl("");
      setIngredients([]);
      setSelectedIngredients(new Set());
      fetchList();
    } catch (error) {
      console.error("Error adding ingredients:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add ingredients"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!list) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lists
            </Button>
          </Link>
        </div>

        <ShoppingListView list={list} />

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Add Recipe Ingredients</h2>
            <div className="flex space-x-2">
              <Input
                value={recipeUrl}
                onChange={(e) => setRecipeUrl(e.target.value)}
                placeholder="Paste a recipe URL to import ingredients"
                disabled={isParsingRecipe}
              />
              <Button
                onClick={parseRecipe}
                disabled={isParsingRecipe || !recipeUrl.trim()}
              >
                {isParsingRecipe ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  "Parse"
                )}
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {ingredients.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Select ingredients to add
                  </h3>
                  <Button
                    size="sm"
                    onClick={addSelectedIngredients}
                    disabled={selectedIngredients.size === 0}
                  >
                    Add Selected
                  </Button>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ingredient-${index}`}
                        checked={selectedIngredients.has(ingredient)}
                        onCheckedChange={() => toggleIngredient(ingredient)}
                      />
                      <label
                        htmlFor={`ingredient-${index}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ingredient}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
