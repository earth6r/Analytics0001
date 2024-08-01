import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore/lite";
import { type NextApiRequest, type NextApiResponse } from "next/types";

const getExchangeRate = async (asset_id: string) => {
    const response = await axios.get(`https://rest.coinapi.io/v1/exchangerate/${asset_id}/USD?apiKey=${process.env.COIN_API_IO_API_KEY}`);

    return Number(response.data.rate).toFixed(2);
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cryptoPricesRef = collection(db, "cryptoPrices");

    const btcRate = await getExchangeRate('BTC');
    const ethRate = await getExchangeRate('ETH');

    const createdAtDate = new Date();

    createdAtDate.setSeconds(0);

    // prices in USD
    addDoc(cryptoPricesRef, {
        bitcoin: btcRate,
        ethereum: ethRate,
        createdAt: createdAtDate.getTime(),
    });

    res.status(200).json({ message: 'Cron job executed successfully' });
}
