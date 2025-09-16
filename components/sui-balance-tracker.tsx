"use client";

import {
  useCurrentAccount,
  useSuiClientQuery,
  useDisconnectWallet,
  ConnectButton,
  useSuiClient,
  useCurrentWallet
} from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LogOut,
  Wallet,
  ExternalLink,
  RefreshCw,
  ArrowRightLeft,
  BookUser,
  Image as ImageIcon,
  ArrowDownUp,
  Info,
  Calendar,
  User,
  BarChart2,
  PieChart,
  Copy,
  Check
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import type { SuiObjectResponse, CoinMetadata, SuiObjectData } from "@mysten/sui.js/client";
import { useZkLogin } from "@/hooks/use-zklogin";
import { ZkLoginAccount } from "@/hooks/use-zklogin";

const SUI_COIN_TYPE = "0x2::sui::SUI";

const GoogleLogo = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

const SuiLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.4285 4.28821C16.4285 4.28821 17.1428 5.71429 15 5.71429C12.8571 5.71429 12.1428 4.28571 12.1428 4.28571C12.1428 4.28571 11.4285 2.85714 13.5714 2.85714C15.7143 2.85714 16.4285 4.28821 16.4285 4.28821Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M16.4285 19.7118C16.4285 19.7118 17.1428 18.2857 15 18.2857C12.8571 18.2857 12.1428 19.7143 12.0001 19.7143C12.0001 19.7143 12.7144 21.1429 10.5715 21.1429C8.42866 21.1429 7.7144 19.7118 7.7144 19.7118Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M7.7144 19.7118C7.7144 19.7118 7.00012 18.2857 9.14298 18.2857C11.2858 18.2857 12.0001 19.7143 12.0001 19.7143C12.0001 19.7143 12.7144 21.1429 10.5715 21.1429C8.42866 21.1429 7.7144 19.7118 7.7144 19.7118Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M12.1428 12C12.1428 12 11.4285 10.5714 13.5714 10.5714C15.7143 10.5714 16.4285 12 16.4285 12C16.4285 12 17.1428 13.4286 15 13.4286C12.8571 13.4286 12.1428 12 12.1428 12Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M5.57143 5.71429C3.42857 5.71429 2.85714 4.28571 2.85714 4.28571C2.85714 4.28571 3.57143 2.85714 5.57143 2.85714C7.57143 2.85714 8.28571 4.28571 8.28571 4.28571C8.28571 5.71429 6.85714 5.71429 5.57143 5.71429Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M8.28571 9.71429C8.28571 8.28571 7.57143 7.14286 5.57143 7.14286C3.57143 7.14286 2.85714 8.28571 2.85714 9.71429C2.85714 11.1429 3.57143 12.4286 5.57143 12.4286C7.57143 12.4286 8.28571 11.1429 8.28571 9.71429Z"
      fill="hsl(var(--primary))"
    />
    <path
      d="M9.14286 15.1429C8.42857 14.1429 7.42857 13.4286 5.57143 13.4286C3.71429 13.4286 2.85714 14.2857 2.85714 15.2857C2.85714 16.2857 3.71429 17.5714 5.57143 17.5714C7.42857 17.5714 8.42857 16.5714 9.14286 15.1429Z"
      fill="hsl(var(--primary))"
    />
  </svg>
);

function formatAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type CoinData = CoinMetadata & {
  balance: number;
  coinType: string;
};

type OnChainData = {
    creator: string | null;
    creationDate: string | null;
}

function CoinBalanceRow({ coin, onSelect }: { coin: CoinData; onSelect: () => void }) {
  return (
    <div 
        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={onSelect}
    >
        <div className="flex items-center gap-3">
        {coin.iconUrl ? (
            <img
            src={coin.iconUrl}
            alt={coin.name}
            className="h-8 w-8 rounded-full"
            />
        ) : (
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
            </div>
        )}
        <div>
            <span className="font-medium">{coin.name}</span>
            <p className="text-sm text-muted-foreground">{coin.symbol}</p>
        </div>
        </div>
        <div className="text-right">
        <span className="font-bold tracking-tight">
            {(coin.balance / 10 ** coin.decimals).toFixed(Math.min(4, coin.decimals))}
        </span>
        </div>
    </div>
  );
}

