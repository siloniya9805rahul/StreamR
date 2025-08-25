"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, Edit3 } from "lucide-react";
import { toast } from "react-toastify";

export default function EditProfileForm({ user }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || {},
    });
    const [loading, setLoading] = useState(false);



    // Handle text input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle profile image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // / ✅ validation
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be under 2MB");
            return;
        }
        try {
            setLoading(true);
            toast.info("Please wait Image is Uploading!")
            let oldImage = formData.avatar;

            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/cloud/upload", {
                method: "POST",
                body: form,
            });

            const data = await res.json();
            if (!res.ok) {
                toast.info("Please Select Again");
            }

            if (data.success) {
                if (oldImage?.public_id) {
                    await fetch("/api/cloud/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ public_id: oldImage.public_id,resource_type:"image" }),
                    });
                }
                setFormData({ ...formData, avatar: { url: data.url, public_id: data.public_id } });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    // Save updated user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(`/api/user/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            toast.success("Profile Updated Successfully!")
            router.push(`/dashboard/`);
        } else {
            toast.error("Failed to update profile");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-3/4 p-6">
            <form
                onSubmit={handleSubmit}
                className="shadow-lg rounded-2xl p-6 pb-0 w-full max-w-md space-y-6"
            >
                {/* Profile Image */}
                <div className="relative w-32 h-32 mx-auto">
                    <img
                        src={formData.avatar?.url}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border"
                    />
                    <label
                        htmlFor="profile-upload"
                        className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600"
                    >
                        <Edit3 className="text-white w-4 h-4" />
                    </label>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
