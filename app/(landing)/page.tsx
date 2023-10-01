import { Button } from "@mantine/core";
import { UserButton } from "@clerk/nextjs";

 
const HomePage=()=> {
  return (
    <>
     HomePage (UnProtected)
     <Button component="a" href="/dashboard">Dashboard</Button>

     <UserButton afterSignOutUrl="/"/>


    </>
  );
}


export default HomePage;