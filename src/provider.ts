import { ethers } from 'ethers';
import { all } from './call';
import { getEthBalance } from './calls';
import { ContractCall } from './types';

export class Provider {
  private _provider: ethers.providers.Provider;
  private _multicallAddress: string;

  constructor(provider: ethers.providers.Provider, chainId?: number) {
    this._provider = provider;
    this._multicallAddress = getAddressForChainId(chainId);
  }

  public async init() {
    // Only required if `chainId` was not provided in constructor
    this._multicallAddress = await getAddress(this._provider);
  }

  public getEthBalance(address: string) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.');
    }
    if (!this._multicallAddress) {
      throw new Error('Multicall contract not found.');
    }
    return getEthBalance(address, this._multicallAddress);
  }

  public async all<T extends any[] = any[]>(
    calls: ContractCall[],
    options: ethers.CallOverrides = {}
  ) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.');
    }
    if (!this._multicallAddress) {
      throw new Error('Multicall contract not found.');
    }
    return all<T>(calls, this._multicallAddress, this._provider, options);
  }
}

const multicallAddresses = {
  1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  3: '0xF24b01476a55d635118ca848fbc7Dab69d403be3',
  4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
  5: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
  10: '0x5F2080542ab6ae7e0b06778F0B2d263006297840',
  42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
  56: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
  137: '0xc4f1501f337079077842343Ce02665D8960150B0',
  1284: '0x1E46B649d6651b3892217Dd1EFd2a3e78f4D904B',
  1285: '0x88abAF5961aEfFb40818E9357271b6B819a0BD8B',
  1337: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
  43113: '0x88abAF5961aEfFb40818E9357271b6B819a0BD8B',
  43114: '0x88abAF5961aEfFb40818E9357271b6B819a0BD8B',
  80001: '0x5a0439824F4c0275faa88F2a7C5037F9833E29f1',
};

export function setMulticallAddress(chainId: number, address: string) {
  multicallAddresses[chainId] = address;
}

function getAddressForChainId(chainId: number) {
  return multicallAddresses[chainId];
}

async function getAddress(provider: ethers.providers.Provider) {
  const { chainId } = await provider.getNetwork();
  return getAddressForChainId(chainId);
}
