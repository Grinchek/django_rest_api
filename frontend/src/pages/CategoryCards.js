import React, { useEffect } from 'react';
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from '../features/api/categoryApi';
import { Card, Row, Col, Spin, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategoryCards = () => {
  const { data: categories = [], isLoading, error, refetch } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('refetch') === '1') {
      refetch();
    }
  }, [location.search, refetch]);

  const handleDelete = async (id) => {
    if (!token) {
      message.error('You need to login');
      return;
    }

    try {
      await deleteCategory(id).unwrap();
      message.success('Category was deleted');
      refetch();
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        message.error('You are not authorized');
      } else {
        message.error('Error while deleting');
      }
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (error) return <p>Error while loading categories</p>;

  return (
    <Row gutter={[16, 16]}>
      {categories.map((cat) => (
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
              </Popconfirm>,
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