function CoinsList({ account }: { account: ZkLoginAccount }) {
    const client = useSuiClient();
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortMethod, setSortMethod] = useState("default");
    const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [priceData, setPriceData] = useState<{ price: number | null }>({ price: null });
    const [isPriceLoading, setIsPriceLoading] = useState(false);
    
    const [onChainData, setOnChainData] = useState<OnChainData>({ creator: null, creationDate: null });
    const [isOnChainLoading, setIsOnChainLoading] = useState(false);

    const { data: allBalances, refetch: refetchBalances, isPending: isBalancesPending, error: balancesError } = useSuiClientQuery(
        "getAllBalances",
        { owner: account!.address },
        { enabled: !!account }
    );

    const fetchCoinData = useCallback(async () => {
        if (!allBalances) return;

        setIsLoading(true);
        setError(null);
        try {
            const coinDataPromises = allBalances.map(async (balance) => {
                const metadata = await client.getCoinMetadata({ coinType: balance.coinType });
                return {
                    ...(metadata || { name: 'Unknown Coin', symbol: '???', description: '', decimals: 0, iconUrl: null }),
                    coinType: balance.coinType,
                    balance: Number(balance.totalBalance),
                };
            });
            const settledPromises = await Promise.allSettled(coinDataPromises);
            const coinData = settledPromises
                .filter(p => p.status === 'fulfilled')
                .map(p => (p as PromiseFulfilledResult<CoinData>).value);
            
            setCoins(coinData);
        } catch (err) {
            console.error("Error fetching coin metadata:", err);
            setError("Failed to fetch all coin details.");
        } finally {
            setIsLoading(false);
        }
    }, [allBalances, client]);
    
    useEffect(() => {
        if (account && allBalances) {
            fetchCoinData();
        } else if (balancesError) {
            setError("Failed to fetch balances.");
            setIsLoading(false);
        }
    }, [account, allBalances, balancesError, fetchCoinData]);

    const fetchPriceData = useCallback(async (coin: CoinData) => {
        if (!coin) return;
        setIsPriceLoading(true);
        setPriceData({ price: null });

        const symbolToId: { [key: string]: string } = {
            'SUI': 'sui', 'USDC': 'usd-coin', 'USDT': 'tether', 'WETH': 'weth',
        };
        const coinId = symbolToId[coin.symbol.toUpperCase()];
        
        if (coinId) {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                if (response.ok) {
                    const data = await response.json();
                     setPriceData({
                        price: data.market_data?.current_price?.usd,
                    });
                }
            } catch (error) {
                console.warn("CoinGecko fetch failed:", error);
            }
        }
        
        setIsPriceLoading(false);
    }, []);

    const fetchOnChainData = useCallback(async (coinType: string) => {
        setIsOnChainLoading(true);
        setOnChainData({ creator: null, creationDate: null });
        try {
            const packageId = coinType.split('::')[0];
            if (!packageId || packageId === '0x2') { // Skip for native SUI
                setOnChainData({ creator: "Sui Foundation", creationDate: "N/A" });
                return;
            };

            const packageObject = await client.getObject({
                id: packageId,
                options: { showOwner: true },
            });
            
            const owner = packageObject.data?.owner;
            let creatorAddress: string | null = null;
            if (owner && typeof owner === 'object' && 'AddressOwner' in owner) {
                creatorAddress = owner.AddressOwner;
            } else if (typeof owner === 'string') {
                 creatorAddress = owner;
            }

            const txs = await client.queryTransactionBlocks({
                filter: { ChangedObject: packageId },
                order: 'ascending',
                limit: 1
            });

            let creationDate: string | null = null;
            if (txs.data.length > 0 && txs.data[0].timestampMs) {
                creationDate = new Date(Number(txs.data[0].timestampMs)).toLocaleDateString();
            }

            setOnChainData({ creator: creatorAddress, creationDate: creationDate });

        } catch (error) {
            console.error("Failed to fetch on-chain data:", error);
        } finally {
            setIsOnChainLoading(false);
        }
    }, [client]);

    const handleCoinClick = (coin: CoinData) => {
        setSelectedCoin(coin);
        fetchPriceData(coin);
        fetchOnChainData(coin.coinType);
        setIsDialogOpen(true);
    };
    
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedCoin(null);
        }
    }

    const sortedCoins = useMemo(() => {
    let sorted = [...coins];
    if (sortMethod === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMethod === "balance") {
      sorted.sort((a, b) => b.balance - a.balance);
    } else {
      // Default: SUI first, then by balance
      sorted.sort((a, b) => {
        if (a.coinType === SUI_COIN_TYPE) return -1;
        if (b.coinType === SUI_COIN_TYPE) return 1;
        return b.balance - a.balance;
      });
    }
    return sorted;
  }, [coins, sortMethod]);
  
  const handleRefresh = useCallback(() => {
      refetchBalances().then(() => {
          if (allBalances) {
              fetchCoinData();
          }
      });
  }, [refetchBalances, allBalances, fetchCoinData]);

  const isDataLoading = isLoading || isBalancesPending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold">Your Coins</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowDownUp className="h-4 w-4" />
                  <span>
                    Sort by: {sortMethod.charAt(0).toUpperCase() + sortMethod.slice(1)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortMethod("default")}>
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod("balance")}>
                  Balance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8"
              disabled={isDataLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isDataLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh balances</span>
            </Button>
          </div>
        </div>

        {isDataLoading ? (
          <div className="space-y-2 p-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try again
            </Button>
          </div>
        ) : sortedCoins.length > 0 ? (
          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto px-1">
            {sortedCoins.map((coin) => (
                <CoinBalanceRow key={coin.coinType} coin={coin} onSelect={() => handleCoinClick(coin)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-8">
            No coins found in your wallet.
          </p>
        )}
      </div>

      {selectedCoin && (
        <DialogContent className="max-w-md">
            <DialogHeader className="items-center text-center">
                 <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center my-4">
                    {selectedCoin.iconUrl ? (
                        <img src={selectedCoin.iconUrl} alt={selectedCoin.name} className="h-12 w-12 rounded-full" />
                    ) : (
                        <Wallet className="h-10 w-10 text-primary" />
                    )}
                 </div>
                <DialogTitle className="text-2xl">{selectedCoin.name}</DialogTitle>
                <DialogDescription className="text-base">
                    {selectedCoin.description || 'No description available.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg col-span-2">
                    <span className="text-muted-foreground">Price</span>
                    {isPriceLoading ? <Skeleton className="h-6 w-24 ml-auto" /> : 
                        priceData.price !== null && priceData.price !== undefined ? (
                            <span className="font-bold text-lg ml-auto">
                                ${priceData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </span>
                        ) : <span className="text-muted-foreground ml-auto">Not available</span>
                    }
                </div>
                
                {(priceData.price === null || priceData.price === undefined) && !isPriceLoading && (
                  <div className="col-span-2 text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                    Market data not available. For more details, click the Suiscan button below.
                  </div>
                )}
                
                <div className="flex items-center justify-between col-span-2 pt-2 border-t mt-2">
                    <span className="text-muted-foreground flex items-center gap-1"><User className="h-4 w-4"/> Creator</span>
                    {isOnChainLoading ? <Skeleton className="h-5 w-2/5" /> :
                        onChainData.creator ? 
                        (onChainData.creator === 'Immutable' || onChainData.creator === 'Shared' ? 
                            <span className="text-xs">{onChainData.creator}</span> :
                            <span className="font-mono text-xs">{formatAddress(onChainData.creator)}</span>
                        ) :
                        <span className="text-muted-foreground text-xs">Not available</span>
                    }
                </div>
                
                 <div className="flex items-center justify-between col-span-2">
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4"/> Creation Date</span>
                     {isOnChainLoading ? <Skeleton className="h-5 w-1/4" /> :
                        onChainData.creationDate ? 
                        <span className="text-xs">{onChainData.creationDate}</span> :
                        <span className="text-muted-foreground text-xs">Not available</span>
                    }
                </div>

                <div className="flex items-center justify-between col-span-2">
                    <span className="text-muted-foreground">Coin Type</span>
                    <span className="font-mono text-xs">{formatAddress(selectedCoin.coinType)}</span>
                </div>
                <Button asChild variant="outline" className="col-span-2">
                    <Link href={`https://suiscan.xyz/mainnet/coin/${selectedCoin.coinType}`} target="_blank">
                       View on Suiscan <ExternalLink className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function NftGallery({ account }: { account: ZkLoginAccount }) {
    const [selectedNft, setSelectedNft] = useState<SuiObjectResponse | null>(null);

    const { data: nfts, isLoading, error, refetch } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: account!.address,
            filter: {
                MatchNone: [{ StructType: '0x2::coin::Coin' }],
            },
            options: {
                showDisplay: true,
                showType: true,
                showContent: true,
            },
        },
        {
            enabled: !!account,
            select: (data) => data.data.filter((obj) => !!obj.data?.display?.data),
        }
    );

    const handleRefresh = () => {
        if (account) {
            refetch();
        }
    };
    
    function getImageUrl(display: any): string {
      const url = display?.data?.image_url || display?.data?.img_url || '';
      if (typeof url !== 'string') return '';
      
      if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      if (url.includes('walrus.cool')) {
        return url;
      }

      if (url.startsWith('http')) {
        return url;
      }
      
      return '';
    }


  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        <p>Failed to fetch NFTs.</p>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
          Try again
        </Button>
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No NFTs found in your wallet.</p>
      </div>
    );
  }

  const selectedDisplayData = selectedNft?.data?.display?.data;
  const selectedImageUrl = selectedNft ? getImageUrl(selectedNft.data?.display) : '';

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedNft(null)}>
        <div className="max-h-[450px] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {nfts.map((nft: SuiObjectResponse) => {
                    const displayData = nft.data?.display?.data;
                    if (!displayData) return null;

                    const imageUrl = getImageUrl(nft.data?.display);
                    
                    return (
                        <DialogTrigger asChild key={nft.data?.objectId} onClick={() => setSelectedNft(nft)}>
                            <div className="group cursor-pointer">
                                <Card className="overflow-hidden">
                                    <div className="aspect-square bg-muted flex items-center justify-center">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={displayData.name || 'NFT'}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                data-ai-hint="nft image"
                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x300.png')}
                                            />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="font-semibold text-sm truncate">{displayData.name || 'Unnamed NFT'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{displayData.description || 'No description'}</p>
                                    </div>
                                </Card>
                            </div>
                        </DialogTrigger>
                    );
                })}
            </div>
        </div>

        {selectedNft && selectedDisplayData && (
             <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="aspect-square relative w-full rounded-lg overflow-hidden my-4">
                        {selectedImageUrl ? (
                            <img src={selectedImageUrl} alt={selectedDisplayData.name || 'NFT'} className="w-full h-full object-cover" />
                        ) : (
                            <div className="bg-muted w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <DialogTitle className="text-2xl">{selectedDisplayData.name || 'Unnamed NFT'}</DialogTitle>
                    <DialogDescription className="text-base">
                        {selectedDisplayData.description || 'No description available.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Object ID</span>
                        <span className="font-mono text-xs">{formatAddress(selectedNft.data!.objectId)}</span>
                    </div>
                     <Button asChild variant="outline">
                        <Link href={`https://suiscan.xyz/mainnet/object/${selectedNft.data!.objectId}`} target="_blank">
                           View on Suiscan <ExternalLink className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        )}
    </Dialog>
  );
}

function TransactionHistory({ account }: { account: ZkLoginAccount }) {
    const { data, isLoading, error, refetch } = useSuiClientQuery(
        "queryTransactionBlocks",
        {
            filter: { FromAddress: account!.address },
            order: 'descending',
            limit: 20,
            options: { showEffects: true, showInput: true },
        },
        { enabled: !!account }
    );
    
    const handleRefresh = () => {
        refetch();
    };


    if (isLoading) {
        return <div className="space-y-2 p-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
    }

    if (error) {
        return <div className="text-center text-destructive p-4">
            <p>Error fetching transactions.</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">Try again</Button>
        </div>
    }

    return (
         <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8" disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh history</span>
                </Button>
            </div>
            {data && data.data.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto px-1">
                    {data.data.map((tx) => (
                        <div key={tx.digest} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                            <div className="bg-primary/20 p-2 rounded-full">
                                <ArrowRightLeft className="h-5 w-5 text-primary"/>
                            </div>
                            <div className="flex-grow">
                                <p className="font-mono text-sm">{formatAddress(tx.digest)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(Number(tx.timestampMs)).toLocaleString()}</p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={`https://suiscan.xyz/mainnet/tx/${tx.digest}`} target="_blank">
                                    <ExternalLink className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-muted-foreground text-center p-8">No transactions found.</p>
            )}
        </div>
    )
}

function WalletDashboard({
  account,
  onDisconnect,
}: {
  account: ZkLoginAccount;
  onDisconnect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wallet className="h-5 w-5 text-accent" />
          <span>{formatAddress(account.address)}</span>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">{copied ? 'Copied' : 'Copy address'}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={onDisconnect} variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" /> <span>Disconnect</span>
            </Button>
        </div>
      </div>
      <Tabs defaultValue="coins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coins">
            <BookUser className="mr-2 h-4 w-4" />
            Coins
          </TabsTrigger>
          <TabsTrigger value="nfts">
            <ImageIcon className="mr-2 h-4 w-4" />
            NFTs
          </TabsTrigger>
          <TabsTrigger value="history">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="coins">
          <CoinsList account={account} />
        </TabsContent>
        <TabsContent value="nfts">
          <NftGallery account={account} />
        </TabsContent>
        <TabsContent value="history">
          <TransactionHistory account={account}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function SuiBalanceTracker() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { zkLoginAccount, login, logout, isLoading } = useZkLogin();

  const currentAccount = account || zkLoginAccount;

  const handleDisconnect = () => {
    if (account) {
      disconnect();
    }
    if (zkLoginAccount) {
      logout();
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <SuiLogo />
          <CardTitle className="text-3xl font-headline tracking-tight">
            SUI Mini Wallet
          </CardTitle>
        </div>
        <CardDescription>
          Connect your SUI wallet or sign in with Google to see your balances, NFTs, and transaction
          history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentAccount ? (
          <WalletDashboard account={currentAccount} onDisconnect={handleDisconnect} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
            <Wallet className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">Your wallet is not connected.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ConnectButton connectText="Connect SUI Wallet" />
              <Button onClick={() => login('google')} disabled={isLoading} variant="outline">
                <GoogleLogo />
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="https://docs.sui.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          SUI Documentation <ExternalLink className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
    
