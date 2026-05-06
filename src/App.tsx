import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Wine, ChevronRight, CheckCircle2, LogOut, BookOpen } from 'lucide-react';
import { products, type Product } from './data/products';
import { blogPosts, type BlogPost } from './data/blog';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || 'YOUR_PUBLIC_KEY', { locale: 'es-CL' });

interface CartItem extends Product {
  quantity: number;
}

interface UserData {
  name: string;
  email: string;
  picture?: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Varietal', 'Reserva', 'Gran Reserva', 'Premium', 'Saldo Exportación'];

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(cartTotalPrice);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const newUser = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };
      setUser(newUser);
      
      // Llamar al backend para enviar correo de bienvenida usando Google (Nodemailer)
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        await fetch(`${backendUrl}/api/send-welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newUser.email, name: newUser.name })
        });
      } catch (err) {
        console.error('Error enviando correo de bienvenida:', err);
      }
    }
  };

  const handleCheckout = async () => {
    if (!user && !guestEmail) {
      alert('Por favor ingresa tu correo para continuar como invitado o inicia sesión con Google.');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          user: user || { email: guestEmail, name: 'Invitado' }
        })
      });
      
      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        alert('Hubo un error al crear la orden.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el backend.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header glass">
        <div className="container header-content">
          <div className="logo">
            <Wine color="var(--primary-color)" size={32} />
            <span>Bodega</span> Premium
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <img src={user.picture} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <span>{user.name}</span>
                <button onClick={() => setUser(null)} style={{ color: 'var(--text-secondary)' }}><LogOut size={18} /></button>
              </div>
            ) : null}
            <button className="cart-button" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} />
              {cartTotalItems > 0 && (
                <span className="cart-badge animate-fade-in">{cartTotalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Exclusividad y Tradición <br />
            <span style={{ color: 'var(--primary-color)' }}>en Cada Copa</span>
          </h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Descubre nuestra selección premium directamente desde el Valle del Maule. 
            Calidad excepcional, aromas únicos y una experiencia inolvidable.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button className="btn btn-primary" onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver Catálogo <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="category-nav">
        <div className="container category-tabs">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Product List */}
      <main id="catalog" className="products-section container">
        <h2 className="section-title">
          {selectedCategory === 'Todos' ? 'Nuestra Selección' : selectedCategory}
        </h2>
        <div className="grid">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card animate-fade-in cursor-pointer"
              style={{ animationDelay: `${0.1 * (index % 10)}s` }}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-image-container">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="product-price">{product.formattedPrice}</span>
                      {product.formattedOriginalPrice && (
                        <span className="product-original-price">{product.formattedOriginalPrice}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{product.format}</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="container">
          <h2 className="section-title">Noticias y Reportajes</h2>
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="blog-card animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
                onClick={() => setSelectedPost(post)}
              >
                <img src={post.imageUrl} alt={post.title} className="blog-image" loading="lazy" />
                <div className="blog-info">
                  <span className="blog-meta">{post.date} • {post.author}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div style={{ marginTop: 'auto', paddingTop: '1rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Leer más <BookOpen size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <Wine size={48} color="var(--primary-color)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <p>© {new Date().getFullYear()} Bodega Premium - Distribuido Oficialmente</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Valle del Maule, Chile</p>
        </div>
      </footer>

      {/* Cart Modal / Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Tu Carro</h2>
            <button className="close-button" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>Tu carro está vacío</p>
                <button className="btn btn-outline" onClick={() => setIsCartOpen(false)}>
                  Seguir Comprando
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">{item.formattedPrice}</div>
                    <div className="cart-item-actions">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>{formattedTotal}</span>
              </div>
              
              {preferenceId ? (
                <Wallet initialization={{ preferenceId }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {!user && (
                    <div style={{ background: 'var(--surface-color-hover)', padding: '1rem', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Continúa como invitado o inicia sesión</p>
                      <input 
                        type="email" 
                        placeholder="Tu correo electrónico" 
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white', marginBottom: '1rem' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={() => console.log('Login Failed')}
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    className="btn btn-primary btn-block" 
                    onClick={handleCheckout}
                    disabled={isCheckingOut || (!user && !guestEmail)}
                  >
                    {isCheckingOut ? 'Procesando...' : (
                      <>
                        <CheckCircle2 size={20} />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Product Detail Modal */}
      <div 
        className={`product-modal-overlay ${selectedProduct ? 'open' : ''}`}
        onClick={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <div className="product-modal-content" onClick={e => e.stopPropagation()}>
            <button className="product-modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            <div className="product-modal-image">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            </div>
            <div className="product-modal-details">
              <span className="product-modal-category">{selectedProduct.category}</span>
              <h2 className="product-modal-title">{selectedProduct.name}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="product-modal-price" style={{ marginBottom: 0 }}>{selectedProduct.formattedPrice}</div>
                {selectedProduct.formattedOriginalPrice && (
                  <span className="product-modal-original-price">{selectedProduct.formattedOriginalPrice}</span>
                )}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({selectedProduct.format})</span>
              </div>
              
              <div className="product-modal-scroll-area">
                {selectedProduct.description && (
                  <p className="product-modal-desc">{selectedProduct.description}</p>
                )}

                <div className="product-features">
                  {selectedProduct.winery && (
                    <div className="feature-item">
                      <span className="feature-label">Viña / Marca</span>
                      <span className="feature-value">{selectedProduct.winery}</span>
                    </div>
                  )}
                  {selectedProduct.origin_region && (
                    <div className="feature-item">
                      <span className="feature-label">Valle de Origen</span>
                      <span className="feature-value">Valle del {selectedProduct.origin_region}</span>
                    </div>
                  )}
                  {selectedProduct.vintage && (
                    <div className="feature-item">
                      <span className="feature-label">Cosecha</span>
                      <span className="feature-value">{selectedProduct.vintage}</span>
                    </div>
                  )}
                  {selectedProduct.alcohol_percentage && selectedProduct.alcohol_percentage !== "null" && (
                    <div className="feature-item">
                      <span className="feature-label">Alcohol</span>
                      <span className="feature-value">{selectedProduct.alcohol_percentage}%</span>
                    </div>
                  )}
                </div>

                {selectedProduct.tasting_notes && (
                  <div className="product-tasting-notes">
                    "{selectedProduct.tasting_notes}"
                  </div>
                )}
              </div>

              <div className="product-modal-actions">
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart size={20} />
                  Agregar al Carro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      <div 
        className={`product-modal-overlay ${selectedPost ? 'open' : ''}`}
        onClick={() => setSelectedPost(null)}
        style={{ zIndex: 300 }}
      >
        {selectedPost && (
          <div className="blog-modal-content" onClick={e => e.stopPropagation()}>
            <button className="product-modal-close" onClick={() => setSelectedPost(null)} style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
              <X size={24} />
            </button>
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="blog-modal-header-img" />
            <div className="blog-modal-body">
              <span className="blog-meta" style={{ display: 'block', marginBottom: '1rem' }}>{selectedPost.date} • {selectedPost.author}</span>
              <h2 className="blog-modal-title">{selectedPost.title}</h2>
              <p className="blog-modal-text" style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</p>
              {selectedPost.link && (
                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Fuente original y crédito: <strong>{selectedPost.author}</strong>
                  </p>
                  <a 
                    href={selectedPost.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Ver noticia completa en WiP.cl
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
