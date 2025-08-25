import SignupForm from "@/components/SignupForm";


export const metadata = {
  title: "Signup | Movie Platform",
  description: "Signup to access your account on Movie Platform.",
};



export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignupForm />
    </div>
  );
}