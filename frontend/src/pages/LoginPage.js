import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useLoginUserMutation } from '../features/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
  try {
    const response = await loginUser(values).unwrap();
    const access = response.access;

    const userRes = await fetch('http://localhost:8000/api/user/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!userRes.ok) throw new Error('User was not loaded');
    const user = await userRes.json();

    dispatch(setCredentials({ user, access }));
    message.success('Login successful');
    navigate('/');
  } catch (error) {
    message.error('Fail ligin data');
  }
};
  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
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

        <Form.Item>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
