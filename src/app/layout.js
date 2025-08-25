
import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer position="top-right" autoClose={5000} />
      </body>
    </html>
  );
}
