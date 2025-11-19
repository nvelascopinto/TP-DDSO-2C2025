import React, { useEffect } from "react";
import './FiltrosStore.css';
import {CATEGORIAS} from '../../../enums.js'
import { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Add, Remove } from '@mui/icons-material';
import { InputNumber } from 'antd';
import { Slider } from 'antd';


export const FiltrosStore = ({
    setMinPrecio,
    minPrecio,
    maxPrecio,
    setMaxPrecio,
    precioMaximo,
    categoria,
    setCategoria,
    sortOrder,
    setSortOrder,
    fetchProductos,
    handleClearFilters
}) => {

 
const minValue = minPrecio === '' || minPrecio === null ? 0 : parseFloat(minPrecio);
const maxValue = maxPrecio === '' || maxPrecio === null ? precioMaximo : parseFloat(maxPrecio);

    return <div className = "filter_box" role="search" aria-label="Filtros de búsqueda de productos">
        <p className='filtros-header'>Filtros</p>
        <List dense={true}>
                <ListItem>
                         <FormControl variant="standard" sx={{ m: 1, minWidth: 120, width: 200}} size="small">
                            <InputLabel id="sort_label" sx={{ fontSize: '1rem', width: 200}} >Ordenar&nbsp;&nbsp;&nbsp; </InputLabel>
                            <Select
                                inputProps={{
                                'aria-label': 'Ordenar los productos'
                                }}
                                labelId="sort_label"
                                id="sort_select"
                                value={sortOrder}
                                label="Ordenar"
                                 sx={{ fontSize: '0.8rem'}}
                                onChange= {(e) => setSortOrder(e.target.value)}
                                 
                            >
                                <MenuItem value="masVendido"  sx={{ fontSize: '0.775rem'}}>Más vendidos</MenuItem>
                                <MenuItem value="asc"  sx={{ fontSize: '0.775rem'}}>Precio: Menor a Mayor</MenuItem>
                                <MenuItem value="desc"  sx={{ fontSize: '0.775rem'}}>Precio: Mayor a Menor</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>
                <Divider />
                <ListItem>
                         <FormControl variant="standard" sx={{ m: 1, minWidth: 120, width: 200 }} size="small">
                            <InputLabel id="categoria_label">Categoria</InputLabel>
                            <Select
                                inputProps={{
                                'aria-label': 'Seleccionar categoría de productos'
                                }}
                                labelId="categoria_label"
                                id="categoria_select"
                                value={categoria}
                                label="Categoria"
                                 sx={{ fontSize: '0.8rem'}}
                                onChange= {(e) => setCategoria(e.target.value)}
                                
                            >
                                <MenuItem value="all">Todas las categorías</MenuItem>
                                {Object.entries(CATEGORIAS).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))} 
                            </Select>
                        </FormControl>
                </ListItem>
                <Divider />
               <ListItem>
                <div className = "price_input_group">
                        <div className="price_input_label">
                            <p className = "price_input_label_text">Precio Mínimo</p>
                            <InputNumber 
                                prefix="$" 
                                style={{ width: '100%' }}
                                onChange={(value) => setMinPrecio(value === null ? '' : value)}
                                value={minPrecio}
                                placeholder="Mínimo"
                                id="minPrecioFilter"
                                min={0}
                                max={maxValue}
                                step={1}
                                controls={true} 
                                aria-label="Precio mínimo"
                            />
                            </div>
                        <div className="price_input_label">
                            <p className = "price_input_label_text">Precio Máximo</p>
                            <InputNumber 
                                prefix="$" 
                                style={{ width: '100%' }}
                                onChange={(value) => setMaxPrecio(value === null ? '' : value)}
                                value={maxPrecio}
                                placeholder={"Máximo"}
                                id="maxPrecioFilter"
                                min={minValue}
                                max={precioMaximo}
                                step={1}
                                controls={true}
                                aria-label="Precio máximo"
                            />
                            </div>
                        
                </div>
                
                </ListItem>
                
                <div className="precio-slider-wrapper"  role="group" aria-labelledby="slider-label">
                    <Slider
                        range
                        min={0}
                        max={precioMaximo || 100000}
                        value={[minValue, maxValue]}
                        onChange={(values) => {
                            setMinPrecio(values[0].toString());
                            setMaxPrecio(values[1].toString());
                         }}
                        tooltip={{ open: false }}
                        allowCross={false}
                        className="custom-slider"

                        aria-label="Ajustar rango de precios"
                        aria-valuemin={0}
                        aria-valuemax={precioMaximo}
                        aria-valuenow={minValue}
                        aria-valuetext={`Rango de ${minValue} a ${maxValue} pesos`}
                       
                    />
                    
                    <div className="slider-values">
                        <span 
                        className="slider-value" 
                        style={{ 
                            left: `${precioMaximo > 0 ? (minValue / precioMaximo) * 100 : 0}%`,
                            transform: 'translateX(-50%)',
                        }}
                        >
                        ${minValue}
                        </span>
                        <span 
                        className="slider-value" 
                        style={{ 
                        left: `${precioMaximo > 0 ? (maxValue / precioMaximo)* 100 : 100}%`,
                        transform: 'translateX(-50%)'
                         }}
                        >
                          ${maxValue}
                        </span>
                    </div>
                </div>
            </List>
            
            <div className='filter-buttons-container'>
          <button 
          onClick={handleClearFilters}
          className="btn-limpiar"
          type="button"
          aria-label="Limpiar todos los filtros"
        >
          Limpiar filtros
        </button>
        <button 
          onClick={fetchProductos}
          className="btn-filtrar"
          type="button"
          aria-label="Aplicar filtros"
        >
          Filtrar
        </button>
        </div>

    </div>
}