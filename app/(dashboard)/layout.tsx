'use client'
import { Container, Group, Text } from '@mantine/core';
import { HeaderSimple } from '@/components/Header/Header';
import { useSelectedLayoutSegments } from 'next/navigation'
import { Breadcrumbs, Anchor } from '@mantine/core';
import { IconHomeInfinity, IconHome, IconHomeDot, IconLinkOff, IconExternalLink } from '@tabler/icons-react';
import classes from './DashBoardLayout.module.css';
import { SignInWithMetamaskButton } from "@clerk/nextjs";
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const segments = useSelectedLayoutSegments()

  const items = segments.map((item, index) => (
    index > 0 ? <Anchor href={'/' + item} key={index}>
      <span style={{ textTransform: 'capitalize' }}>{item}</span>
    </Anchor> : <IconHome stroke={1} size={16}  key={index}/>
  )); 
  return (
    <>
    <HeaderMegaMenu />
       <Container fluid className={classes.root}>
        <Group justify="space-between">
          <Breadcrumbs separator=">" mt="xs" className={classes.breadcrumb}>{items}</Breadcrumbs>
            <span><span style={{ textTransform: 'capitalize', textDecoration:'none' }}>Docs</span>
            <Anchor href={'#'} key={22} mt="md" >
            <IconExternalLink stroke={1} size={16} />
          </Anchor></span>
        </Group>
        {children}
      </Container>

    </>
  )
}