import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRegisterUserMutation } from '../features/api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [register] = useRegisterUserMutation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register(values).unwrap();
      message.success('Registration was successful');
      navigate('/login');
    } catch (error) {
      message.error('Error while registration');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Regitration</h2>
      <Form layout="vertical" onFinish={onFinish}>
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
          label="Repeet the password"
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

        <Form.Item>
          <Button type="primary" htmlType="submit">Registration</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
