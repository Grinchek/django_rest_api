import React, { useEffect } from 'react';
import { useGetCategoriesQuery } from '../features/api/categoryApi';
import { Card, Row, Col, Spin, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/categories/';

const CategoryCards = () => {
  const { data: categories = [], isLoading, error, refetch } = useGetCategoriesQuery();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('refetch') === '1') {
      refetch();
    }
  }, [location.search, refetch]);

  const handleDelete = (id) => {
    axios.delete(`${API_URL}${id}/`)
      .then(() => {
        message.success('Категорію видалено');
        refetch();
      })
      .catch(() => {
        message.error('Помилка при видаленні');
      });
  };

  if (isLoading) return <Spin size="large" />;
  if (error) return <p>Помилка при завантаженні</p>;

  return (
    <Row gutter={[16, 16]}>
      {categories.map(cat => (
        <Col xs={24} sm={12} md={8} lg={6} key={cat.id}>
          <Card
            hoverable
            cover={
              cat.image ? (
                <img
                  alt={cat.name}
                  src={cat.image} 
                  style={{ height: 200, objectFit: 'cover', width: '100%' }}
                />
              ) : null
            }
            actions={[
              <EditOutlined key="edit" onClick={() => navigate(`/edit/${cat.id}`)} />,
              <Popconfirm
                title="Delete the category?"
                onConfirm={() => handleDelete(cat.id)}
                okText="Delete"
                cancelText="Cancel"
              >
                <DeleteOutlined key="delete" />
              </Popconfirm>
            ]}
          >
            <Card.Meta title={cat.name} description={cat.description} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryCards;
