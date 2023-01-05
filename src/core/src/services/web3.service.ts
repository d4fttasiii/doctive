import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BN from 'bn.js';
import Web3 from 'web3';
import { SignedTransaction, TransactionConfig } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import { Web3Config } from '../models/config';
import { UtilService } from './util.service';

@Injectable()
export class Web3Service {

    private client: Web3;

    constructor(private configService: ConfigService, private utilsService: UtilService) {
        const cfg = this.configService.get<Web3Config>('web3');
        this.client = new Web3(cfg.url);
    }

    getContractClient(contractAddress: string, ABI: AbiItem): Contract {
        return new this.client.eth.Contract(ABI, contractAddress);
    }

    async buildContractTx(from: string, to: string, data: any): Promise<TransactionConfig> {
        const tx = {
            from: from,
            to: to,
            gas: 300000,
            data: data,
        };
        const gas = await this.client.eth.estimateGas(tx);
        tx.gas = Math.floor(gas * 1.05);

        return tx;
    }

    async buildTx(from: string, to: string, amount: BN): Promise<TransactionConfig> {
        const tx = {
            from: from,
            to: to,
            gas: 300000,
            amount: amount,
        };
        const gas = await this.client.eth.estimateGas(tx);
        tx.gas = Math.floor(gas * 1.05);

        return tx;
    }

    async signTx(tx: TransactionConfig, privateKey: string): Promise<SignedTransaction> {
        return await this.client.eth.accounts.signTransaction(
            tx,
            privateKey,
        );
    }

    async verifySignature(message: string, signature: string, address: string) {
        const hash = this.client.utils.keccak256(message);
        const signer = this.client.eth.accounts.recover(hash, signature, true);

        return signer.toLowerCase() === address.toLowerCase();
    }

    async sendSignedTx(signedTx: SignedTransaction) {
        await this.client.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
}
