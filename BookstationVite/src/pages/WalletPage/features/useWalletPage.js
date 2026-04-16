import { useGetWallet } from "../../../hooks/useWallet";

const VALID_COIN_BUNDLES = [100, 500, 1200, 2500, 5000];
const STANDARD_BUNDLES = VALID_COIN_BUNDLES.slice(0, 3);
const PREMIUM_BUNDLES = VALID_COIN_BUNDLES.slice(3);

export function useWalletPage() {
  const { balance, isWalletLoading, walletError } = useGetWallet();

  return {
    balance,
    isWalletLoading,
    walletError,
    standardBundles: STANDARD_BUNDLES,
    premiumBundles: PREMIUM_BUNDLES,
  };
}
