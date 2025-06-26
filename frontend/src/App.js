import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import CategoryCards from './pages/CategoryCards';
import CreateCategoryPage from './CreateCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">Categoryes</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/create">Add category</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<CategoryCards />} />
            <Route path="/create" element={<CreateCategoryPage />} />
            <Route path="/edit/:id" element={<EditCategoryPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
