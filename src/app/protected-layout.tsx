import NavBar from "@/components/Navbar";
import "../app/globals.css";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <html>
    <body>
      <NavBar />
      {children}
    </body>
  </html>
);

export default ProtectedLayout;
