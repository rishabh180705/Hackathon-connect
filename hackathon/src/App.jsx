import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Import your pages and layout components
import Authorization from './pages/Auth'; // Assuming path is correct
import { HomePage } from './pages/HomePage'; // Assuming path is correct
import Header from './components/Header'; // Assuming path is correct
import Footer from './components/Footer'; // Assuming path is correct

/**
 * AppLayout component
 * This component acts as a wrapper for pages that need a consistent Header and Footer.
 * The <Outlet /> from react-router-dom will render the specific child route's component.
 */
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (

      <Routes>
        {/* Route for the authorization page, which does NOT have the main header/footer */}
        <Route path="/" element={<Authorization />} />

        {/* A parent route that uses the AppLayout. All nested routes will render inside it. */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          {/* You can add other pages that need the header and footer here */}
          {/* e.g., <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>
      </Routes>
   
  );
}

export default App;
