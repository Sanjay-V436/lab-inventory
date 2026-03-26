import { Trash2 } from 'lucide-react';

const Cart = ({ cart, flatList, onRemove, onQuantityChange }) => {
  if (cart.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No components added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cart.map((item) => {
        const component = flatList.find((c) => c.id === item.component_id);
        return (
          <div
            key={item.component_id}
            className="flex items-center justify-between
                       bg-gray-50 rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#9B1B4B' }}
              />
              <span className="text-sm text-gray-700 font-medium">
                {component?.name || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? onQuantityChange(item.component_id, item.quantity - 1)
                      : onRemove(item.component_id)
                  }
                  className="w-6 h-6 rounded-full bg-white border border-gray-200
                             flex items-center justify-center text-gray-500
                             hover:border-gray-400 transition-colors text-sm"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    onQuantityChange(item.component_id, item.quantity + 1)
                  }
                  disabled={item.quantity >= (component?.stock || 0)}
                  className="w-6 h-6 rounded-full bg-white border border-gray-200
                             flex items-center justify-center text-gray-500
                             hover:border-gray-400 transition-colors text-sm
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemove(item.component_id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;