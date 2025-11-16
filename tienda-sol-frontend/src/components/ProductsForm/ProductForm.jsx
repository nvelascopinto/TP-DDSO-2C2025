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

    const handleAddImage = () => {
        const newImageSeed = `newImg${Date.now()}`;
        const newImageUrl = `https://picsum.photos/seed/${newImageSeed}/400/400`;
        setFotos(prev => [...prev, newImageUrl]);
    };

    const handleRemoveImage = (index) => {
        setFotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoria = CATEGORIAS[categoria];
        let productData = []
        if(!initialData) {
            productData = {
            titulo : titulo,
            descripcion : descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            moneda : moneda,
            categoria: CATEGORIAS[categoria],
            activo: activo
        }
        }else {
            productData = {
            id : id,
            titulo : titulo,
            descripcion : descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            moneda : moneda,
            categoria: CATEGORIAS[categoria],
            activo: activo
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
                    {Object.entries(CATEGORIAS).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Imágenes</label>
                <div className="image-preview-container">
                    {fotos.map((foto, index) => (
                        <div key={index} className="image-preview">
                            <img src={foto} alt={`Preview ${index + 1}`} />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="image-remove-button">&times;</button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="secondary" onClick={handleAddImage}>
                    Agregar Imagen
                </Button>
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
