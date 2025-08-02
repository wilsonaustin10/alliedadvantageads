'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore as db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface Metrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export default function MidPrintDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasGoogleAdsAccess, setHasGoogleAdsAccess] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  });
  const [metrics, setMetrics] = useState<Metrics>({
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        console.log('Your Firebase User ID:', firebaseUser.uid);
        
        // Check URL params for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('oauth') === 'success' && urlParams.get('selectAccount') === 'true') {
          // User just completed OAuth, fetch available accounts
          setShowAccountSelector(true);
          await fetchAvailableAccounts(firebaseUser.uid);
        }
        
        await checkGoogleAdsAccess(firebaseUser.uid);
        await fetchCampaigns(firebaseUser.uid);
        await fetchMetrics(firebaseUser.uid);
      } else {
        router.push('/signin?redirect=/midprint');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const checkGoogleAdsAccess = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setHasGoogleAdsAccess(!!userData.googleAdsCustomerId);
      } else {
        // Create user document if it doesn't exist
        console.log('Creating user document for:', userId);
        await setDoc(doc(db, 'users', userId), {
          email: user?.email,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setHasGoogleAdsAccess(false);
      }
    } catch (error) {
      console.error('Error checking Google Ads access:', error);
    }
  };

  const fetchCampaigns = async (userId: string) => {
    try {
      const response = await fetch(`/api/midprint/campaigns?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchMetrics = async (userId: string) => {
    try {
      const params = new URLSearchParams({
        userId,
        campaignId: selectedCampaign,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString()
      });

      const response = await fetch(`/api/midprint/metrics?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleConnectGoogleAds = () => {
    window.location.href = `/api/midprint/auth/google?userId=${user?.uid}`;
  };

  const fetchAvailableAccounts = async (userId: string) => {
    try {
      const response = await fetch(`/api/midprint/auth/list-accounts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching available accounts:', error);
    }
  };

  useEffect(() => {
    if (user && hasGoogleAdsAccess) {
      fetchMetrics(user.uid);
    }
  }, [selectedCampaign, dateRange, user, hasGoogleAdsAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showAccountSelector && availableAccounts.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Select Your Google Ads Account</CardTitle>
            <CardDescription>
              Choose which Google Ads account to connect to Allied Advantage Ads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableAccounts.map((account) => (
              <div
                key={account.customerId}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={async () => {
                  try {
                    await setDoc(doc(db, 'users', user.uid), {
                      googleAdsCustomerId: account.customerId,
                      googleAdsAccountName: account.descriptiveName,
                      updatedAt: new Date()
                    }, { merge: true });
                    setHasGoogleAdsAccess(true);
                    setShowAccountSelector(false);
                    window.location.href = '/midprint';
                  } catch (error) {
                    console.error('Error saving account:', error);
                  }
                }}
              >
                <div className="font-medium">{account.descriptiveName}</div>
                <div className="text-sm text-gray-500">Customer ID: {account.customerId}</div>
                <div className="text-sm text-gray-500">{account.currencyCode} • {account.timeZone}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasGoogleAdsAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Google Ads Account</CardTitle>
            <CardDescription>
              Click below to connect your Google Ads account. After authorization, you'll be able to select which account to use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnectGoogleAds} className="w-full">
              Connect Google Ads Account
            </Button>
            <p className="mt-4 text-sm text-gray-500 text-center">
              You'll be redirected to Google to authorize access, then you can select which account to use.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MidPrint Performance Dashboard</h1>
        <p className="text-gray-600">Monitor your Google Ads campaign performance</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-full md:w-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.impressions.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.clicks.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.ctr.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${metrics.cost.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">CPC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${metrics.cpc.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.conversions}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            View your campaign performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart visualization will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}