'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, firestore as db } from '@/lib/firebase';

type GoogleAdsAccount = {
  customerId: string;
  descriptiveName: string;
  currencyCode?: string;
  timeZone?: string;
};

type UseMidprintAuthGuardOptions = {
  onAccountLinked?: () => void;
};

type UseMidprintAuthGuardResult = {
  loading: boolean;
  user: User | null;
  hasGoogleAdsAccess: boolean;
  showAccountSelector: boolean;
  availableAccounts: GoogleAdsAccount[];
  handleConnectGoogleAds: (userId: string | undefined) => void;
  handleAccountSelection: (account: GoogleAdsAccount, userId: string) => Promise<void>;
};

export function useMidprintAuthGuard(options?: UseMidprintAuthGuardOptions): UseMidprintAuthGuardResult {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasGoogleAdsAccess, setHasGoogleAdsAccess] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<GoogleAdsAccount[]>([]);

  const refreshAfterLink = useCallback(() => {
    if (typeof options?.onAccountLinked === 'function') {
      options.onAccountLinked();
    } else {
      window.location.reload();
    }
  }, [options?.onAccountLinked]);

  const fetchAvailableAccounts = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/midprint/auth/list-accounts?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load Google Ads accounts.');
      }
      const data = await response.json();
      setAvailableAccounts(Array.isArray(data.accounts) ? data.accounts : []);
    } catch (error) {
      console.error('Error fetching available accounts:', error);
      setAvailableAccounts([]);
    }
  }, []);

  const checkGoogleAdsAccess = useCallback(
    async (userId: string, userEmail?: string | null) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setHasGoogleAdsAccess(Boolean(userData.googleAdsCustomerId));
        } else {
          await setDoc(
            doc(db, 'users', userId),
            {
              email: userEmail ?? null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { merge: true },
          );
          setHasGoogleAdsAccess(false);
        }
      } catch (error) {
        console.error('Error checking Google Ads access:', error);
        setHasGoogleAdsAccess(false);
      }
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const urlParams = new URLSearchParams(window.location.search);
        const shouldSelectAccount =
          urlParams.get('oauth') === 'success' && urlParams.get('selectAccount') === 'true';

        if (shouldSelectAccount) {
          setShowAccountSelector(true);
          await fetchAvailableAccounts(firebaseUser.uid);
        }

        await checkGoogleAdsAccess(firebaseUser.uid, firebaseUser.email);
      } else {
        router.push('/signin?redirect=/midprint');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkGoogleAdsAccess, fetchAvailableAccounts, router]);

  const handleConnectGoogleAds = useCallback((userId: string | undefined) => {
    if (!userId) {
      return;
    }
    window.location.href = `/api/midprint/auth/google?userId=${userId}`;
  }, []);

  const handleAccountSelection = useCallback(
    async (account: GoogleAdsAccount, userId: string) => {
      try {
        await setDoc(
          doc(db, 'users', userId),
          {
            googleAdsCustomerId: account.customerId,
            googleAdsAccountName: account.descriptiveName,
            updatedAt: new Date(),
          },
          { merge: true },
        );
        setHasGoogleAdsAccess(true);
        setShowAccountSelector(false);
        refreshAfterLink();
      } catch (error) {
        console.error('Error saving account selection:', error);
      }
    },
    [refreshAfterLink],
  );

  return {
    loading,
    user,
    hasGoogleAdsAccess,
    showAccountSelector,
    availableAccounts,
    handleConnectGoogleAds,
    handleAccountSelection,
  };
}
