import React from "react";
import { Button, Form, Input, Row, Col } from 'antd'
import { useState } from "react";

export const DireccionEntregaForm = (({setData, onFormValidChange})=>{ 
    
    const [form] = Form.useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const onFinish = ((values)=>{
        setData(values)
        setIsSubmitted(true)
        if (onFormValidChange) {
            onFormValidChange(true); // es para checkear el botón comprar ;)
        }
    })
    
    const handleEdit = () => {
        setIsSubmitted(false);
        if (onFormValidChange) {
            onFormValidChange(false); // es para checkear el botón comprar ;) x2
        }
    }
    
    return <div aria-label="Formulario de dirección de entrega"> 
        <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            aria-label="Datos de dirección de entrega"
        >
            <Row gutter={16}>
                <Col xs={24} sm={16}>
                    <Form.Item 
                        label="Calle"
                        name="calle"
                        rules={[{ required: true, message: 'Por favor ingresa la calle' }]}
                    >
                        <Input 
                            type="text"
                            id="direccionEntrega-calle"
                            placeholder="Ingrese la calle"
                            disabled={isSubmitted}
                            aria-label="Calle de entrega"
                            aria-required="true"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item 
                        label="Altura"
                        name="altura"
                        rules={[{ required: true, message: 'Ingresa el número' }]}
                    >
                        <Input 
                            placeholder="Número" 
                            type="number"
                            aria-label="Numero de calle destino"
                            aria-required="true"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="Piso"
                        name="piso"
                        rules={[{ required: false }]}
                    >
                        <Input 
                            placeholder="Piso" 
                            type="number"
                            aria-label="Piso"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="Departamento"
                        name="departamento"
                        rules={[{ required: false }]}
                    >
                        <Input 
                            placeholder="Depto" 
                            type="text"
                            aria-label="Departamento"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="Código Postal"
                        name="codigoPostal"
                        rules={[{ required: true, message: 'Ingresa el código postal' }]}
                    >
                        <Input 
                            placeholder="Código postal" 
                            type="number"
                            aria-required="true"
                            aria-label="Codigo Postal"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="Ciudad"
                        name="ciudad"
                        rules={[{ required: true, message: 'Ingresa la ciudad' }]}
                    >
                        <Input 
                            placeholder="Ciudad" 
                            type="text"
                            aria-label="Ciudad"
                            aria-required="true"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="Provincia"
                        name="provincia"
                        rules={[{ required: true, message: 'Ingresa la provincia' }]}
                    >
                        <Input 
                            placeholder="Provincia" 
                            type="text"
                            aria-required="true"
                            aria-label="Provincia"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item 
                        label="País"
                        name="pais"
                        rules={[{ required: true, message: 'Ingresa el país' }]}
                    >
                        <Input 
                            placeholder="País" 
                            type="text"
                            aria-label="Pais"
                            aria-required="true"
                            disabled={isSubmitted}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>
            
            {!isSubmitted && (
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
                        Guardar Dirección
                    </Button>
                </Form.Item>
            )}

            {isSubmitted && (
                <Form.Item>
                    <Button 
                        type="default" 
                        onClick={handleEdit}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        Editar Dirección
                    </Button>
                </Form.Item>
            )}
                        
        </Form>
    </div>
})