import React, { useState, useEffect } from 'react';
import { Moneda } from '../../../enums.js';
import Button from '../Button/Button.jsx';
import './ProductForm.css';
import {CATEGORIAS} from '../../../enums.js';

const ProductForm = ({ onSubmit, onCancel, initialData }) => {
    const [id, setId] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [moneda, setMoneda] = useState(Moneda.DOLAR_USA);
    const [fotos, setFotos] = useState([]);
    const [activo, setActivo] = useState(true);
    const [categoria, setCategoria] = useState('');
    const [cargando, setCargando] = useState(false);

    // Función para subir imagen a Cloudinary
    const subirImagenCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'productos_preset');
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dnzss87bx/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return data.secure_url;
        } catch (error) {
            console.error('Error al subir imagen:', error);
            throw error;
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        setCargando(true);
        
        try {
            const url = await subirImagenCloudinary(file);
            setFotos([...fotos, url]); // Agregar a las fotos existentes
            alert('Imagen subida exitosamente');
        } catch (error) {
            alert('Error al subir imagen: ' + error.message);
        } finally {
            setCargando(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFotos(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setTitulo(initialData.titulo);
            setDescripcion(initialData.descripcion);
            setPrecio(initialData.precio.toString());
            setStock(initialData.stock.toString());
            setMoneda(initialData.moneda);
            setFotos(initialData.fotos);
            setActivo(initialData.activo);
            setCategoria(initialData.categorias?.[0]?.id || 'OTROS');
        }
    }, [initialData]);

const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoria = CATEGORIAS[categoria];
        console.log("CATEGORIA"+ selectedCategoria)
        let productData = []
        if(!initialData) {
            productData = {
            titulo : titulo,
            descripcion : descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            moneda : moneda,
            categoria: selectedCategoria,
            activo: activo,
            fotos : fotos
        }
        }else {
            productData = {
            id : id,
            titulo : titulo,
            descripcion : descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            moneda : moneda,
            categoria: selectedCategoria,
            activo: activo,
            fotos : fotos
        }
        }
        

        if (!titulo || !descripcion || isNaN(productData.precio) || isNaN(productData.stock)) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        onSubmit(productData, !initialData);
    };


    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
                <label htmlFor="titulo" className="form-label">Título</label>
                <input
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                        type="number"
                        id="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="form-input"
                        required
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="form-select"
                    required
                >
                    <option value="" disabled>Selecciona una categoría</option>
                    {Object.entries(CATEGORIAS).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>
            
            {/* Input de archivos */}
            <div className="form-group">
                <label className="form-label">Imágenes</label>
                <input
                    type="file"
                    id="fotos"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={cargando}
                />
                {cargando && <p>Subiendo imagen...</p>}
                
                {/* Mostrar imágenes subidas */}
                {fotos.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {fotos.map((url, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img 
                                    src={url} 
                                    alt={`Imagen ${index}`} 
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem'
                                    }} 
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '25px',
                                        height: '25px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="button-cancel">
                    Cancelar
                </button>
                <Button type="submit" variant="primary">
                    Guardar Producto
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;