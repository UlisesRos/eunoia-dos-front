import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CalendarioPage from './pages/CalendarioPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import TableUsuariosPilates from './pages/admin/TablaUsuariosPilates';
import AdminRoute from './components/Auth/AdminRoute';
import AccessDenied from './pages/AccessDenied';
import ForgotPasswordForm from '../src/components/ForgotPasswordForm';
import ResetPasswordFrom from '../src/components/ResetPasswordFrom';
import UserPerfil from './pages/UserPerfil';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route 
        path='/calendario' 
        element={
          <PrivateRoute>
            <CalendarioPage />
          </PrivateRoute>
          }        
        />
      <Route 
        path='/registro' 
        element={
          <AdminRoute>
            <TableUsuariosPilates />
          </AdminRoute>
          }        
        />
      <Route path="/perfil" element={
        <PrivateRoute>
          <UserPerfil />
        </PrivateRoute>
        } 
        />
      <Route path="/olvide-contrasena" element={<ForgotPasswordForm />} />
      <Route path="/reset-password/:token" element={<ResetPasswordFrom />} />
      <Route 
        path='/acceso-denegado'
        element={<AccessDenied />}
        />

    </Routes>
  );
}

export default App;
