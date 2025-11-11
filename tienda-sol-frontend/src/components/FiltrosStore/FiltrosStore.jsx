
import React from "react";
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
export const FiltrosStore = ({
    setMinPrecio,
    minPrecio,
    maxPrecio,
    setMaxPrecio,
    categoria,
    setCategoria,
    sortOrder,
    setSortOrder,
    fetchProductos,
    handleClearFilters
}) => {
    const [selectOpenCategoria, setSelectOpenCategoria] = useState(false);
    const [selectOpenOrden, setSelectOpenOrden] = useState(false);
    return <div className = "filter_box">
        <p className='filtros-header'>Filtros</p>
        <List dense={true}>
                <ListItem>
                         <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="sort_label">Ordenar</InputLabel>
                            <Select
                                inputProps={{
                                'aria-label': 'Ordenar los productos'
                                }}
                                labelId="sort_label"
                                id="sort_select"
                                value={sortOrder}
                                label="Ordenar"
                                onChange= {(e) => setSortOrder(e.target.value)}
                                 open={selectOpenOrden}
                                 onOpen={() => setSelectOpenOrden(true)}
                                 onClose={() => setSelectOpenOrden(false)}
                                 IconComponent={() => (
                                 selectOpenOrden ? <Remove fontSize="small" /> : <Add fontSize="small" />
                                 )}
                            >
                                <MenuItem value="masVendido">Más vendidos</MenuItem>
                                <MenuItem value="asc">Precio: Menor a Mayor</MenuItem>
                                <MenuItem value="desc">Precio: Mayor a Menor</MenuItem>
                            </Select>
                        </FormControl>
                </ListItem>
                <Divider />
                <ListItem>
                         <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="categoria_label">Categoria</InputLabel>
                            <Select
                                inputProps={{
                                'aria-label': 'Seleccionar categoría de productos'
                                }}
                                labelId="categoria_label"
                                id="categoria_select"
                                value={categoria}
                                label="Categoria"
                                onChange= {(e) => setCategoria(e.target.value)}
                                 open={selectOpenCategoria}
                                 onOpen={() => setSelectOpenCategoria(true)}
                                 onClose={() => setSelectOpenCategoria(false)}
                                 IconComponent={() => (
                                 selectOpenCategoria ? <Remove fontSize="small" /> : <Add fontSize="small" />
                                 )}
                            >
                                <MenuItem value="all">Todas las categorías</MenuItem>
                                {Object.entries(CATEGORIAS).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))} 
                            </Select>
                        </FormControl>
                </ListItem>
               <ListItem>
                <div className = "price_input_group">
                         <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="minPrecioFilter">Precio mínimo</InputLabel>
                            <OutlinedInput
                                id="minPrecioFilter"
                                type="number"
                                placeholder="$ 0"
                                value={minPrecio}
                                onChange={(e) => setMinPrecio(e.target.value)}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Precio mínimo"
                                inputProps={{
                                min: 0,
                                step: 0.01,
                                'aria-label': 'Precio mínimo'
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="maxPrecioFilter">Precio máximo</InputLabel>
                            <OutlinedInput
                                id="maxPrecioFilter"
                                type="number"
                                placeholder="$ 999"
                                value={maxPrecio}
                                onChange={(e) => setMaxPrecio(e.target.value)}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Precio máximo"
                                inputProps={{
                                min: 0,
                                step: 0.01,
                                'aria-label': 'Precio máximo'
                                }}
                            />
                        </FormControl>
                </div>
                </ListItem>
            </List>
            <div className='filter-button-group'>
          <button 
          onClick={handleClearFilters}
          className="filters-panel__clear-btn"
          aria-label="Limpiar todos los filtros"
        >
          Limpiar filtros
        </button>
        <button 
          onClick={fetchProductos}
          className="filters-panel__fetch-btn"
          aria-label="Aplicar filtros"
        >
          Filtrar
        </button>
        </div>

    </div>
//   return 
// <div className="store-page__filters-panel" role="search" aria-label="Panel de filtros avanzados">
//         <div className="filters-panel__grid">
//           <div className="filter-group">
//             <label htmlFor="minPrecioFilter" className="filter-label">Precio Mínimo</label>
//             <input
//               type="number"
//               id="minPrecioFilter"
//               placeholder="$ 0"
//               value={minPrecio}
//               onChange={(e) => setMinPrecio(e.target.value)}
//               className="filter-input"
//               min="0"
//               step="0.01"
//             />
//           </div>

//           <div className="filter-group">
//             <label htmlFor="maxPrecioFilter" className="filter-label">Precio Máximo</label>
//             <input
//               type="number"
//               id="maxPrecioFilter"
//               placeholder="$ 999999"
//               value={maxPrecio}
//               onChange={(e) => setMaxPrecio(e.target.value)}
//               className="filter-input"
//               min="0"
//               step="0.01"
//             />
//           </div>

//           <div className="filter-group">
//             <label htmlFor="categoriaFilter" className="filter-label">Categoría</label>
//             <select
//               id="categoriaFilter"
//               value={categoria}
//               onChange={(e) => setCategoria(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">Todas las categorías</option>
//               {Object.entries(CATEGORIAS).map(([key, value]) => (
//                                       <option key={key} value={key}>{value}</option>
//                                   ))}
//             </select>
//           </div>

//           <div className="filter-group">
//             <label htmlFor="ordenFilter" className="filter-label">Ordenar por</label>
//             <select
//               id="ordenFilter"
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="filter-select"
//             >
//               <option value="masVendido">Más vendidos</option>
//               <option value="asc">Precio: Menor a Mayor</option>
//               <option value="desc">Precio: Mayor a Menor</option>
//             </select>
//           </div>
//         </div>

//        <div className='filter-button-group'>
//          <button 
//           onClick={handleClearFilters}
//           className="filters-panel__clear-btn"
//           aria-label="Limpiar todos los filtros"
//         >
//           Limpiar filtros
//         </button>
//         <button 
//           onClick={fetchProductos}
//           className="filters-panel__fetch-btn"
//           aria-label="Aplicar filtros"
//         >
//           Filtrar
//         </button>
//            </div>
//        </div>
}