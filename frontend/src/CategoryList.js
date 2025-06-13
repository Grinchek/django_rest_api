import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error('Помилка при отриманні категорій:', err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Список категорій</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Назва</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
