'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { firestore as db } from '@/lib/firebase';
import { useMidprintAuthGuard } from './useMidprintAuthGuard';

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
  const {
    loading,
    user,
    hasGoogleAdsAccess,
    showAccountSelector,
    availableAccounts,
    handleConnectGoogleAds,
    handleAccountSelection,
  } = useMidprintAuthGuard();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [metrics, setMetrics] = useState<Metrics>({
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
  });

  const fetchCampaigns = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/midprint/campaigns?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, []);

  const fetchMetrics = useCallback(
    async (userId: string) => {
      try {
        const params = new URLSearchParams({
          userId,
          campaignId: selectedCampaign,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        });

        const response = await fetch(`/api/midprint/metrics?${params}`);
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    },
    [dateRange.from, dateRange.to, selectedCampaign],
  );

  useEffect(() => {
    if (user) {
      fetchCampaigns(user.uid);
    }
  }, [fetchCampaigns, user]);

  useEffect(() => {
    if (user && hasGoogleAdsAccess) {
      fetchMetrics(user.uid);
    }
  }, [fetchMetrics, hasGoogleAdsAccess, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showAccountSelector && user) {
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
            {availableAccounts.length > 0 ? (
              availableAccounts.map((account) => (
                <div
                  key={account.customerId}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAccountSelection(account, user.uid)}
                >
                  <div className="font-medium">{account.descriptiveName}</div>
                  <div className="text-sm text-gray-500">Customer ID: {account.customerId}</div>
                  <div className="text-sm text-gray-500">{account.currencyCode} • {account.timeZone}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No Google Ads accounts were returned. Please try reconnecting your Google Ads account.
              </p>
            )}
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
            <Button onClick={() => handleConnectGoogleAds(user?.uid)} className="w-full">
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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">MidPrint Performance Dashboard</h1>
          <p className="text-gray-600">Monitor your Google Ads campaign performance</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const newCustomerId = prompt('Enter your Google Ads Customer ID (10 digits):', '');
            if (newCustomerId && newCustomerId.length === 10 && /^\d+$/.test(newCustomerId)) {
              setDoc(
                doc(db, 'users', user!.uid),
                {
                  googleAdsCustomerId: newCustomerId,
                  updatedAt: new Date(),
                },
                { merge: true },
              )
                .then(() => {
                  alert('Customer ID updated successfully!');
                  window.location.reload();
                })
                .catch((error) => {
                  alert('Error updating Customer ID: ' + error.message);
                });
            } else if (newCustomerId) {
              alert('Please enter a valid 10-digit Customer ID');
            }
          }}
        >
          Update Customer ID
        </Button>
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

        <DateRangePicker value={dateRange} onChange={setDateRange} className="w-full md:w-auto" />
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
          <CardDescription>View your campaign performance over time</CardDescription>
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
