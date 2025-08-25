export const metadata = {
  title: "Admin Dashboard || StreamR",
  description: "view total user ,active users,new users in last 7 days . track the user's stats over the last year",
};

// src/app/admin/page.js
import UsersChart from "@/components/admin/UserChart";
import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function AdminDashboard() {
  await connectDB();

  // Dates for last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Total users
  const totalUsers = await User.countDocuments();

  // Active users (last 7 days)
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: sevenDaysAgo }
  });

  // New users (joined in last 7 days)
  const newUsers = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year

  // Fetch users created this year
  const users = await User.find({
    createdAt: { $gte: startOfYear },
  }).select("createdAt");

  // Count users per month
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    count: 0,
  }));

  users.forEach(user => {
    const monthIndex = new Date(user.createdAt).getMonth();
    monthlyData[monthIndex].count += 1;
  });

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl">{totalUsers}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-lg font-semibold">Active Users (7d)</h2>
          <p className="text-3xl">{activeUsers}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-lg font-semibold">New Users (7d)</h2>
          <p className="text-3xl">{newUsers}</p>
        </div>
      </div>
      <div className="p-6 mt-7 bg-white shadow rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">New Users per Month ({now.getFullYear()})</h2>
        <UsersChart data={monthlyData} />
      </div>
    </div>
  );
}
