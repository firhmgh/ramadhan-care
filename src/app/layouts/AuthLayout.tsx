import { Outlet } from 'react-router-dom'; 

export default function AuthLayout() {
  return (
    <div className="min-h-screen gradient-spiritual flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
