'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Container, Navbar, NavbarBrand, NavLink, Nav, NavItem } from 'react-bootstrap';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if(status !== "authenticated") {
      router.replace('/');
      return;
    }
  }, []);

  const logout = () => {
    if(status === "authenticated") {
      signOut();
    }
  };

  if(status === "authenticated") {
    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <NavbarBrand href="/">QuickForm</NavbarBrand>
            <Nav className="ms-auto">
              {/* <NavLink href="/dashboard">ダッシュボード</NavLink> */}
              {/* <NavLink href="#home">Home</NavLink> */}
              {/* <NavLink href="#home">Home</NavLink> */}
              <NavItem onClick={logout} style={{color: "#fff", cursor: "pointer"}}><span>ログアウト</span></NavItem>
            </Nav>
          </Container>
        </Navbar>
        <Container className="py-5">
          {children}
        </Container>
      </>
    )
  } else {
    return <></>
  }
}
