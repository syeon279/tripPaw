import { useEffect, useState } from 'react';
import { getTemplateWithItems } from '@/api/checkTemplate';

const ChecklistItemList = ({ templateId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getTemplateWithItems(templateId);
      
      // case 1: 응답이 배열
      if (Array.isArray(data)) {
        setItems(data);
      } 
      // case 2: 응답이 객체 + items 필드
      else if (data.items) {
        setItems(data.items);
      } else {
        setItems([]); // fallback
      }
    };

    fetchItems();
  }, [templateId]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>- {item.content || item.name}</li>
      ))}
    </ul>
  );
};

export default ChecklistItemList;
