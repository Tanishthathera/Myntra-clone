import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import FetchItems from "../components/FetchItems";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { Toaster } from 'react-hot-toast';

function App() {
  const fetchStatus = useSelector((store) => store.fetchStatus);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
    duration: 3000,
    style: {
      fontSize: '16px',
    },
  }} />
      <Header />
      <FetchItems />
      {fetchStatus.currentlyFetching ? <LoadingSpinner /> : <Outlet />}

      <Footer />
      {/* <script src="data/items.js"></script>
      <script src="scripts/index.js"></script> */}
    </>
  );
}

export default App;
