// frontend/src/lib/wallet.ts
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class WalletService {
    private static provider?: ethers.BrowserProvider;
    
    static async connect() {
      if (!window.ethereum) throw new Error("No wallet");
      this.provider = new ethers.BrowserProvider(window.ethereum);
      return this.provider.getSigner();
    }
  }