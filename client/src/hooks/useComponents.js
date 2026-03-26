import { useState, useEffect } from 'react';
import api from '../api/axios';

// Convert flat array to nested tree
export const buildTree = (items) => {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    if (item.parent_id === null) {
      roots.push(map[item.id]);
    } else if (map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    }
  });

  return roots;
};

const useComponents = () => {
  const [tree, setTree] = useState([]);
  const [flatList, setFlatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComponents = async () => {
    try {
      const res = await api.get('/components');
      setFlatList(res.data);
      setTree(buildTree(res.data));
    } catch (err) {
      setError('Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return { tree, flatList, loading, error, refetch: fetchComponents };
};

export default useComponents;