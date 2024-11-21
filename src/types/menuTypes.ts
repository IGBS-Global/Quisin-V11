export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'starters';
  image: string;
  ingredients: string[];
  allergens: string[];
  condiments: string[];
  available: boolean;
  preparationTime?: string;
  calories?: number;
  spicyLevel: 1 | 2 | 3;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}