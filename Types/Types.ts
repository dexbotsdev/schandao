export interface TokenSnifferResults {
    data: Daum[]
    pagination: Pagination
  }
  
  export interface Daum {
    token0Symbol: string
    token1Symbol: string
    tokenAddress: string
    creationDatetime: string
    price?: string
    marketcap?: string
    totalLiquidityUsd?: string
    totalLiquidityUsdAtLaunch?: string
    ethLiquidity?: string
    contractSecurity: ContractSecurity
    status: string
    listingPrice?: string
    listingMarketcap?: string
    currentPrice?: string
    currentMarketcap?: string
    poolAddress: string
    poolId: string
    hasIcon: boolean
    creationTransactionHash: string
    creationBlockNumber: number
  }
  
  export interface ContractSecurity {
    honeypot?: boolean
    buyTax?: string
    sellTax?: string
    highTaxes?: boolean
    contractVerified: boolean
    contractRenounced: boolean
    lowLiquidity: boolean
    highLiquidity: boolean
  }
  
  export interface Pagination {
    limit: number
    offset: number
    total: number
  }
