import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Typography, Button, Modal, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';




const { Title, Text } = Typography;

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return <Title level={3}>Please log in to view your profile.</Title>;
  }
  const handleDelete = () => {
  console.log({token});

  Modal.confirm({
    title: 'Do you really want to delete your profile?',
    okText: 'Yes, delete',
    okType: 'danger',
    cancelText: 'Cancel',

    onOk: async () => {
      if (!token) {
        message.error('No token found');
        return;
      }

      try {
       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/delete/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });



        const body = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', body);

        if (!res.ok) throw new Error('Failed to delete account');

        message.success('Profile deleted successfully');
        dispatch(logout());
        navigate('/register');
      } catch (error) {
        console.error(error);
        message.error('Failed to delete profile');
      }
    },

    onCancel: () => {
      console.log('❌ Cancelled deletion');
    },
  });
};


  const phone = user.profile?.phone || 'Not specified';
  const photoUrl = user.profile?.photo
    ? `${process.env.REACT_APP_API_URL}${user.profile.photo}`
    : null;

  return (
    <Space direction="vertical" style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
      <Card
        title="My Profile"
        style={{ width: 400 }}
        cover={
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Avatar size={128} src={photoUrl}>
              {!photoUrl && user.username[0]?.toUpperCase()}
            </Avatar>
          </div>
        }
      >
        <Title level={4}>👤 {user.username}</Title>
        <Text strong>📱 Phone:</Text> <Text>{phone}</Text>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button danger onClick={handleDelete}>
            Delete Profile
          </Button>
        </div>
      </Card>
    </Space>
  );
};

export default ProfilePage;
