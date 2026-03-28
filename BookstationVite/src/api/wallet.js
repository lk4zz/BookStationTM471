import { privateApi } from "./axios";

export const buyCoins = async (amount) => {
    const res = await privateApi.post(`wallet/buycoins`, amount)
    return res.data;
} 

export const getWallet = async () => {
    const res = await privateApi.get(`/wallet`);
    return res.data;
}

export const getWalletByUser = async (userId) => {
    const res = await privateApi.get(`/wallet/${userId}`)
    return res.data;
}