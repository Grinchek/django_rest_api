import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = 'http://localhost:8000/api/categories/';

const EditCategoryPage = () => {
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    axios.get(`${API_URL}${id}/`, {
      headers: {Authorization: `Bearer ${token}`,},})
      .then(res => {
        setInitialData(res.data);
        form.setFieldsValue({
          name: res.data.name,
          slug: res.data.slug,
          description: res.data.description,
        });
      })
      .catch(() => {
        message.error('Category was not loaded');
      });
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description || '');
    if (values.image && values.image.file) {
      formData.append('image', values.image.file);
    }

    try {
      await axios.put(`${API_URL}${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Category was updated');
      navigate('/');
    } catch (error) {
      message.error('Error while updating');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <p>Loadng...</p>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Edit category</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter category name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: 'Enter slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Lowercase , digits and cores only' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Descrption" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="New image" name="image" valuePropName="file">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chose file</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategoryPage;
