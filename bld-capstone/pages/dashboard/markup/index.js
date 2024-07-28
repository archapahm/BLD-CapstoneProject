
import DocumentBrowser from '@/components/markup/DocumentBrowser';
import Layout from '../layout';

const Page = () => {
    return <DocumentBrowser></DocumentBrowser>
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
  
export default Page;