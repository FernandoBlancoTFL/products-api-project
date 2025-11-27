import React, { useState, useEffect, useCallback } from 'react';
declare const Swal: any;

// const API_URL = 'http://localhost:3000';

const API_URL = process.env.REACT_APP_API_URL || '';

// Definir el tipo de Producto
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
}

// Definir el tipo de NewProduct (para el formulario)
interface NewProductForm {
  name: string;
  price: string;
  description: string;
  stock: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<NewProductForm>({
    name: '',
    price: '',
    description: '',
    stock: ''
  });

  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: '',
    price: '',
    description: '',
    stock: ''
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      setToken(data.token);
      localStorage.setItem('token', data.token);
      setSuccessMessage('Sesión iniciada correctamente');
      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setProducts([]);
    setSuccessMessage('Sesión cerrada');
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar productos');
      }
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token, fetchProducts]);

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/api/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          stock: parseInt(newProduct.stock)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear producto');
      }

      setSuccessMessage('Producto creado exitosamente');
      setNewProduct({ name: '', price: '', description: '', stock: '' });
      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      stock: product.stock.toString()
    });
    setIsEditModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditForm({ name: '', price: '', description: '', stock: '' });
  };

  // Función para actualizar el producto
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          price: parseFloat(editForm.price),
          description: editForm.description,
          stock: parseInt(editForm.stock)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar producto');
      }

      setSuccessMessage('Producto actualizado exitosamente');
      handleCloseEditModal();
      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    // Mostrar alerta de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    // Si el usuario cancela, salir de la función
    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar producto');
      }

      // Mostrar mensaje de éxito con SweetAlert2
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado exitosamente',
        icon: 'success',
        confirmButtonColor: '#4CAF50',
        timer: 2000,
        timerProgressBar: true
      });

      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      // Mostrar error con SweetAlert2
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#f44336'
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        🛒 Sistema de Gestión de Productos
      </h1>

      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fee', 
          color: '#c33',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          ❌ {error}
        </div>
      )}

      {successMessage && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#efe', 
          color: '#2a7',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #cfc'
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
              ✏️ Editar Producto
            </h2>
            <form onSubmit={handleUpdateProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Precio:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Descripción:
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    minHeight: '80px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Stock:
                </label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    padding: '12px', 
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Actualizando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    padding: '12px', 
                    backgroundColor: '#757575',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!token ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px',
          maxWidth: '400px',
          margin: '40px auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            🔐 Iniciar Sesión
          </h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Contraseña:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p style={{ 
            textAlign: 'center', 
            marginTop: '15px', 
            fontSize: '12px',
            color: '#666'
          }}>
            Credenciales de prueba: admin@test.com / admin123
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>
              👤 {email}
            </span>
            <button
              onClick={handleLogout}
              style={{ 
                padding: '8px 20px', 
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar Sesión
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                ➕ Agregar Nuevo Producto
              </h2>
              <form onSubmit={handleCreateProduct}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Precio:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Descripción:
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      minHeight: '80px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Stock:
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Creando...' : 'Crear Producto'}
                </button>
              </form>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                📦 Lista de Productos
              </h2>
              {loading && <p>Cargando productos...</p>}
              {!loading && products.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                  No hay productos registrados
                </p>
              )}
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {products.map((product) => (
                  <div 
                    key={product.id}
                    style={{ 
                      padding: '15px',
                      marginBottom: '15px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {product.name}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>Precio:</strong> ${product.price}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>Stock:</strong> {product.stock || 0} unidades
                    </p>
                    {product.description && (
                      <p style={{ margin: '5px 0', color: '#666', fontSize: '13px' }}>
                        {product.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        style={{ 
                          flex: 1,
                          padding: '8px 15px', 
                          backgroundColor: '#FF9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ 
                          flex: 1,
                          padding: '8px 15px', 
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;