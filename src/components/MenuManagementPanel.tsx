import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { MenuItem } from '../types';
import { useStore } from '../store/useStore';
import AddMenuItemModal from './AddMenuItemModal';

export default function MenuManagementPanel() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = useStore(state => state.menuItems);
  const addMenuItem = useStore(state => state.addMenuItem);
  const deleteMenuItem = useStore(state => state.deleteMenuItem);

  const categories = ['Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'drinks', 'starters'];

  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    addMenuItem(newItem);
    setShowAddModal(false);
  };

  const handleDeleteMenuItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(id);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesMealType = selectedMealType === 'all' || item.mealType === selectedMealType;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMealType && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Menu Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Meal Types</option>
          {mealTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No menu items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-lg font-semibold text-orange-600">${item.price}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.isVegetarian && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Vegetarian
                    </span>
                  )}
                  {item.isVegan && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Vegan
                    </span>
                  )}
                  {item.isGlutenFree && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Gluten Free
                    </span>
                  )}
                  {item.spicyLevel > 1 && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      {item.spicyLevel === 2 ? 'Medium Spicy' : 'Hot'}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {item.preparationTime && `Prep: ${item.preparationTime}`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Menu Item Modal */}
      <AddMenuItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMenuItem}
      />
    </div>
  );
}