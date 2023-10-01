
'use client' 
/* eslint-disable */
import {
   Badge,
  Text,
  Button,
  Tooltip,
  Indicator,
  ActionIcon,
  Container
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'mantine-react-table'; 

import { formatAddress,formatNumberWithSuffix } from '@/utils/FormatNumber';
import Big from 'big.js'; 
import { CopyButton, Group } from '@mantine/core';
import { IconCopy, IconCheck, IconLink, IconClock } from '@tabler/icons-react';
 import { IconFile3d } from '@tabler/icons-react';
import { DurationCounter } from '@/components/Display/DurationCounter';
import { Daum } from '@/Types/Types';

 
 
const TokenSniffer2Page = () => { 
  //data and fetching state
  const [data, setData] = useState<Daum[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });


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

    const tradeLink = "/trade/" + row.tokenAddress;
    const snipeLink = "/snipe/" + row.tokenAddress;

    if (row.totalLiquidityUsdAtLaunch === null) return snipeLink;
    else return tradeLink;
  }

  const getEtherscanAddress = (address: any) => {

    return "https://etherscan.io/address/" + address
  }
  const getDexScreenerLink = (address: any) => {

    return "https://dexscreener.com/ethereum/" + address
  }


  const getSniperStatus = (row: any) => {
    if (row.totalLiquidityUsdAtLaunch === null) {
      return 'NOT LAUNCHED'
    } else
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

    else return { disabled: false, text: winx + 'x', color: 'green' };



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

    ws.onerror = (err) => {
      console.log(err);
    };

    return () => {

      if (ws.readyState === 1) { // <-- This is important
        ws.close();
      }


    };
  }, []);


  const columns = useMemo<MRT_ColumnDef<Daum>[]>(
    () => [
      {
        accessorKey: 'token0Symbol',
        header: 'Symbol',
        Cell: ({ renderedCellValue, row }) => (<Group justify={'flex-start'}>
          <Text fz="xs" fw={700} truncate>{row.original.token0Symbol}</Text>
          <Tooltip label={'Dexscrener'} withArrow position="right">
            <ActionIcon color={'gray'} component='a' href={getDexScreenerLink(row?.original?.poolAddress)} target="_blank"
              rel="noopener noreferrer">
              <IconLink size="1rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Etherscan'} withArrow position="right">
            <ActionIcon color={'gray'} component='a' href={getEtherscanAddress(row?.original?.tokenAddress)} target="_blank"
              rel="noopener noreferrer">
              <IconFile3d size="1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>

        ),
      },
      {
        accessorKey: 'tokenAddress',
        header: 'Address',
        Cell: ({ renderedCellValue, row }) => (
          <div>
            <Group mb='2'>
              <Text fz="xs" fw={700}>{formatAddress(row.original.tokenAddress, 2)}</Text>
              <CopyButton value={row.original.tokenAddress} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                      {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>
        ),
      },
      {
        accessorKey: 'creationDatetime',
        header: 'Time Since',
        Cell: ({ renderedCellValue, row }) => (

          <div className="flex items-center xxs:gap-1">
            <IconClock className="w-5 h-5"  color='blue'/>
            <DurationCounter start={row.original.creationDatetime} />
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price/MC',
        Cell: ({ renderedCellValue, row }) => (
          <>
            <Text fz="xs" fw={700} c="green">
              {row.original.currentPrice ? (
                <Indicator inline processing label={getPLStatus(row.original)?.text}
                  disabled={getPLStatus(row.original)?.disabled}
                  color={getPLStatus(row.original)?.color}
                  size={12}>P: ${formatNumberWithSuffix(row.original.currentPrice, { precision: 4 })}</Indicator>
              ) : (
                <>--</>
              )}
            </Text>
            <Text fz="xs" fw={700} c="red">
              {row.original.marketcap ? (
                <>
                  MC:{' '}
                  <span>
                    ${formatNumberWithSuffix(row.original.marketcap, { precision: 2 })}
                  </span>
                </>
              ) : (
                <>--</>
              )}
            </Text>
          </>
        ),
      },
      {
        accessorKey: 'totalLiquidityUsd',
        header: 'Liquidity',
        Cell: ({ renderedCellValue, row }) => (
          <>
            <Text fz="xs" fw={400} c="white">
              {row.original.totalLiquidityUsd ? (
                <>${formatNumberWithSuffix(row.original.totalLiquidityUsd, { precision: 2 })}</>
              ) : (
                <>--</>
              )}
            </Text>
            <Text fz="xs" fw={700} c="red"> {
              row.original.contractSecurity.buyTax !== null ||
                row.original.contractSecurity.sellTax !== null
                ? `T: ${row.original.contractSecurity.buyTax
                  ? Big(row.original.contractSecurity.buyTax).times(100).toFixed(2)
                  : '-'
                }%|${row.original.contractSecurity.sellTax
                  ? Big(row.original.contractSecurity.sellTax).times(100).toFixed(2)
                  : '-'
                }%`
                : 'Unknown'
            }</Text>
          </>
        ),
      },
      {
        accessorKey: 'contractSecurity.honeypot',
        header: 'Status',
        Cell: ({ renderedCellValue, row }) => (
          <>
            <Badge size="sm" radius="xs" variant="filled"
              color={getStatusColor(row.original.status)}

            >{getSniperStatus(row.original)}</Badge>
            <br />
            {row.original.contractSecurity.honeypot ? <Text fz="xs" fw={700} c="red">HoneyPot</Text> :
              <Text fz="xs" fw={700} c="lime">Not HP</Text>}
          </>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Action',
        Cell: ({ renderedCellValue, row }) => (
          <>
            {getStatusColor(row.original.status) === 'green' ?
              <Button color="green" radius="lg" size="xs"  
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                href={getLinkToTrade(row.original)}
              >
                Snipe
              </Button> : ''}
            {getStatusColor(row.original.status) === 'cyan' ?
              <Button color="orange" radius="lg" size="xs" 
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                href={getLinkToTrade(row.original)}
              >
                Snipe
              </Button> : ''}
          </>
        ),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableBottomToolbar: false,
    enableColumnResizing: false,
    enableColumnVirtualization: false,
    enableGlobalFilterModes: false,
    enablePagination: false,
    enableSorting: true,
    enableFilters: true,
    enablePinning: false,
    enableRowNumbers: false,
    enableTopToolbar: true,
    layoutMode:"semantic",
    enableRowVirtualization: false,
    state: { density: 'xs' },
    paginationDisplayMode: 'default',
    positionToolbarAlertBanner: 'bottom',
    rowCount: rowCount,
    mantinePaginationProps: {
      radius: 'xl',
      size: 'sm',
    },
    mantineTableProps: {
      highlightOnHover: true, 
    },
  });
 

  return (
    <Container fluid> 
         <MantineReactTable table={table} /> 
    </Container>
  );
}


export default TokenSniffer2Page;