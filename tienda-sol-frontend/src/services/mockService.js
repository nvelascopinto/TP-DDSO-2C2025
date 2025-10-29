export const TipoUsuario = {
  COMPRADOR: 'Comprador',
  VENDEDOR: 'Vendedor',
};

export const Moneda = {
  DOLAR_USA: 'USD',
  PESO_ARG: 'ARS',
};

export const EstadoPedido = {
  EN_PREPARACION: 'EN_PREPARACION',
  ENTREGADO: 'ENTREGADO',
  PENDIENTE: 'PENDIENTE',
  CONFIRMADO: 'CONFIRMADO',
  ENVIADO: 'ENVIADO',
  CANCELADO: 'CANCELADO',
};

// mock bd

const mockUsuarios = [
  { id: 'user-1', nombre: 'Ana (Compradora)', email: 'ana@example.com', telefono: '123456789', tipo: TipoUsuario.COMPRADOR, fechaAlta: new Date().toISOString() },
  { id: 'user-2', nombre: 'Boutique de Ropa "Estilo Urbano"', email: 'estilo@example.com', telefono: '987654321', tipo: TipoUsuario.VENDEDOR, fechaAlta: new Date().toISOString() },
  { id: 'user-3', nombre: 'Carlos (Comprador)', email: 'carlos@example.com', telefono: '555555555', tipo: TipoUsuario.COMPRADOR, fechaAlta: new Date().toISOString() },
  { id: 'pepeSeller', nombre: 'ArteSano Decoraciones', email: 'artesano@example.com', telefono: '111222333', tipo: TipoUsuario.VENDEDOR, fechaAlta: new Date().toISOString() },
];

const mockCategorias = [
  { id: 'cat-1', nombre: 'Remeras' },
  { id: 'cat-2', nombre: 'Pantalones' },
  { id: 'cat-3', nombre: 'Accesorios' },
  { id: 'cat-4', nombre: 'Decoración' },
  { id: 'cat-5', nombre: 'Hogar' },
];

