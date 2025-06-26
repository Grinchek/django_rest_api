// src/pages/EditCategoryPage.js
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/categories/';

const EditCategoryPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialImage, setInitialImage] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}${id}/`)
      .then(res => {
        form.setFieldsValue(res.data);
        if (res.data.image) {
          setInitialImage([
            {
              uid: '-1',
              name: 'current-image.png',
              status: 'done',
              url: res.data.image,
            }
          ]);
        }
      })
      .catch(() => {
        message.error('Category was not loaded');
      });
  }, [id, form]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description || '');

    if (values.image && values.image.file) {
      formData.append('image', values.image.file);
    }

    axios.put(`${API_URL}${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        message.success('Category was edited');
        navigate('/?refetch=1');
      })
      .catch(error => {
        const err = error.response?.data;
        if (err) {
          Object.values(err).flat().forEach(msg => message.error(msg));
        } else {
          message.error('Error during editing category');
        }
      });
  };

  return (
    <div style={{ maxWidth: 600 ,margin: '0 auto'}}>
      <h2>Edit category</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: '', slug: '', description: '' }}
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

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Image" name="image" valuePropName="file">
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            defaultFileList={initialImage}
            beforeUpload={() => false} // prevent auto upload
          >
            <Button icon={<UploadOutlined />}>Chose an image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategoryPage;
