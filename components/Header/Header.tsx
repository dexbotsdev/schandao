import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import classes from './HeaderSimple.module.css';
import Link from 'next/link';

const links = [
    { link: '/about', label: 'Features' },
    { link: '/pricing', label: 'Pricing' },
    { link: '/learn', label: 'Learn' },
    { link: '/community', label: 'Community' },
];


export function HeaderSimple() {
    const [opened, { toggle }] = useDisclosure(false);

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </a>
    ));

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <MantineLogo size={28} />
                </Group>

                <Group justify="space-between">
                    <Link href="/dashboard" className={classes.link} key={1} >Dashboard</Link>
                    <Link href="/DexApps" className={classes.link} key={2} >DexApps</Link>
                </Group>
                <SignOutButton>
                    <a className={classes.signout} key={5}
                        href={'#'}>SignOut</a>
                </SignOutButton>
            </div>
        </header>
    );
}