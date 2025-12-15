import { useState, useEffect } from "react";
import { Activity, AlertCircle, CheckCircle } from "lucide-react";

interface ApiStatusProps {
  className?: string;
}

export function ApiStatus({ className = "" }: ApiStatusProps) {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    try {
      const { healthAPI } = await import("@/lib/api");
      await healthAPI.checkHealth();
      setStatus("online");
    } catch (error) {
      console.warn("API health check failed:", error);
      setStatus("offline");
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();

    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <Activity className="w-4 h-4 animate-pulse text-blue-500" />;
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "offline":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Checking API...";
      case "online":
        return "API Online";
      case "offline":
        return "API Offline (Demo Mode)";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "checking":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "online":
        return "text-green-600 bg-green-50 border-green-200";
      case "offline":
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {lastCheck && (
        <span className="text-xs opacity-75">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
