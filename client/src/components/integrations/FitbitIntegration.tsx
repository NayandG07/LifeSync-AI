import { Watch, Check, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFitbit } from '@/contexts/FitbitContext';

export default function FitbitIntegration() {
  const { isConnected, loading, lastSync, connect, disconnect, syncData } = useFitbit();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Watch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Fitbit Integration</h2>
              <p className="text-sm text-gray-500">
                Connect your Fitbit device to sync health data
              </p>
            </div>
          </div>
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={syncData}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={disconnect}
                disabled={loading}
              >
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={loading}
              className="bg-[#00B0B9] hover:bg-[#00B0B9]/90"
            >
              {loading ? 'Connecting...' : 'Connect Fitbit'}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {isConnected && lastSync && (
            <span className="text-sm text-gray-500">
              Last synced: {new Date(lastSync).toLocaleString()}
            </span>
          )}
        </div>

        {!isConnected && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">What you'll get:</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Real-time health metrics sync to Dashboard
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Automatic activity tracking integration
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Sleep and heart rate data analysis
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Enhanced health insights and recommendations
              </li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
} 