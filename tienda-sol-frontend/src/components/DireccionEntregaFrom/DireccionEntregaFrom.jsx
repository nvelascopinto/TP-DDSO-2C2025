import React from "react";
import './DireccionEntregaForm.css'
import { InputForm } from "../InputForm/InputForm.jsx";
import { Button, Form, Input, Radio } from 'antd'
import { useState} from "react";

export const DireccionEntregaForm = (({setData})=>{
    
    const [form] = Form.useForm();
     const [isSubmitted, setIsSubmitted] = useState(false);
    const onFinish = ((values)=>{
        setData(values)
         setIsSubmitted(true)
    })
    
    return <div>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    form={form}
                >

                    <Form.Item label="Calle"
                                name="calle"
                                rules={[{ required: true, message: 'Por favor ingresa la calle' }]}>
                        <Input type="text"
                            id="direccionEntrega-calle"
                            placeholder="Ingrese la calle"
                            disabled = {isSubmitted}
                            aria-label="Calle de entrega"
                            aria-required="true"
                            size="large"
                            style={{ width: '50%' }}
                        />
                    </Form.Item>
                   <Form.Item label="Altura"
                                name="altura"
                                 rules={[{ required: true, message: 'Por favor ingresa el número de la calle' }]}>
                        <Input placeholder="Ingrese el número " 
                                type="number"
                                
                                aria-label="Numero de calle destino"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                     <Form.Item label="Piso"
                                name="piso"
                                 rules={[{ required: false}]}>
                        <Input placeholder="Ingrese el piso de su departamento" 
                                type="number"
                                aria-label="Piso"
                               style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    
                                <Form.Item label="Departamento"
                                name="departamento"
                                 rules={[{ required: false}]}>
                        <Input placeholder="Ingrese su departamento" 
                                type="text"
                                aria-label="Departamento"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    <Form.Item label="Codigo Postal"
                                name="codigoPostal"
                                 rules={[{ required: true, message: 'Por favor ingresa el código postal' }]}>
                        <Input placeholder="Ingrese su código postal" 
                                type="number"
                                aria-label="Codigo Postal"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    <Form.Item label="Ciudad"
                                name="ciudad"
                                 rules={[{ required: true, message: 'Por favor ingresa la ciudad' }]}>
                        <Input placeholder="Ingrese su ciudad" 
                                type="text"
                                aria-label="Ciudad"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    <Form.Item label="Provincia"
                                name="provincia"
                                 rules={[{ required: true, message: 'Por favor ingresa la provincia' }]}>
                        <Input placeholder="Ingrese su provincia" 
                                type="text"
                                aria-label="Provincia"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    <Form.Item label="Pais"
                                name="pais"
                                 rules={[{ required: true, message: 'Por favor ingresa el pais' }]}>
                        <Input placeholder="Ingrese su pais" 
                                type="text"
                                aria-label="Pais"
                                style={{ width: '50%' }}
                                disabled={isSubmitted}
                                size="large"
                                
                                />
                    </Form.Item>
                    
                    {!isSubmitted && (
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large">
                                Guardar Dirección
                            </Button>
                        </Form.Item>
                    )}

                    {isSubmitted && (
                        <Form.Item>
                            <Button 
                                type="default" 
                                onClick={() => setIsSubmitted(false)}
                                size="large"
                            >
                                Editar Dirección
                            </Button>
                        </Form.Item>
                    )}
                                
                </Form>
           </div>
})