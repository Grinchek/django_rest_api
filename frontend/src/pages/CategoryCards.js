import React, { useEffect } from 'react';
import { useGetCategoriesQuery } from '../features/api/categoryApi';
import { Card, Row, Col, Spin, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

  const { token } = useSelector((state) => state.auth);
  const handleDelete = (id) => {
  if (!token) {
    message.error('You need to login');
    return;
  }
console.log('Tocken while deleting:', token);

  axios.delete(`${API_URL}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => {
      message.success('Category was deetd');
      refetch();
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        message.error('You are not authorized');
      } else {
        message.error('Error while deleting');
      }
    });
};


  if (isLoading) return <Spin size="large" />;
  if (error) return <p>Error while loding</p>;

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
