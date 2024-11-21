interface MenuCardProps {
  item: {
    id: number;
    name: string;
    price: number;
    currency: string;
    category: string;
    description: string;
    image: string;
  };
  onAddToCart: () => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">
            {item.currency} {item.price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}