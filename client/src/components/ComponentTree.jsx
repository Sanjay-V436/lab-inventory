import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Minus } from 'lucide-react';

const ComponentNode = ({ node, cart, onAdd, onRemove, onQuantityChange }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const cartItem = cart.find((c) => c.component_id === node.id);
  const isInCart = !!cartItem;

  // Leaf node — selectable
  if (!hasChildren) {
    const isOutOfStock = node.stock === 0;

    return (
      <div className="flex items-center justify-between py-2 px-3
                      hover:bg-gray-50 rounded-lg group">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-700">{node.name}</span>
          {isOutOfStock && (
  <span className="text-xs font-medium px-2 py-0.5 rounded-full
                   bg-red-100 text-red-600">
    Out of Stock
  </span>
)}
        </div>

        {/* Add / Quantity control */}
        {!isOutOfStock && (
          <div className="flex items-center gap-2">
            {isInCart ? (
              <div className="flex items-center gap-2">
                <button
  onClick={() => onQuantityChange(node.id, cartItem.quantity - 1)}
  className="w-6 h-6 rounded-full border border-gray-300
             flex items-center justify-center
             hover:bg-red-50 hover:border-red-300
             text-gray-500 hover:text-red-500
             transition-colors"
>
  <Minus size={12} />
</button>
                <span className="text-sm font-semibold w-6 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(node.id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= node.stock}
                  className="w-6 h-6 rounded-full border border-gray-300
                             flex items-center justify-center
                             hover:bg-green-50 hover:border-green-300
                             text-gray-500 hover:text-green-500
                             transition-colors disabled:opacity-40
                             disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAdd(node)}
                className="text-xs font-medium px-3 py-1 rounded-full
                           border transition-colors
                           hover:text-white"
                style={{
                  borderColor: '#9B1B4B',
                  color: '#9B1B4B',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#9B1B4B';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#9B1B4B';
                }}
              >
                + Add
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Parent node — expandable
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-2.5 px-3
                   hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded
            ? <ChevronDown size={16} className="text-gray-500" />
            : <ChevronRight size={16} className="text-gray-500" />
          }
          <span className="text-sm font-semibold text-gray-800">
            {node.name}
          </span>
          <span className="text-xs text-gray-400">
            ({node.children.length})
          </span>
        </div>
      </button>

      {expanded && (
        <div className="ml-6 border-l border-gray-100 pl-2 mt-1 space-y-0.5">
          {node.children.map((child) => (
            <ComponentNode
              key={child.id}
              node={child}
              cart={cart}
              onAdd={onAdd}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ComponentTree = ({ tree, cart, onAdd, onRemove, onQuantityChange }) => {
  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No components available
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <ComponentNode
          key={node.id}
          node={node}
          cart={cart}
          onAdd={onAdd}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
};

export default ComponentTree;