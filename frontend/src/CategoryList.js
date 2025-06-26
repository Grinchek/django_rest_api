// src/CategoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Button, Form, Modal, Table } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8000/api/categories/';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Помилка при завантаженні категорій'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? axios.put : axios.post;
    const url = editId ? `${API_URL}${editId}/` : API_URL;

    method(url, formData)
      .then(() => {
        toast.success(editId ? 'Категорію оновлено' : 'Категорію створено');
        fetchCategories();
        setShow(false);
        setFormData({ name: '', slug: '', description: '' });
        setEditId(null);
      })
      .catch(error => {
        const msg = error.response?.data || 'Помилка при збереженні';
        toast.error(JSON.stringify(msg));
      });
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, slug: category.slug, description: category.description });
    setEditId(category.id);
    setShow(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      axios.delete(`${API_URL}${id}/`)
        .then(() => {
          toast.success('Категорію видалено');
          fetchCategories();
        })
        .catch(() => toast.error('Помилка при видаленні'));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Список категорій</h2>

      <Button className="mb-3" onClick={() => {
        setShow(true);
        setFormData({ name: '', slug: '', description: '' });
        setEditId(null);
      }}>
        Додати категорію
      </Button>

      {loading ? <Spinner animation="border" /> : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Slug</th>
              <th>Опис</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.description}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(cat)}>Редагувати</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>Видалити</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальне вікно */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Редагувати' : 'Нова'} категорія</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Назва</Form.Label>
              <Form.Control type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Опис</Form.Label>
              <Form.Control as="textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit">Зберегти</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default CategoryList;
