import React from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRegisterUserMutation } from '../features/api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [register] = useRegisterUserMutation();
  const navigate = useNavigate();

const onFinish = async (values) => {
  try {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('phone', values.phone);

   if (values.photo?.[0]?.originFileObj) {
      formData.append('photo', values.photo[0].originFileObj);
    }


    console.log('➡️ Sending form data to API');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    await register(formData).unwrap();
    message.success('Registration was successful');
    setTimeout(() => navigate('/login'), 1000);

  } catch (error) {
    console.error('❌ Registration error:', error);

    if (error?.data) {
      for (const [key, value] of Object.entries(error.data)) {
        message.error(`${key}: ${value}`);
        console.error(`${key}:`, value);
      }
    } else {
      message.error('Unknown error during registration');
    }
  }
};



  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Registration</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} encType="multipart/form-data">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Enter username' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Enter password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Repeat password"
          name="re_password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirm the password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords are not matching'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Enter your phone' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Photo"
          name="photo"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload photo</Button>
          </Upload>
        </Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
