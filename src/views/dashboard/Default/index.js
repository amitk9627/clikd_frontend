import { useEffect, useState } from 'react';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
   <div>
    hello
   </div>
  );
};

export default Dashboard;
