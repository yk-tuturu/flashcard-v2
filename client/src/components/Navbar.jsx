// src/components/Navbar.js

import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const MyNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Flashcard-site</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/browse" className='mx-2'>Browse</Nav.Link>
            <Nav.Link href="/create" className='mx-2'>Create</Nav.Link>
            
          </Nav>
          <Nav>
            <Nav.Link href="/account" className='mx-2'>Account</Nav.Link>
            <Nav.Link href="/login" className='mx-2'>Login</Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated Link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;