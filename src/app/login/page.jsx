import LoginForm from "@/components/LoginForm";


export const metadata = {
  title: "Login | Movie Platform",
  description: "Login to access your account on Movie Platform.",
};



export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
