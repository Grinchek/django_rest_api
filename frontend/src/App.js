import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import CategoryList from './CategoryList';
import CreateCategoryPage from './CreateCategoryPage';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1"><Link to="/">Список категорій</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/create">Додати категорію</Link></Menu.Item>
          </Menu>
        </Header>
        <Content className="container mt-4">
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/create" element={<CreateCategoryPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
