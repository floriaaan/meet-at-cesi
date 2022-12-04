import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { NextPage } from "next";

type Props = {};

const AdminIndexPage: NextPage<Props> = ({}) => {
  return (
    <AppLayout>
      <AdminLayout>
        <>helloworld</>
      </AdminLayout>
    </AppLayout>
  );
};

export default AdminIndexPage;
