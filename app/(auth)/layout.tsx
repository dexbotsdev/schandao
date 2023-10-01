import classes from './AuthLayout.module.css';
import { Title, Text, Button, Container, Group } from '@mantine/core';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container className={classes.root}> 
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text> 
      {children}</Container>

  )
}