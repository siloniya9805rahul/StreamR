"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            router.push("/login"); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button className="cursor-pointer"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}
