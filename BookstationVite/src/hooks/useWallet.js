import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWallet, getWalletByUser, buyCoins, purchaseAIPass } from "../api/wallet";

export const useGetWallet = () => {
    const {
        data: walletData,
        isLoading: isWalletLoading,
        error: walletError
    } = useQuery({
        queryKey: ["wallet", ],
        queryFn: () => getWallet()
    })

    const balance = walletData?.data ?? walletData;
    return { balance, isWalletLoading, walletError};
}
export const useBuyCoins = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({amount}) => buyCoins({ amount }),
        onSuccess: () => {
      queryClient.invalidateQueries(["wallet"]);
    },
    })
}

export const usePurchaseAIPass = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: purchaseAIPass,
        onSuccess: () => {
            queryClient.invalidateQueries(["wallet"]);
            queryClient.invalidateQueries(["user"]); 
        },
    });
};
