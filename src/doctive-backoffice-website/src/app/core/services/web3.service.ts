import { Injectable } from '@angular/core';
import { BlockchainNetwork } from '@core/models/network';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import { provider } from 'web3-core';
import Web3Modal from 'web3modal';

import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  public accountsObservable = new Subject<string[]>();
  web3Modal: Web3Modal;
  web3js: Web3;
  provider: provider | undefined;
  accounts: string[] | undefined;
  balance: string | undefined;

  constructor(private cache: CachingService) {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required | here whe import the package necessary to support wallets|| aqui importamos el paquete que nos ayudara a usar soportar distintas wallets
        options: {
          infuraId: 'env', // required change this with your own infura id | cambia esto con tu apikey de infura
          description: 'Scan the qr code and sign in', // You can change the desciption | Puedes camnbiar los textos descriptivos en la seccion description
          qrcodeModalOptions: {
            mobileLinks: [
              'rainbow',
              'metamask',
              'argent',
              'trust',
              'imtoken',
              'pillar',
            ],
          },
        },
      },
      injected: {
        display: {
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          name: 'metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
    };

    this.web3Modal = new Web3Modal({
      network: 'mainnet', // optional change this with the net you want to use like rinkeby etc | puedes cambiar a una red de pruebas o etc
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: 'rgb(39, 49, 56)',
        main: 'rgb(199, 199, 199)',
        secondary: 'rgb(136, 136, 136)',
        border: 'rgba(195, 195, 195, 0.14)',
        hover: 'rgb(16, 26, 32)',
      },
    });
  }

  getSupportedNetworks(): BlockchainNetwork[] {
    return [
      {
        chainId: 137,
        name: 'Polygon Mainnet',
        blockExplorerUrl: 'https://polygonscan.com/',
        rpcUrl: 'https://polygon-rpc.com',
        native: {
          decimals: 18,
          name: 'Polygon',
          symbol: 'MATIC',
        },
      },
      {
        chainId: 1337,
        name: 'Local',
        blockExplorerUrl: '',
        rpcUrl: 'http://127.0.0.1:8545',
        native: {
          decimals: 18,
          name: 'Polygon',
          symbol: 'MATIC',
        },
      },
    ];
  }

  async getNetwork() {
    await this.ensureWeb3Connected();
    return await this.web3js.eth.getChainId();
  }

  async addNetwork(network: BlockchainNetwork) {
    await this.ensureWeb3Connected();
    await (this.web3js.currentProvider as any).request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${network.chainId.toString(16)}`,
          chainName: network.name,
          nativeCurrency: network.native,
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.blockExplorerUrl],
        },
      ],
    });
  }

  async selectNetwork(network: BlockchainNetwork) {
    await this.ensureWeb3Connected();
    await (this.web3js.currentProvider as any).request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${network.chainId.toString(16)}`,
        },
      ],
    });
  }

  async connectAccount() {
    await this.ensureWeb3Connected();
    return this.accounts;
  }

  async accountInfo(account: string): Promise<string> {
    const initialvalue = await this.web3js.eth.getBalance(account);
    this.balance = this.web3js.utils.fromWei(initialvalue, 'ether');
    return this.balance;
  }

  async getNativeBalance(address: string): Promise<string> {
    await this.ensureWeb3Connected();
    return await this.web3js.eth.getBalance(address);
  }

  async signMessage(message: string): Promise<string> {
    await this.ensureWeb3Connected();
    const hash = this.web3js.utils.keccak256(message);
    const sig = await this.web3js.eth.sign(hash, this.accounts[0]);

    return sig;
  }

  disconnectAccount() {
    this.provider = undefined;
    this.web3js = undefined;
    this.accounts = [];
  }

  private async ensureWeb3Connected(): Promise<Web3> {
    if (!this.provider && !this.web3js) {
      this.provider = await this.web3Modal.connect();
      this.web3js = new Web3(this.provider);
      this.accounts = await this.web3js.eth.getAccounts();
    }

    return this.web3js;
  }
}
