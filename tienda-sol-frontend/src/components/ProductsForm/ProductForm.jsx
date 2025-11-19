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
    const [stock, setStock] = useState('1');
    const [moneda, setMoneda] = useState(Moneda.DOLAR_USA);
    const [fotos, setFotos] = useState([]);
    const [activo, setActivo] = useState(true);
    const [categoria, setCategoria] = useState('');
    const [cargando, setCargando] = useState(false);
    const [errors, setErrors] = useState({});

    const subirImagenCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'productos_preset');
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/deyav6pbj/image/upload`,
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
            setFotos([...fotos, url]);
            
            setErrors(prev => ({ ...prev, fotos: '' }));
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

    const handleStockChange = (e) => {
        const value = e.target.value;
        setStock(value);
        
        if (value && parseInt(value, 10) === 0) {
            setErrors(prev => ({ ...prev, stock: 'El stock no puede ser 0' }));
        } else {
            setErrors(prev => ({ ...prev, stock: '' }));
        }
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
        
        const newErrors = {};
        
        if (fotos.length === 0) {
            newErrors.fotos = 'Debes subir una imagen del producto';
        }
        
        const stockValue = parseInt(stock, 10);
        if (isNaN(stockValue) || stockValue === 0) {
            newErrors.stock = 'El stock debe ser mayor a 0';
        }
        
        const precioValue = parseFloat(precio);
        if (isNaN(precioValue)) {
            newErrors.precio = 'El precio debe ser un número válido';
        }
        
        if (!titulo.trim()) {
            newErrors.titulo = 'El título es requerido';
        }
        
        if (!descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }
        
        if (!categoria) {
            newErrors.categoria = 'Debes seleccionar una categoría';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        const selectedCategoria = CATEGORIAS[categoria];
        console.log("CATEGORIA" + selectedCategoria);
        
        let productData = [];
        if(!initialData) {
            productData = {
                titulo : titulo,
                descripcion : descripcion,
                precio: precioValue,
                stock: stockValue,
                moneda : moneda,
                categoria: selectedCategoria,
                activo: activo,
                fotos : fotos
            }
        } else {
            productData = {
                id : id,
                titulo : titulo,
                descripcion : descripcion,
                precio: precioValue,
                stock: stockValue,
                moneda : moneda,
                categoria: selectedCategoria,
                activo: activo,
                fotos : fotos
            }
        }

        onSubmit(productData, !initialData);
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="product-form"
            aria-label="Formulario para crear o editar un producto"
        >
            <div className="form-group">
                <label htmlFor="titulo" className="form-label">Título</label>
                <input
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="form-input"
                    required
                    aria-required="true"
                />
                {errors.titulo && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }} role="alert">
                        {errors.titulo}
                    </span>
                )}
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
                    aria-required="true"
                />
                {errors.descripcion && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }} role="alert">
                        {errors.descripcion}
                    </span>
                )}
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
                        aria-required="true"
                    />
                    {errors.precio && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }} role="alert">
                            {errors.precio}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={handleStockChange}
                        className="form-input"
                        required
                        min="1"
                        aria-required="true"
                    />
                    {errors.stock && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }} role="alert">
                            {errors.stock}
                        </span>
                    )}
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
                    aria-required="true"
                >
                    <option value="" disabled>Selecciona una categoría</option>
                    {Object.entries(CATEGORIAS).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
                {errors.categoria && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }} role="alert">
                        {errors.categoria}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="fotos" 
                    required
                    aria-required="true">
                    Imágenes <span style={{ color: 'red' }}>*</span>
                </label>

                <input
                    type="file"
                    id="fotos"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={cargando}
                    aria-busy={cargando ? "true" : "false"}
                    aria-describedby="upload-status"
                />

                {cargando && (
                    <p id="upload-status" role="alert">
                        Subiendo imagen...
                    </p>
                )}

                {errors.fotos && (
                    <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }} role="alert">
                        {errors.fotos}
                    </span>
                )}

                {fotos.length > 0 && (
                    <div 
                        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}
                        aria-label="Imágenes subidas"
                    >
                        {fotos.map((url, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img
                                    src={url}
                                    alt={`Vista previa de la imagen ${index + 1}`}
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
                                    aria-label={`Eliminar imagen ${index + 1}`}
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
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="button-cancel"
                    aria-label="Cancelar y volver atrás"
                >
                    Cancelar
                </button>

                <Button 
                    type="submit" 
                    variant="primary"
                    aria-label="Guardar producto"
                >
                    Guardar Producto
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;