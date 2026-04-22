import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NavigationBar from "./components/NavigationBar.jsx";
import Verify from "./pages/Verify.jsx";
import Upload from "./pages/Upload.jsx";
import Protected from "./components/Protected.jsx";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin.jsx";
import { Web3Provider } from "./context/Web3Context.jsx";
import MyUploads from "./pages/MyUploads.jsx";
import Home from "./pages/Home.jsx";


function App() {
  return (
    <Web3Provider>

    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 bg-grid-pattern font-sans text-slate-900">
        {/* Navigation Bar */}
        <NavigationBar />

      <Toaster 
            position="bottom-right" 
            toastOptions={{ 
              duration: 5000,
              style: {
                background: '#1e293b',
                color: '#fff',
                fontWeight: '500'
              }
            }} 
          />

        {/* Page Content */}
        <main className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/verify" element={<Verify />} />
            <Route
              path="/upload"
              element={
                <Protected>
                  <Upload />
                </Protected>
              }
              />
              <Route 
                path="/my-uploads" 
                element={
                  <Protected>
                    <MyUploads />
                  </Protected>
                } 
            />
            <Route
              path="/admin"
              element={
                <Protected requireAdmin={true}>
                  <Admin/>
                </Protected>
              }
              />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
              </Web3Provider>
  );
}

export default App;
