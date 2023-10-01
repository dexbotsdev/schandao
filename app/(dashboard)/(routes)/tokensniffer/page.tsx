
'use client' 
import React, { useEffect, useState } from 'react'; 
import { Button, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table'; 
import { Daum } from "@/Types/Types";
import { DurationCounter } from '@/components/Display/DurationCounter';
import { ClockHour2,CurrencyEthereum,BuildingWarehouse, CurrencyDogecoin,PlaneTilt } from 'tabler-icons-react';
import { formatNumberWithSuffix } from '@/utils/FormatNumber';
import Big from 'big.js';
import { ConfigProvider,   theme } from 'antd';
import { ActionIcon, Badge, Card ,Group,Text} from '@mantine/core';
import { IconFile3d, IconLink } from '@tabler/icons-react';
 
const TokenSnifferPage = () => {
    const [data, setData] = useState<Daum[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
  
    const getStatusColor = (item: any) => {
  
      switch (item) {
        case 'RUG_PULL': return 'red';
        case 'NOT_SNIPEABLE': return 'cyan';
        case 'SNIPEABLE': return 'green';
      }
    }
  
    const getStatus = (item: any) => {
  
      switch (item) {
        case 'RUG_PULL': return 'RugPull';
        case 'NOT_SNIPEABLE': return 'Trading';
        case 'SNIPEABLE': return 'Launch Wait';
      }
    }
  
    const getLinkToTrade = (row: any) => {
  
      const tradeLink = "/trade/"+row.tokenAddress;
      const snipeLink = "/snipe/"+row.tokenAddress;
  
      if(row.totalLiquidityUsdAtLaunch === null ) return snipeLink;
      else return tradeLink;
    } 
  
    const getEtherscanAddress = (address: any) => {
  
      return "https://etherscan.io/address/" + address
    }
    const getDexScreenerLink = (address: any) => {
  
      return "https://dexscreener.com/ethereum/" + address
    }
  
    const getSniperStatus = (row: any) => {
      if (row.totalLiquidityUsdAtLaunch === null){
        return 'NOT LAUNCHED'
      }else 
      if (row.marketcap && row.totalLiquidityUsd && !row.contractSecurity.honeypot && row.status !== 'RUG_PULL') {
        return 'LAUNCHED'
      } else if (!row.marketcap && !row.totalLiquidityUsd && !row.contractSecurity.honeypot && row.status !== 'RUG_PULL') {
        return 'NOT LAUNCHED'
  
      } else return 'AVOID'
  
    }
  
    const getPLStatus = (row: any): { disabled: boolean, text: string, color: string } => {
  
  
      if (getSniperStatus(row) === 'AVOID' || row.listingPrice === null) return { disabled: true, text: '', color: 'red' };
  
      const curr = row.currentPrice;
      const list = row.listingPrice;
  
      const winx = Number(Number(curr) / Number(list)).toFixed(1);
      const winp = Number((100 * (Number(curr) - Number(list)) / Number(list))).toFixed(1);
  
      if (Number(winp) < 0) return { disabled: false, text: winp + '%', color: 'red' };
      else if (Number(winp) > 0 && Number(winp) < 100) return { disabled: false, text: winp + '%', color: 'green' };
  
      else return { disabled: false, text: '+'+winx + 'x', color: 'green' };
  
  
  
    }
  
  
    useEffect(() => {
      const ws = new WebSocket("wss://mevws.onrender.com");
      ws.onopen = () => {
        console.log("Connection Established!");
      };
      ws.onmessage = (event) => {
  
        try {
          const data = JSON.parse(event.data) as Daum[];
  
          if (!data.length) {
            setIsLoading(true);
          } else {
            setIsRefetching(true);
          }
          setData(data);
          setRowCount(data.length);
          console.log(data);
          setIsError(false);
          setIsLoading(false);
          setIsRefetching(false);
        } catch (err) {
  
        }
  
      };
      ws.onclose = () => {
        console.log("Connection Closed!");
        //initWebsocket();
      };
  
      ws.onerror = () => {
        console.log("WS Error");
      };
  
      return () => {
        ws.close();
      };
    }, []);
  
   
    const columns: ColumnsType<Daum> =[
      {
        title: 'Symbol',
        dataIndex: 'token0Symbol',
        render: (_, record) => (
            <Group>
            <Text fz="xs" fw={700} truncate>{record.token0Symbol}</Text>
            <Tooltip title={'Dexscrener'}>
              <ActionIcon color={'gray'} component='a' href={getDexScreenerLink(record.poolAddress)} target="_blank"
                rel="noopener noreferrer">
                <IconLink size="1rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip title={'Etherscan'}>
              <ActionIcon color={'gray'} component='a' href={getEtherscanAddress(record.tokenAddress)} target="_blank"
                rel="noopener noreferrer">
                <IconFile3d size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
      {
        title: 'TimeAgo',
        dataIndex: 'creationDatetime',
        render: (_, record) => (
          <><ClockHour2
          size={22}
          strokeWidth={1.5}
          color={'#4094bf'}
        /><DurationCounter start={record.creationDatetime} /></>
        ),
      },
      {
        title: 'Price/MC',
        dataIndex: 'creationDatetime',
        render: (_, record) => (
          <><CurrencyDogecoin
          size={22}
          strokeWidth={1.5}
          color={'#4094bf'}
        /><strong> $ {formatNumberWithSuffix(Number(record.price), { precision: 4 })}</strong>
         <span style={{color:`${getPLStatus(record).color}`, fontWeight:"600"}}>  {getPLStatus(record).text}</span>
        
        <br/>
        
        <BuildingWarehouse
          size={22}
          strokeWidth={1.5}
          color={'#4094bf'}
        /><strong> $ {formatNumberWithSuffix(Number(record.marketcap), { precision: 2 })}</strong>
         
        </>
        ),
      },
      {
        title: 'PoolAmount',
        dataIndex: 'ethLiquidity',
        render: (_, record) => (
            <><CurrencyEthereum
          size={22}
          strokeWidth={1.5}
          color={'#4094bf'}
        />{formatNumberWithSuffix(Number(record.ethLiquidity), { precision: 2 })}</>  
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (_, record) => (
            <>
            <Badge size="sm" radius="xs" variant="filled"
              color={getStatusColor(record.status)}

            >{getSniperStatus(record)}</Badge>
            <br />
            {record.contractSecurity.honeypot ? <Text fz="xs" fw={700} c="red">HoneyPot</Text> :
              <Text fz="xs" fw={700} c="lime">Not HP</Text>}
          </>
        ),
      },
      {
        title: 'LP/Taxes',
        dataIndex: 'tax',
        render: (_, record) => (
            <>
            <Text fz="xs" fw={400} c="white">
              {record.totalLiquidityUsd ? (
                <>${formatNumberWithSuffix(record.totalLiquidityUsd, { precision: 2 })}</>
              ) : (
                <>--</>
              )}
            </Text>
            <Text fz="xs" fw={700} c="red"> {
              record.contractSecurity.buyTax !== null ||
              record.contractSecurity.sellTax !== null
                ? `T: ${record.contractSecurity.buyTax
                  ? Big(record.contractSecurity.buyTax).times(100).toFixed(2)
                  : '-'
                }%|${record.contractSecurity.sellTax
                  ? Big(record.contractSecurity.sellTax).times(100).toFixed(2)
                  : '-'
                }%`
                : 'Unknown'
            }</Text>
          </> 
        ),
      },
      {
        title: 'Action',
        dataIndex: 'a',
        render:(_,record)=>(
          <>
              {getStatusColor(record.status) === 'green' ?
                <Button type="primary" size={'small'}
                  rel="noopener noreferrer"  
                  href={getLinkToTrade(record)}
                >
                  Snipe
                </Button> : ''}
                {getStatusColor(record.status) === 'cyan' ?
                <Button type="primary"   size={'small'}
                  rel="noopener noreferrer" danger
                  href={getLinkToTrade(record)}
                >
                  Snipe
                </Button> : ''}
            </>
        )
      },  
    ]
  return (
    <Card  > 
      <Text fz="sm" fw={700} mb="md" >
      Find New Sniping Opportunities
      </Text>
    <ConfigProvider
    theme={{
      // 1. Use dark algorithm
      algorithm: theme.darkAlgorithm,

      // 2. Combine dark algorithm and compact algorithm
      // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }}
  >
       <Table columns={columns} dataSource={data} size={'small'} bordered   />
       </ConfigProvider>
    </Card>
  );
}


export default TokenSnifferPage;