import { PageHeader, LayoutContent, FullPageSpinner } from "../styles";

const Dashboard = () => {


  return(
    <>
      <PageHeader
        title="Dashboard"
        // breadcrumb={{ routes }} 
      />
      <LayoutContent>
        {
          false ?
          <FullPageSpinner /> :
          <>
           Dashboard
          </>
        }
      </LayoutContent>
    </>
  );
};

export default Dashboard;