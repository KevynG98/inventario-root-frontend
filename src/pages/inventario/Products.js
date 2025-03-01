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
      <h1>Inventario</h1>
      {/* <Button variant='primary' onClick={() => showModal()}><UcFirst text='Add +' /></Button> */}
      <ModalCreate />
      <div>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>quantity</th>
              <th>warehouse_location</th>
              <th>status</th>
              <th>product</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.quantity}</td>
                <td>{item.warehouse_location}</td>
                <td>{item.status}</td>
                <td>{item.product}</td>
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
