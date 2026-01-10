import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ItemsContext = createContext();
// const API = "http://localhost:5000";
const API = import.meta.env.VITE_API_URL;


export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get(`${API}/api/items`);
    const formatted = res.data.data.map(item => ({
      ...item,
      images: item.images.map(img => `${API}/${img}`)
    }));
    setItems(formatted);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (formData) => {
    const res = await axios.post(
      `${API}/api/items/report`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const item = {
      ...res.data.data,
      images: res.data.data.images.map(img => `${API}/${img}`)
    };

    setItems(prev => [item, ...prev]);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => useContext(ItemsContext);
