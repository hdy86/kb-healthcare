import { Toaster } from "react-hot-toast";
import Router from "@app/Router";
import Layout from "@components/shared/layout";
import FullLoading from "@components/shared/fullLoading";

export default function App() {
  return (
    <Layout>
      <Router />
      <Toaster position='bottom-center' />
      <FullLoading />
    </Layout>
  );
}
