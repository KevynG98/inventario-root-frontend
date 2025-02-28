import React from 'react'
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useMyContext } from './Context';
import UcFirst from '../../App/components/UcFirst';
import { FcCancel, FcCheckmark } from "react-icons/fc";
import ModalCreate from './ModalCreate';

export const Products = () => {

  const { data, showModal, deleteProduct, showModalRol, setProduct } = useMyContext();
  
  const editProduct = (product) => {
    setProduct(product);
    setTimeout(showModalRol, 0);
  }

  return (
    <div>
      <h1>Products</h1>
      <Button variant='primary' onClick={() => showModal()}><UcFirst text='Add +' /></Button>
      <ModalCreate />
      <div>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.unit}</td>
                <td>{item.category.name}</td>
                <td>
                  <div>
                    <Button variant='outline-dark' onClick={() => editProduct(item)}><FcCheckmark /></Button>
                    <Button variant='outline-dark' onClick={() => deleteProduct(item.id)}><FcCancel /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
