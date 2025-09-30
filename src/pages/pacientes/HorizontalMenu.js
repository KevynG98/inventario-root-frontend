// HorizontalMenu.js
import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";

export default function HorizontalMenu({ items = [] }) {
  return (
    <Nav className="bg-light p-2" variant="tabs">
      {items.map((item, i) => (
        <MenuItem key={i} item={item} />
      ))}
    </Nav>
  );
}

function MenuItem({ item }) {
  if (item.children && item.children.length > 0) {
    return (
      <NavDropdown title={item.label} id={`dropdown-${item.label}`}>
        {item.children.map((child, i) =>
          child.children ? (
            <NavDropdown
              key={i}
              title={child.label}
              id={`dropdown-${item.label}-${i}`}
              drop="right" // makes nested open to the right
            >
              {child.children.map((sub, j) => (
                <MenuItem key={j} item={sub} />
              ))}
            </NavDropdown>
          ) : (
            <NavDropdown.Item key={i} href={child.href}>
              {child.label}
            </NavDropdown.Item>
          )
        )}
      </NavDropdown>
    );
  }

  return (
    <Nav.Item>
      <Nav.Link href={item.href}>{item.label}</Nav.Link>
    </Nav.Item>
  );
}