let mockProductos = [
  { id: 'prod-1', vendedorId: 'user-2', titulo: 'Remera de Algodón Premium', descripcion: 'Remera suave y duradera, perfecta para el día a día.', categorias: [mockCategorias[0]], precio: 25.00, moneda: Moneda.DOLAR_USA, stock: 50, fotos: ['https://picsum.photos/seed/remera/400/400'], activo: true },
  { id: 'prod-2', vendedorId: 'user-2', titulo: 'Jean Slim Fit', descripcion: 'Jean moderno y cómodo con un calce perfecto.', categorias: [mockCategorias[1]], precio: 60.00, moneda: Moneda.DOLAR_USA, stock: 30, fotos: ['https://picsum.photos/seed/jean/400/400'], activo: true },
  { id: 'prod-3', vendedorId: 'user-2', titulo: 'Gorra Trucker', descripcion: 'Gorra con diseño exclusivo para completar tu look.', categorias: [mockCategorias[2]], precio: 15.00, moneda: Moneda.DOLAR_USA, stock: 100, fotos: ['https://picsum.photos/seed/gorra/400/400'], activo: true },
  { id: 'prod-4', vendedorId: 'user-4', titulo: 'Cuadro Abstracto Moderno', descripcion: 'Obra de arte pintada a mano sobre lienzo.', categorias: [mockCategorias[3], mockCategorias[4]], precio: 120.00, moneda: Moneda.DOLAR_USA, stock: 5, fotos: ['https://picsum.photos/seed/cuadro/400/400'], activo: true },
  { id: 'prod-5', vendedorId: 'user-4', titulo: 'Jarrón de Cerámica', descripcion: 'Jarrón artesanal ideal para decorar cualquier espacio.', categorias: [mockCategorias[3]], precio: 45.00, moneda: Moneda.DOLAR_USA, stock: 15, fotos: ['https://picsum.photos/seed/jarron/400/400'], activo: true },
  { id: 'prod-6', vendedorId: 'user-2', titulo: 'Remera de Algodón Premium', descripcion: 'Remera suave y duradera, perfecta para el día a día.', categorias: [mockCategorias[0]], precio: 25.00, moneda: Moneda.DOLAR_USA, stock: 50, fotos: ['https://picsum.photos/seed/remera/400/400'], activo: true },
  { id: 'prod-7', vendedorId: 'user-2', titulo: 'Jean Slim Fit', descripcion: 'Jean moderno y cómodo con un calce perfecto.', categorias: [mockCategorias[1]], precio: 60.00, moneda: Moneda.DOLAR_USA, stock: 30, fotos: ['https://picsum.photos/seed/jean/400/400'], activo: true },
  { id: 'prod-8', vendedorId: 'user-2', titulo: 'Gorra Trucker', descripcion: 'Gorra con diseño exclusivo para completar tu look.', categorias: [mockCategorias[2]], precio: 15.00, moneda: Moneda.DOLAR_USA, stock: 100, fotos: ['https://picsum.photos/seed/gorra/400/400'], activo: true },
  { id: 'prod-9', vendedorId: 'user-4', titulo: 'Cuadro Abstracto Moderno', descripcion: 'Obra de arte pintada a mano sobre lienzo.', categorias: [mockCategorias[3], mockCategorias[4]], precio: 120.00, moneda: Moneda.DOLAR_USA, stock: 5, fotos: ['https://picsum.photos/seed/cuadro/400/400'], activo: true },
  { id: 'prod-10', vendedorId: 'user-4', titulo: 'Jarrón de Cerámica', descripcion: 'Jarrón artesanal ideal para decorar cualquier espacio.', categorias: [mockCategorias[3]], precio: 45.00, moneda: Moneda.DOLAR_USA, stock: 15, fotos: ['https://picsum.photos/seed/jarron/400/400'], activo: true },
  { id: 'prod-11', vendedorId: 'user-2', titulo: 'Remera de Algodón Premium', descripcion: 'Remera suave y duradera, perfecta para el día a día.', categorias: [mockCategorias[0]], precio: 25.00, moneda: Moneda.DOLAR_USA, stock: 50, fotos: ['https://picsum.photos/seed/remera/400/400'], activo: true },
  { id: 'prod-12', vendedorId: 'user-2', titulo: 'Jean Slim Fit', descripcion: 'Jean moderno y cómodo con un calce perfecto.', categorias: [mockCategorias[1]], precio: 60.00, moneda: Moneda.DOLAR_USA, stock: 30, fotos: ['https://picsum.photos/seed/jean/400/400'], activo: true },
  { id: 'prod-13', vendedorId: 'user-2', titulo: 'Gorra Trucker', descripcion: 'Gorra con diseño exclusivo para completar tu look.', categorias: [mockCategorias[2]], precio: 15.00, moneda: Moneda.DOLAR_USA, stock: 100, fotos: ['https://picsum.photos/seed/gorra/400/400'], activo: true },
  { id: 'prod-14', vendedorId: 'user-4', titulo: 'Cuadro Abstracto Moderno', descripcion: 'Obra de arte pintada a mano sobre lienzo.', categorias: [mockCategorias[3], mockCategorias[4]], precio: 120.00, moneda: Moneda.DOLAR_USA, stock: 5, fotos: ['https://picsum.photos/seed/cuadro/400/400'], activo: true },
  { id: 'prod-15', vendedorId: 'user-4', titulo: 'Jarrón de Cerámica', descripcion: 'Jarrón artesanal ideal para decorar cualquier espacio.', categorias: [mockCategorias[3]], precio: 45.00, moneda: Moneda.DOLAR_USA, stock: 15, fotos: ['https://picsum.photos/seed/jarron/400/400'], activo: true },
  { id: 'prod-16', vendedorId: 'user-4', titulo: 'Jarrón de Cerámica', descripcion: 'Jarrón artesanal ideal para decorar cualquier espacio.', categorias: [mockCategorias[3]], precio: 45.00, moneda: Moneda.DOLAR_USA, stock: 15, fotos: ['https://picsum.photos/seed/jarron/400/400'], activo: true },
  { id: 'prod-17', vendedorId: 'user-2', titulo: 'Remera de Algodón Premium', descripcion: 'Remera suave y duradera, perfecta para el día a día.', categorias: [mockCategorias[0]], precio: 25.00, moneda: Moneda.DOLAR_USA, stock: 50, fotos: ['https://picsum.photos/seed/remera/400/400'], activo: true },
  { id: 'prod-18', vendedorId: 'user-2', titulo: 'Jean Slim Fit', descripcion: 'Jean moderno y cómodo con un calce perfecto.', categorias: [mockCategorias[1]], precio: 60.00, moneda: Moneda.DOLAR_USA, stock: 30, fotos: ['https://picsum.photos/seed/jean/400/400'], activo: true },
  { id: 'prod-19', vendedorId: 'user-2', titulo: 'Gorra Trucker', descripcion: 'Gorra con diseño exclusivo para completar tu look.', categorias: [mockCategorias[2]], precio: 15.00, moneda: Moneda.DOLAR_USA, stock: 100, fotos: ['https://picsum.photos/seed/gorra/400/400'], activo: true },
  { id: 'prod-20', vendedorId: 'user-4', titulo: 'Cuadro Abstracto Moderno', descripcion: 'Obra de arte pintada a mano sobre lienzo.', categorias: [mockCategorias[3], mockCategorias[4]], precio: 120.00, moneda: Moneda.DOLAR_USA, stock: 5, fotos: ['https://picsum.photos/seed/cuadro/400/400'], activo: true },
  { id: 'prod-21', vendedorId: 'user-4', titulo: 'Jarrón de Cerámica', descripcion: 'Jarrón artesanal ideal para decorar cualquier espacio.', categorias: [mockCategorias[3]], precio: 45.00, moneda: Moneda.DOLAR_USA, stock: 15, fotos: ['https://picsum.photos/seed/jarron/400/400'], activo: true },

];

