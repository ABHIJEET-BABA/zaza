import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, Banner } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Package, ShoppingCart, Users, TrendingUp, X, Save, Image as ImageIcon, Layout } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banners'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [bannerSearchTerm, setBannerSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Cold Pressed',
    image: '',
    stock: 100,
    benefits: '',
    usage: ''
  });

  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true,
    order: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productSnapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
        setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

        const orderSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        setOrders(orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

        const bannerSnapshot = await getDocs(query(collection(db, 'banners'), orderBy('order', 'asc')));
        setBanners(bannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        benefits: formData.benefits.split(',').map(b => b.trim()),
        createdAt: new Date().toISOString()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
        toast.success('Product updated successfully');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        setProducts(prev => [{ id: docRef.id, ...productData } as Product, ...prev]);
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: 'Cold Pressed', image: '', stock: 100, benefits: '', usage: '' });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      benefits: product.benefits.join(', '),
      usage: product.usage || ''
    });
    setIsModalOpen(true);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bannerData = {
        ...bannerFormData,
        createdAt: new Date().toISOString()
      };

      if (editingBanner) {
        await updateDoc(doc(db, 'banners', editingBanner.id), bannerData);
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...bannerData } : b));
        toast.success('Banner updated successfully');
      } else {
        const docRef = await addDoc(collection(db, 'banners'), bannerData);
        setBanners(prev => [...prev, { id: docRef.id, ...bannerData } as Banner].sort((a, b) => a.order - b.order));
        toast.success('Banner added successfully');
      }
      setIsBannerModalOpen(false);
      setEditingBanner(null);
      setBannerFormData({ title: '', subtitle: '', image: '', link: '', active: true, order: 0 });
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    }
  };

  const handleBannerDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners(prev => prev.filter(b => b.id !== id));
      toast.success('Banner deleted');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleBannerEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      active: banner.active,
      order: banner.order
    });
    setIsBannerModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end space-y-6 md:space-y-0">
        <div className="space-y-4">
          <h1 className="text-5xl font-light italic">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                activeTab === 'products' ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#1a1a1a]/40 hover:bg-[#5A5A40]/10'
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                activeTab === 'orders' ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#1a1a1a]/40 hover:bg-[#5A5A40]/10'
              }`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('banners')}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                activeTab === 'banners' ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#1a1a1a]/40 hover:bg-[#5A5A40]/10'
              }`}
            >
              Banners
            </button>
          </div>
        </div>
        {activeTab === 'products' && (
          <button 
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', description: '', price: 0, category: 'Cold Pressed', image: '', stock: 100, benefits: '', usage: '' });
              setIsModalOpen(true);
            }}
            className="bg-[#5A5A40] text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center space-x-3"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        )}
        {activeTab === 'banners' && (
          <button 
            onClick={() => {
              setEditingBanner(null);
              setBannerFormData({ title: '', subtitle: '', image: '', link: '', active: true, order: 0 });
              setIsBannerModalOpen(true);
            }}
            className="bg-[#5A5A40] text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center space-x-3"
          >
            <Plus size={18} />
            <span>Add New Banner</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0)}`, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-600' },
          { label: 'Products', value: products.length, icon: Package, color: 'text-orange-600' },
          { label: 'Customers', value: new Set(orders.map(o => o.userId)).size, icon: Users, color: 'text-purple-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm space-y-4">
            <div className={`w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-[40px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#1a1a1a]/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-light italic capitalize">{activeTab} Management</h2>
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={activeTab === 'products' ? searchTerm : activeTab === 'orders' ? orderSearchTerm : bannerSearchTerm}
              onChange={(e) => {
                if (activeTab === 'products') setSearchTerm(e.target.value);
                else if (activeTab === 'orders') setOrderSearchTerm(e.target.value);
                else setBannerSearchTerm(e.target.value);
              }}
              className="w-full pl-12 pr-6 py-3 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
            />
            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20 rotate-45" size={18} />
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f0]/50 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Stock</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => (
                  <tr key={product.id} className="hover:bg-[#f5f5f0]/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-[#f5f5f0] rounded-xl overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-[#1a1a1a]/60">{product.category}</td>
                    <td className="px-8 py-6 font-bold">₹{product.price}</td>
                    <td className="px-8 py-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-4">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-[#f5f5f0] rounded-full text-[#5A5A40] transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-[#f5f5f0] rounded-full text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f0]/50 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Total</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {orders
                  .filter(o => o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) || o.shippingAddress.fullName.toLowerCase().includes(orderSearchTerm.toLowerCase()))
                  .map((order) => (
                  <tr key={order.id} className="hover:bg-[#f5f5f0]/30 transition-colors">
                    <td className="px-8 py-6 font-mono text-xs text-[#1a1a1a]/40">#{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-[#1a1a1a]/40">{order.shippingAddress.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold">₹{order.total}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-[#1a1a1a]/40">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center space-x-4">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] hover:underline"
                        >
                          Details
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/shipping/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  order_id: order.id,
                                  order_date: order.createdAt,
                                  pickup_location: "Primary",
                                  billing_customer_name: order.shippingAddress.fullName,
                                  billing_last_name: "",
                                  billing_address: order.shippingAddress.address,
                                  billing_city: order.shippingAddress.city,
                                  billing_pincode: order.shippingAddress.zipCode,
                                  billing_state: order.shippingAddress.state || "Haryana",
                                  billing_country: "India",
                                  billing_email: order.shippingAddress.email,
                                  billing_phone: order.shippingAddress.phone,
                                  shipping_is_billing: true,
                                  order_items: order.items.map(item => ({
                                    name: item.name,
                                    sku: item.productId,
                                    units: item.quantity,
                                    selling_price: item.price
                                  })),
                                  payment_method: "Prepaid",
                                  sub_total: order.total,
                                  length: 10,
                                  breadth: 10,
                                  height: 10,
                                  weight: 0.5
                                })
                              });
                              const data = await res.json();
                              if (data.order_id) {
                                toast.success(`Shiprocket Order Created: ${data.order_id}`);
                                await updateDoc(doc(db, 'orders', order.id), { status: 'processing' });
                                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'processing' } : o));
                              } else {
                                toast.error(data.message || 'Shiprocket Error');
                              }
                            } catch (e) {
                              toast.error('Failed to connect to Shiprocket');
                            }
                          }}
                          className="text-[10px] uppercase tracking-widest font-bold bg-[#5A5A40] text-white px-4 py-2 rounded-full hover:bg-[#4a4a35] transition-all"
                        >
                          Ship
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f0]/50 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                  <th className="px-8 py-6">Banner</th>
                  <th className="px-8 py-6">Title</th>
                  <th className="px-8 py-6">Order</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {banners
                  .filter(b => b.title.toLowerCase().includes(bannerSearchTerm.toLowerCase()))
                  .map((banner) => (
                  <tr key={banner.id} className="hover:bg-[#f5f5f0]/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="w-24 h-12 bg-[#f5f5f0] rounded-lg overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-medium">{banner.title}</p>
                        <p className="text-xs text-[#1a1a1a]/40">{banner.subtitle}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold">{banner.order}</td>
                    <td className="px-8 py-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-4">
                        <button onClick={() => handleBannerEdit(banner)} className="p-2 hover:bg-[#f5f5f0] rounded-full text-[#5A5A40] transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleBannerDelete(banner.id)} className="p-2 hover:bg-[#f5f5f0] rounded-full text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-12 no-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-[#f5f5f0] rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-light italic">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-[#1a1a1a]/40 text-sm uppercase tracking-widest">Enter product details below</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Product Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="e.g., Cold Pressed Mustard Oil"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all appearance-none"
                    >
                      <option value="Cold Pressed">Cold Pressed</option>
                      <option value="Essential">Essential</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skin Care">Skin Care</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Price (₹)</label>
                    <input 
                      required
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Stock Quantity</label>
                    <input 
                      required
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={18} />
                      <input 
                        required
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Description</label>
                    <textarea 
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-[24px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="Detailed product description..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Benefits (comma separated)</label>
                    <input 
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="Rich in Omega-3, Good for heart, High smoke point"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Usage Instructions</label>
                    <textarea 
                      name="usage"
                      value={formData.usage}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-[24px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="Best used for sautéing and deep frying..."
                    />
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-[#5A5A40] text-white py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center justify-center space-x-3"
                    >
                      <Save size={18} />
                      <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Banner Modal */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-12 no-scrollbar"
            >
              <button 
                onClick={() => setIsBannerModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-[#f5f5f0] rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-light italic">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                  <p className="text-[#1a1a1a]/40 text-sm uppercase tracking-widest">Enter banner details below</p>
                </div>

                <form onSubmit={handleBannerSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Banner Title</label>
                    <input 
                      required
                      value={bannerFormData.title}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="e.g., Pure Cold Pressed Oils"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Subtitle</label>
                    <input 
                      value={bannerFormData.subtitle}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="e.g., Experience the essence of nature"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Image URL</label>
                    <input 
                      required
                      value={bannerFormData.image}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Display Order</label>
                      <input 
                        type="number"
                        value={bannerFormData.order}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, order: Number(e.target.value) })}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Status</label>
                      <select 
                        value={bannerFormData.active ? 'true' : 'false'}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, active: e.target.value === 'true' })}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all appearance-none"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Link (Optional)</label>
                    <input 
                      value={bannerFormData.link}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, link: e.target.value })}
                      className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="/shop"
                    />
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-[#5A5A40] text-white py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center justify-center space-x-3"
                    >
                      <Save size={18} />
                      <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-12 no-scrollbar"
            >
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-[#f5f5f0] rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-light italic">Order Details</h2>
                    <p className="text-[#1a1a1a]/40 text-sm uppercase tracking-widest font-mono">#{selectedOrder.id}</p>
                  </div>
                  <div className="text-right space-y-4">
                    <select 
                      value={selectedOrder.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value as Order['status'];
                        try {
                          await updateDoc(doc(db, 'orders', selectedOrder.id), { status: newStatus });
                          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
                          setSelectedOrder({ ...selectedOrder, status: newStatus });
                          toast.success(`Order status updated to ${newStatus}`);
                        } catch (err) {
                          toast.error('Failed to update status');
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold appearance-none cursor-pointer focus:outline-none ring-1 ring-[#1a1a1a]/10 ${
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <p className="text-sm text-[#1a1a1a]/40">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40">Customer Information</h3>
                      <div className="bg-[#f5f5f0] p-6 rounded-[24px] space-y-2">
                        <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                        <p className="text-sm text-[#1a1a1a]/60">{selectedOrder.shippingAddress.email}</p>
                        <p className="text-sm text-[#1a1a1a]/60">{selectedOrder.shippingAddress.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40">Shipping Address</h3>
                      <div className="bg-[#f5f5f0] p-6 rounded-[24px] space-y-1">
                        <p className="text-sm text-[#1a1a1a]/60">{selectedOrder.shippingAddress.address}</p>
                        <p className="text-sm text-[#1a1a1a]/60">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}</p>
                        <p className="text-sm text-[#1a1a1a]/60">India</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]/40">Order Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center space-x-4 bg-[#f5f5f0] p-4 rounded-[20px]">
                            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-[#1a1a1a]/40">₹{item.price} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#1a1a1a]/5">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1a1a1a]/40 uppercase tracking-widest">Subtotal</span>
                        <span className="font-medium">₹{selectedOrder.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1a1a1a]/40 uppercase tracking-widest">Shipping</span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between text-xl pt-4 border-t border-[#1a1a1a]/10">
                        <span className="font-light italic">Total</span>
                        <span className="font-bold">₹{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold border border-[#1a1a1a]/10 hover:bg-[#f5f5f0] transition-all"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-[#5A5A40] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all"
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
