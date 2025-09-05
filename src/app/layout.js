
import { ToastContainer } from "react-toastify";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RouteLoader />

        {children}

        <ToastContainer position="top-right" autoClose={2000} />
      </body>
    </html>
  );
}
