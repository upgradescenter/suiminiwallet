
'use client';

import {useState, useEffect, useRef} from 'react';
import {jwtDecode} from 'jwt-decode';
import {generateNonce, generateRandomness, getZkLoginSignature} from '@mysten/zklogin';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {SuiClient} from '@mysten/sui.js/client';
import {toBigIntBE} from 'bigint-buffer';

const PROVER_URL = '/api/zk/proof'; // Using a local mock for the prover
const suiClient = new SuiClient({url: 'https://fullnode.mainnet.sui.io:443'});

interface UserInfo {
  jwt: string;
  salt: string;
}

export interface ZkLoginAccount {
  provider: 'google'; // For now, only Google is supported
  userAddr: string;
  jwt: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
  address: string;
}

const getSalt = async (subject: string): Promise<string> => {
  // In a real app, this would be a call to a server to get the user's salt.
  // For this demo, we'll use a local service.
  const response = await fetch('/api/zk/salt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({subject}),
  });
  const {salt} = await response.json();
  return salt;
};

export const useZkLogin = () => {
  const [zkLoginAccount, setZkLoginAccount] = useState<ZkLoginAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nonce = useRef<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const jwt_token = hash.get('id_token');

    if (jwt_token) {
      handleLoginSuccess(jwt_token);
    }
  }, []);

  const handleLoginSuccess = async (jwt: string) => {
    setIsLoading(true);
    try {
      const decodedJwt: {sub: string; aud: string; nonce: string} = jwtDecode(jwt);

      const salt = await getSalt(decodedJwt.sub);

      const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
        Buffer.from(window.localStorage.getItem('ephemeralSecretKey')!, 'hex')
      );
      
      const {userAddr} = await fetch(PROVER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jwt,
          extended_ephemeral_public_key: toBigIntBE(
            Buffer.from(ephemeralKeyPair.getPublicKey().toSuiBytes())
          ).toString(),
          max_epoch: 2, // This should be configured based on your needs
          jwt_randomness: window.localStorage.getItem('randomness'),
          salt,
          key_claim_name: 'sub',
        }),
      }).then((res) => res.json());

      const account: ZkLoginAccount = {
        provider: 'google',
        userAddr,
        jwt: jwt,
        ephemeralPublicKey: ephemeralKeyPair.getPublicKey().toBase64(),
        ephemeralPrivateKey: Buffer.from(ephemeralKeyPair.getSecretKey()).toString('hex'),
        userSalt: salt,
        sub: decodedJwt.sub,
        aud: decodedJwt.aud,
        maxEpoch: 2,
        address: userAddr,
      };

      setZkLoginAccount(account);
      localStorage.setItem('zkLoginAccount', JSON.stringify(account));
    } catch (error) {
      console.error('Failed to process zkLogin:', error);
    } finally {
      setIsLoading(false);
      window.location.hash = ''; // Clear the hash from the URL
    }
  };

  const login = async (provider: 'google') => {
    setIsLoading(true);

    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    nonce.current = generateNonce(ephemeralKeyPair.getPublicKey(), 2, randomness);

    // Slice the secret key to get the first 32 bytes
    const secretKeyBytes = ephemeralKeyPair.getSecretKey().slice(0, 32);

    localStorage.setItem(
      'ephemeralSecretKey',
      Buffer.from(secretKeyBytes).toString('hex')
    );
    localStorage.setItem('randomness', randomness.toString());

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: window.location.origin,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce: nonce.current,
    });

    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    window.location.href = loginUrl;
  };

  const logout = () => {
    setZkLoginAccount(null);
    localStorage.removeItem('zkLoginAccount');
    localStorage.removeItem('ephemeralSecretKey');
    localStorage.removeItem('randomness');
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem('zkLoginAccount');
    if (storedAccount) {
      setZkLoginAccount(JSON.parse(storedAccount));
    }
  }, []);

  return {zkLoginAccount, login, logout, isLoading};
};
