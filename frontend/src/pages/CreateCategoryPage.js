import React from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateCategoryMutation } from '../features/api/categoryApi';

const CreateCategoryPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description || '');
    if (values.image?.file) {
      formData.append('image', values.image.file);
    }

    try {
      await createCategory(formData).unwrap();
      message.success('Category was created');
      navigate('/');
    } catch (error) {
      const err = error.data;
      if (err) {
        Object.values(err).flat().forEach(msg => message.error(msg));
      } else {
        message.error('Error while creating');
      }
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Add new category</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: '', slug: '', description: '' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter categoory name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: 'Entr slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Lowercase , digits and cores only' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Descrption" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Image" name="image" valuePropName="file">
          <Upload
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chose file</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategoryPage;
