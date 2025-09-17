import { getZkLoginSignature } from '@mysten/zklogin';

export type ZkLoginSignature = Parameters<typeof getZkLoginSignature>[0]['inputs'];
