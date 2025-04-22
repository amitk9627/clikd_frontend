import { useEffect, useState } from 'react';
import AmitPDF from 'assets/CV_Amit_KUMAR.pdf';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="bg-white h-full">
      <div className="flex items-center flex-col">
        <h1 className="text-xl font-semibold">Amit Kumar</h1>
        <div>
          <iframe src={AmitPDF} width={800} height={1200} title="RESUME"></iframe>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
