import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import CategoryCards from './pages/CategoryCards';
import CreateCategoryPage from './pages/CreateCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const { Header, Content } = Layout;

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            {!user && (
              <>
                <Menu.Item key="login">
                  <Link to="/login">Sign in</Link>
                </Menu.Item>
                <Menu.Item key="register">
                  <Link to="/register">Log in</Link>
                </Menu.Item>
              </>
            )}

            {user && (
              <>
                <Menu.Item key="categories">
                  <Link to="/">Categories</Link>
                </Menu.Item>
                <Menu.Item key="create">
                  <Link to="/create">Add new</Link>
                </Menu.Item>
                <Menu.Item key="user" style={{ color: 'white', cursor: 'default' }}>
                  👤 {user.username}
                </Menu.Item>
                <Menu.Item key="logout" onClick={() => dispatch(logout())}>
                  Вийти
                </Menu.Item>
              </>
            )}
          </Menu>
        </Header>

        <Content className="container mt-4">
          <Routes>
            <Route path="/" element={<CategoryCards />} />
            <Route path="/create" element={<CreateCategoryPage />} />
            <Route path="/edit/:id" element={<EditCategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
