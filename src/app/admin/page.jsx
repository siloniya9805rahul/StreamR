export const metadata = {
  title: "Admin Dashboard || StreamR",
  description:
    "View total users, active users, new users in the last 7 days. Track the user's stats over the last year.",
};

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
    lastLogin: { $gte: sevenDaysAgo },
  });

  // New users (joined in last 7 days)
  const newUsers = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Fetch users created this year
  const users = await User.find({
    createdAt: { $gte: startOfYear },
  }).select("createdAt");

  // Count users per month
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    count: 0,
  }));

  users.forEach((user) => {
    const monthIndex = new Date(user.createdAt).getMonth();
    monthlyData[monthIndex].count += 1;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">
            Active Users (7d)
          </h2>
          <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">
            New Users (7d)
          </h2>
          <p className="text-3xl font-bold text-purple-600">{newUsers}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 mt-8 bg-white shadow rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          New Users per Month ({now.getFullYear()})
        </h2>
        <div className="w-full overflow-x-auto">
          <UsersChart data={monthlyData} />
        </div>
      </div>
    </div>
  );
}
