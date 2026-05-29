import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWallet, getWalletByUser, buyCoins, purchaseAIPass } from "../api/wallet";
import { qk } from "./queryKeys";

//get user wallet
export const useGetWallet = () => {
    const {
        data: walletData,
        isLoading: isWalletLoading,
        error: walletError
    } = useQuery({
        queryKey: qk.wallet.all(),
        queryFn: () => getWallet()
    })

    const balance = walletData?.data ?? walletData;
    return { balance, isWalletLoading, walletError};
}

//buy coins and increment user wallet
export const useBuyCoins = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({amount}) => buyCoins({ amount }),
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.wallet.all() });
    },
    })
}

//pruchase AI access
export const usePurchaseAIPass = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: purchaseAIPass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.wallet.all() });
            queryClient.invalidateQueries({ queryKey: qk.user.current() }); 
        },
    });
};