let mockNotificaciones = [
  { id: 'notif-1', usuarioDestinoId: 'vendedorTecno', mensaje: 'Ana (Compradora) ha realizado un nuevo pedido (#order-1).', fechaAlta: '2025-10-22T11:19:54.000Z', leida: false },
  { id: 'notif-2', usuarioDestinoId: 'camila_15', mensaje: 'Tu pedido #order-1 ha sido confirmado.', fechaAlta: new Date().toISOString(), leida: false },
  { id: 'notif-3', usuarioDestinoId: 'camila_15', mensaje: 'Tu pedido #order-1 ha sido enviado. ¡Pronto estará contigo!', fechaAlta: '2025-10-25T11:19:54.000Z', leida: true, fechaLeida: new Date().toISOString() },
  { id: 'notif-4', usuarioDestinoId: 'vendedor_ropa', mensaje: 'Tu producto "Jean Slim Fit" tiene poco stock.', fechaAlta: '2025-10-25T11:19:54.000Z', leida: false },
];

let mockPedidos = [
  { id: 'order-1', compradorId: 'camila_15', vendedorId: 'vendedorTecno', items: [{ productoId: '69026c83a23e0d910a2c0fc3', cantidad: 2, precioUnitario: 2500.00, subtotal:5000.00 },{ productoId: '69026c8da23e0d910a2c0fc6', cantidad: 1, precioUnitario: 200.00, subtotal: 200.00}], total: 5400.00, moneda: Moneda.DOLAR_USA, direccionEntrega: { calle: 'Av. Siempreviva', altura: '742', ciudad: 'Springfield', provincia: 'Bs As', pais: 'Argentina', codigoPostal: '1234' }, estado: EstadoPedido.ENVIADO, fechaCreacion: new Date().toISOString() },
  { id: 'order-2', compradorId: 'camila_15', vendedorId: 'vendedor_ropa', items: [{ productoId: '69026caba23e0d910a2c0fc9', cantidad: 1, precioUnitario: 4500.00,subtotal:9000.00 }], total: 4500.00, moneda: Moneda.DOLAR_USA, direccionEntrega: { calle: 'Calle Falsa', altura: '123', ciudad: 'Capital', provincia: 'CABA', pais: 'Argentina', codigoPostal: '1001'}, estado: EstadoPedido.CONFIRMADO, fechaCreacion: new Date(Date.now() - 86400000).toISOString() },
 // { id: 'order-3', compradorId: 'user-1', vendedorId: 'user-2', items: [{ productoId: 'prod-1', cantidad: 2, precioUnitario: 25.00 }], total: 50.00, moneda: Moneda.DOLAR_USA, direccionEntrega: { calle: 'Av. Siempreviva', altura: '742', ciudad: 'Springfield', provincia: 'Bs As', pais: 'Argentina', codigoPostal: '1234' }, estado: EstadoPedido.PENDIENTE, fechaCreacion: new Date().toISOString() },
 // { id: 'order-4', compradorId: 'user-1', vendedorId: 'user-2', items: [{ productoId: 'prod-5', cantidad: 1, precioUnitario: 45.00 }], total: 45.00, moneda: Moneda.DOLAR_USA, direccionEntrega: { calle: 'Calle Falsa', altura: '123', ciudad: 'Capital', provincia: 'CABA', pais: 'Argentina', codigoPostal: '1001'}, estado: EstadoPedido.EN_PREPARACION, fechaCreacion: new Date(Date.now() - 86400000).toISOString() },
];

