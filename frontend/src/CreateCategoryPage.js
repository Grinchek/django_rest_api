import React from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/categories/';

const CreateCategoryPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios.post(API_URL, values)
      .then(() => {
        message.success('Категорію створено');
        navigate('/');
      })
      .catch(error => {
        const err = error.response?.data;
        if (err) {
          Object.values(err).flat().forEach(msg => message.error(msg));
        } else {
          message.error('Помилка при створенні категорії');
        }
      });
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Додати нову категорію</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: '', slug: '', description: '' }}
      >
        <Form.Item
          label="Назва"
          name="name"
          rules={[{ required: true, message: 'Введіть назву категорії' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: 'Введіть slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Тільки малі літери, цифри та дефіси' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Опис" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зберегти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategoryPage;
