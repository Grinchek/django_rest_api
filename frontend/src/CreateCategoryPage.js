import React from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

const API_URL = 'http://localhost:8000/api/categories/';

const CreateCategoryPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description);
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0].originFileObj);
    }

    axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(() => {
        message.success('Category was created');
        navigate('/?refetch=1');
      })
      .catch(error => {
        const err = error.response?.data;
        if (err) {
          Object.values(err).flat().forEach(msg => message.error(msg));
        } else {
          message.error('Error during creating category');
        }
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Add new category</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chose an image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategoryPage;