// mock api

const simulateDelay = (data) => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));
};

export const api = {
  getVendedores: async () => {
    return simulateDelay(mockUsuarios.filter(u => u.tipo === TipoUsuario.VENDEDOR));
  },

  getProductosByVendedor: async (vendedorId) => {
    return simulateDelay(mockProductos.filter(p => p.vendedorId === vendedorId));
  },

  getProductoById: async (productoId) => {
    return simulateDelay(mockProductos.find(p => p.id === productoId));
  },
  
  getNotificaciones: async (usuarioId) => {
    const notifs = mockNotificaciones
      .filter(n => n.usuarioDestinoId === usuarioId)
      .sort((a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta));
    return simulateDelay(notifs);
  },

  getNotificacionesNoLeidas: async (usuarioId) => {
    return simulateDelay(mockNotificaciones.filter(n => n.usuarioDestinoId === usuarioId && !n.leida));
  },
  
  marcarNotificacionComoLeida: async (notificacionId) => {
    const notif = mockNotificaciones.find(n => n.id === notificacionId);
    if (notif) {
      notif.leida = true;
      notif.fechaLeida = new Date().toISOString();
      return simulateDelay(notif);
    }
    throw new Error("Notificación no encontrada");
  },

  crearPedido: async (compradorId, vendedorId, items, total) => {
    const nuevoPedido = {
      id: `order-${mockPedidos.length + 1}`,
      compradorId,
      vendedorId,
      items,
      total,
      moneda: Moneda.DOLAR_USA,
      direccionEntrega: { calle: 'Calle Falsa', altura: '123', ciudad: 'Capital', provincia: 'CABA', pais: 'Argentina', codigoPostal: '1001' },
      estado: EstadoPedido.PENDIENTE,
      fechaCreacion: new Date().toISOString(),
    };
    mockPedidos.push(nuevoPedido);

    // notificación al vendedor
    const notifVendedor = {
      id: `notif-${mockNotificaciones.length + 1}`,
      usuarioDestinoId: vendedorId,
      mensaje: `Nuevo pedido #${nuevoPedido.id} recibido de ${mockUsuarios.find(u => u.id === compradorId)?.nombre}.`,
      fechaAlta: new Date().toISOString(),
      leida: false,
    };
    mockNotificaciones.push(notifVendedor);

    return simulateDelay(nuevoPedido);
  },

  getPedidosByComprador: async (compradorId) => {
    return simulateDelay(
      mockPedidos
        .filter(p => p.compradorId === compradorId)
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    );
  },
  getPedidos: async () => {
    return simulateDelay(
      mockPedidos
    );
  },

  cancelarPedido: async (pedidoId) => {
    const pedido = mockPedidos.find(p => p.id === pedidoId);
    if (!pedido) throw new Error("Pedido no encontrado");

    pedido.estado = EstadoPedido.CANCELADO;

    const notifVendedor = {
      id: `notif-${mockNotificaciones.length + 1}`,
      usuarioDestinoId: pedido.vendedorId,
      mensaje: `El pedido #${pedido.id} ha sido cancelado por el comprador.`,
      fechaAlta: new Date().toISOString(),
      leida: false,
    };
    mockNotificaciones.push(notifVendedor);

    return simulateDelay(pedido);
  },

  cambiarEstadoPedido: async (pedidoId, estadoNuevo) => {
    const pedido = mockPedidos.find(p => p.id === pedidoId);
    if (!pedido) throw new Error("Pedido no encontrado");
    pedido.estado = estadoNuevo;
    return simulateDelay(pedido);
  },

  crearProducto: async (vendedorId, data) => {
    const nuevoProducto = {
      ...data,
      id: `prod-${mockProductos.length + 1}`,
      vendedorId,
      activo: true,
    };
    mockProductos.push(nuevoProducto);
    return simulateDelay(nuevoProducto);
  },

  actualizarProducto: async (productoId, data) => {
    const index = mockProductos.findIndex(p => p.id === productoId);
    if (index > -1) {
      mockProductos[index] = { ...mockProductos[index], ...data };
      return simulateDelay(mockProductos[index]);
    }
    throw new Error("Producto no encontrado");
  },
  isAuthorized : async(user) => {
      const index = mockUsuarios.findIndex(p => p.user === user.username);

  }
};
