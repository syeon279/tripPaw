import { Layout } from 'antd';
import dynamic from 'next/dynamic';
import ContentHeader from '../ContentHeader';

const Sidebar = dynamic(() => import('@/components/admin/Sidebar'), { ssr: false });

const { Sider, Content } = Layout;

const AdminpageLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} style={{ background: '#fff', marginTop: '60px'  }}>
        <Sidebar />
      </Sider>
      <Layout>
        <ContentHeader/>
        <Content style={{ padding: '24px', marginTop: '60px'  }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminpageLayout;