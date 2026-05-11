import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  Heart, 
  ChevronRight, 
  Bell, 
  Plus, 
  Trash2,
  X,
  LayoutDashboard,
  BarChart3,
  Tag,
  Image as ImageIcon,
  Edit3,
  ArrowLeft,
  Sparkles,
  Star,
  MapPin,
  Info,
  Phone,
  Home,
  Eye,
  EyeOff,
  LogOut,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Truck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, Product, Category, Banner, ShopInfo, SubCategory } from './types';

function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Auth & Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'admin' | 'listing'>('home');
  const [listingContext, setListingContext] = useState<{ title: string; type: 'trending' | 'category' | 'subcategory'; id?: number | string } | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'categories' | 'subcategories' | 'banners' | 'shopinfo'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | 'All'>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [infoModal, setInfoModal] = useState<'about' | 'contact' | 'social' | 'outlets' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = data?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId === 'All' || String(product.categoryId) === String(selectedCategoryId);
    const matchesSubCategory = selectedSubCategoryId === 'All' || String(product.subCategoryId) === String(selectedSubCategoryId);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const discountNum = parseInt(product.discount) || 0;
    const matchesDiscount = discountNum >= minDiscount;
    const matchesTrending = !showTrendingOnly || product.trending;

    return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice && matchesDiscount && matchesTrending;
  }) || [];

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      oldPrice: Number(formData.get('oldPrice')),
      discount: formData.get('discount') as string,
      img: formData.get('img') as string,
      categoryId: Number(formData.get('categoryId')),
      subCategoryId: Number(formData.get('subCategoryId')),
      trending: formData.get('trending') === 'on',
      description: formData.get('description') as string,
      url: formData.get('url') as string,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        setEditingProduct(null);
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCat = {
      name: formData.get('name') as string,
      img: formData.get('img') as string,
    };
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (err) { console.error(err); }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const addSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subCatData = {
      name: formData.get('name') as string,
      img: formData.get('img') as string,
    };
    try {
      if (editingSubCategory) {
        await fetch(`/api/subcategories/${editingSubCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subCatData),
        });
        setEditingSubCategory(null);
      } else {
        await fetch('/api/subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subCatData),
        });
      }
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (err) { console.error(err); }
  };

  const deleteSubCategory = async (id: number) => {
    try {
      await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const addBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBanner = {
      url: formData.get('url') as string,
      link: formData.get('link') as string || '#',
    };
    try {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
      });
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (err) { console.error(err); }
  };

  const deleteBanner = async (id: number) => {
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const updateSettings = async (settings: Partial<AppData['settings']>) => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const updateShopInfo = async (shopInfo: Partial<ShopInfo>) => {
    try {
      await fetch('/api/shopinfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopInfo),
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'sameeryadav1132@gmail.com' && loginPassword === '113224') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setShowLoginModal(false);
      setView('admin');
      setAuthError('');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setAuthError('Access Denied: Invalid Credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setView('home');
  };

  if (loading) return <div className="flex items-center justify-center h-screen font-bold text-2xl italic tracking-tighter">Z STORE...</div>;
  if (!data) return <div>Error loading data.</div>;

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden relative">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 pb-10 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-[#2874F0]/5 to-transparent">
                <div>
                   <h1 className="text-2xl font-black italic tracking-tighter text-[#2874F0]">
                    Z STORE
                  </h1>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Premium Collection</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-2">
                {[
                  { icon: Info, label: 'About Us', action: () => setInfoModal('about') },
                  { icon: Phone, label: 'Contact Us', action: () => setInfoModal('contact') },
                  { icon: Instagram, label: 'Social Media', action: () => setInfoModal('social') },
                  { icon: MapPin, label: 'Our Outlets', action: () => setInfoModal('outlets') }
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      if ('action' in item) item.action();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                        <item.icon className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2874F0] transform group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex -space-x-2">
                    {data?.shopInfo?.facebook && data.shopInfo.facebook !== '#' && (
                      <a href={data.shopInfo.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center"><Facebook className="w-4 h-4 text-blue-600" /></a>
                    )}
                    {data?.shopInfo?.instagram && data.shopInfo.instagram !== '#' && (
                      <a href={data.shopInfo.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center"><Instagram className="w-4 h-4 text-pink-600" /></a>
                    )}
                    {data?.shopInfo?.twitter && data.shopInfo.twitter !== '#' && (
                      <a href={data.shopInfo.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center"><Twitter className="w-4 h-4 text-sky-600" /></a>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                    Don't waste your money on overrated expensive articles, get same thing at reasonable price
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                   <button 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      if (isAuthenticated) setView('admin');
                      else setShowLoginModal(true);
                    }}
                    className="p-4 bg-gray-900 text-white rounded-full shadow-lg active:scale-90 transition-all hover:bg-[#2874F0] group"
                   >
                     <Home className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Login Modal (Glassmorphism) */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowLoginModal(false); setAuthError(''); }}
              className="absolute inset-0 bg-[#1E40AF]/20 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] shadow-2xl border border-white/50 relative z-10"
            >
              <button 
                onClick={() => { setShowLoginModal(false); setAuthError(''); }}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2874F0] to-[#1E40AF] rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-200 mb-6 group transition-transform hover:rotate-6">
                  <Star className="w-8 h-8 text-white fill-current" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Admin Portal</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 px-6">Secure entry for staff only</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="Admin Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/60 border border-gray-100 rounded-[20px] py-4 px-6 outline-none focus:ring-4 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="relative group">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/60 border border-gray-100 rounded-[20px] py-4 px-14 outline-none focus:ring-4 focus:ring-[#2874F0]/10 focus:border-[#2874F0] transition-all text-sm font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                      <Star className="w-4 h-4" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2874F0] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100"
                    >
                      🔥 {authError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#2874F0] to-[#1E40AF] text-white py-4 rounded-[20px] font-black shadow-xl shadow-blue-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-4 uppercase tracking-tighter"
                >
                  Verify Credentials <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header - Only visible on Home */}
      {view === 'home' && (
        <header className="bg-gradient-to-b from-[#1E40AF] to-[#2874F0] text-white px-4 pt-4 pb-5 sticky top-0 z-50 shadow-lg shadow-black/10 active:shadow-none transition-shadow duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 bg-white/10 rounded-xl active:bg-white/20 transition-colors cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter drop-shadow-sm select-none" onClick={() => {
                setView('home'); 
                setListingContext(null);
                setSearchQuery(''); 
                setSelectedCategoryId('All'); 
                setSelectedSubCategoryId('All');
                setShowTrendingOnly(false);
              }}>
                Z STORE
              </h1>
            </div>
            <div className="flex items-center gap-4">
               {isAuthenticated && (
                 <div className="flex items-center gap-3">
                   <button 
                    onClick={handleLogout}
                    className="p-2 bg-white/10 rounded-xl text-white/60 hover:text-white"
                   >
                     <LogOut className="w-5 h-5" />
                   </button>
                   <div 
                     className={`p-2 rounded-xl transition-all ${(view as any) === 'admin' ? 'bg-yellow-400 text-blue-900 rotate-12 scale-110 shadow-lg' : 'bg-white/10 text-white active:bg-white/20'}`}
                     onClick={() => setView(view === 'home' ? 'admin' : 'home')}
                   >
                     <LayoutDashboard className="w-5 h-5" />
                   </div>
                 </div>
               )}
            </div>
          </div>
          <div className="flex gap-2.5 mt-3">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#2874F0] text-gray-400">
                 <Search className="w-4 h-4" />
              </div>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search premium products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 text-gray-800 rounded-2xl py-3.5 pl-11 pr-10 text-[13px] font-medium outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-transparent focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20 transition-all placeholder:text-gray-400/80"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                  id="clear-search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowFilters(true)}
              id="filter-trigger"
              className={`px-4 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm ${showFilters || selectedCategoryId !== 'All' || minDiscount > 0 ? 'bg-yellow-400 text-blue-900 shadow-yellow-400/20' : 'bg-white/15 text-white backdrop-blur-xl border border-white/10 hover:bg-white/25'}`}
            >
              <div className="relative">
                <Plus className={`w-5 h-5 transition-transform duration-500 ease-out ${showFilters ? 'rotate-45' : ''}`} />
                {(selectedCategoryId !== 'All' || minDiscount > 0) && !showFilters && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                )}
              </div>
            </button>
          </div>
        </header>
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[70] flex flex-col max-h-[85vh] shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Refine Search</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{filteredProducts.length} Items Matching</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCategoryId('All');
                    setSelectedSubCategoryId('All');
                    setPriceRange([0, 5000]);
                    setMinDiscount(0);
                    setSearchQuery('');
                  }}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-full font-bold text-xs ring-1 ring-gray-200"
                >
                  Reset
                </button>
              </div>

              {/* Drawer Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#2874F0] rounded-full" />
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Category</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        setSelectedCategoryId('All');
                        setSelectedSubCategoryId('All');
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedCategoryId === 'All' ? 'bg-[#2874F0] text-white border-[#2874F0] shadow-lg shadow-blue-100' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                      All
                    </button>
                    {data.categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setSelectedSubCategoryId('All');
                        }}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedCategoryId === cat.id ? 'bg-[#2874F0] text-white border-[#2874F0] shadow-lg shadow-blue-100' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCategoryId !== 'All' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-yellow-400 rounded-full" />
                      <label className="text-xs font-black text-gray-900 uppercase tracking-widest">Sub-Category</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       <button 
                        onClick={() => setSelectedSubCategoryId('All')}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedSubCategoryId === 'All' ? 'bg-yellow-400 text-blue-900 border-yellow-400' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                        Everything in {data.categories.find(c => c.id === selectedCategoryId)?.name}
                      </button>
                      {data.subCategories.filter(sc => 
                        data.products.some(p => p.categoryId === selectedCategoryId && p.subCategoryId === sc.id)
                      ).map(sc => (
                        <button 
                          key={sc.id}
                          onClick={() => setSelectedSubCategoryId(sc.id)}
                          className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedSubCategoryId === sc.id ? 'bg-yellow-400 text-blue-900 border-yellow-400 shadow-lg shadow-yellow-50' : 'bg-white text-gray-600 border-gray-200'}`}
                        >
                          {sc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-[#2874F0] rounded-full" />
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">Price Range</label>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-900">₹0 - ₹{priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#2874F0]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3">
                    <span className="bg-gray-50 px-2 py-1 rounded">₹0</span>
                    <span className="bg-gray-50 px-2 py-1 rounded">₹5,000+</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#2874F0] rounded-full" />
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">Minimum Discount</label>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 10, 30, 50, 70].map(disc => (
                      <button 
                        key={disc}
                        onClick={() => setMinDiscount(disc)}
                        className={`py-3 rounded-2xl text-[11px] font-black border transition-all flex flex-col items-center justify-center ${minDiscount === disc ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-100 scale-105' : 'bg-white text-gray-500 border-gray-100'}`}
                      >
                        {disc === 0 ? 'any' : `${disc}%`}
                        <span className="text-[8px] opacity-70 mt-0.5">{disc !== 0 && 'OFF'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer - Sticky */}
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-[#2874F0] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-[0.97] transition-all transform flex items-center justify-center gap-3 uppercase tracking-tighter"
                >
                  Apply Filters
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px]">{filteredProducts.length} Items</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
          >
            {/* Banner Slider (Mock) */}
            <div className="mt-1 h-44 overflow-x-auto flex snap-x snap-mandatory no-scrollbar bg-white py-3">
               {data.banners.map(banner => (
                 <div key={banner.id} className="w-full flex-shrink-0 snap-center px-4">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-100">
                       <img src={banner.url} className="w-full h-full object-cover" alt="Offer" />
                    </div>
                 </div>
               ))}
            </div>

            {/* Promo Banner Section (Top) */}
            {data?.settings?.promoBannerUrl && (
              <div className="mt-1 px-4 h-32 w-full overflow-hidden">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                   <img src={data.settings.promoBannerUrl} className="w-full h-full object-cover" alt="Promo" />
                </div>
              </div>
            )}

            {/* Category Selector */}
            <div className="bg-white p-3 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {data.categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => {
                    setSearchQuery('');
                    setShowTrendingOnly(false);
                    setSelectedCategoryId(cat.id);
                    setSelectedSubCategoryId('All');
                    setListingContext({ title: cat.name, type: 'category', id: cat.id });
                    setView('listing');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-1 group"
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden border p-1 group-active:scale-95 transition-all ${selectedCategoryId === cat.id ? 'border-[#2874F0] ring-2 ring-[#2874F0]/20' : 'border-gray-100'}`}>
                    <img src={cat.img} className="w-full h-full object-cover rounded-full" alt={cat.name} />
                  </div>
                  <span className={`text-[11px] font-bold ${selectedCategoryId === cat.id ? 'text-[#2874F0]' : 'text-gray-700'}`}>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Trending Section */}
            {data?.settings?.showTrendingBanner && filteredProducts.filter(p => p.trending).length > 0 && searchQuery === '' && selectedCategoryId === 'All' && !showTrendingOnly && (
              <div className="mt-1 bg-[#d0e8ff] overflow-hidden">
                {/* Modern Fashion Sale Banner - Custom Image or Default Design */}
                {data.settings.trendingBannerUrl ? (
                  <div className="relative mb-1 h-28 w-full overflow-hidden">
                    <img 
                      src={data.settings.trendingBannerUrl} 
                      className="w-full h-full object-cover" 
                      alt="Trending Banner" 
                    />
                  </div>
                ) : (
                  <div className="relative mb-1 h-18 bg-gradient-to-br from-[#1E40AF] via-[#2874F0] to-[#60A5FA] flex flex-col justify-center px-6 overflow-hidden">
                    {/* Sparkle Decorations */}
                    <div className="absolute top-1 right-6 opacity-20">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="absolute -bottom-2 left-4 opacity-10">
                      <Star className="w-10 h-10 text-white fill-current" />
                    </div>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                    
                    <div className="relative z-10">
                      <h2 className="text-xl font-display font-black text-white italic tracking-tight drop-shadow-[0_2px_6px_rgba(255,255,255,0.3)]">
                        Trending <span className="text-yellow-300">🔥</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="h-[1px] w-4 bg-blue-200/50" />
                        <p className="text-[8px] font-black text-blue-100 uppercase tracking-[0.2em]">Curated Picks</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Horizontal Scrolling Carousel */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 scroll-smooth">
                  {filteredProducts.filter(p => p.trending).map(product => (
                    <div 
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="flex-shrink-0 w-28 group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 shadow-[0_8px_20px_rgba(0,0,0,0.06)] group-active:scale-95 transition-all duration-300">
                        <img 
                          src={product.img} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={product.name} 
                        />
                      </div>
                      <div className="mt-2.5 px-0.5">
                        <h3 className="text-[10px] font-bold text-gray-800 line-clamp-1 group-hover:text-[#2874F0] transition-colors">{product.name}</h3>
                        <div className="flex flex-col mt-0.5">
                          <span className="text-xs font-black text-gray-900 leading-tight">₹{product.price}</span>
                          <span className="text-[8px] line-through text-gray-400 font-medium">₹{product.oldPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Centered See All Button */}
                <div className="flex justify-center pb-4">
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryId('All');
                      setSelectedSubCategoryId('All');
                      setMinDiscount(0);
                      setPriceRange([0, 5000]);
                      setShowTrendingOnly(true);
                      setListingContext({ title: 'Trending Highlights', type: 'trending' });
                      setView('listing');
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="px-8 py-3 rounded-full bg-white border border-gray-200 text-[11px] font-black uppercase tracking-widest text-gray-900 shadow-sm hover:shadow-md hover:border-gray-300 active:scale-95 transition-all flex items-center gap-2"
                  >
                    See all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="h-px bg-gray-50 mx-4" />
              </div>
            )}

            {/* Quick Categories Bar (Sub-categories) */}
            {searchQuery === '' && !showTrendingOnly && (
              <div className="mt-1 bg-white p-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  {selectedCategoryId === 'All' ? 'Shop by Style' : `Shop ${data.categories.find(c => String(c.id) === String(selectedCategoryId))?.name || ''} Styles`}
                </h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                  {(selectedCategoryId === 'All' 
                    ? data.subCategories 
                    : data.subCategories.filter(sc => 
                        data.products.some(p => String(p.categoryId) === String(selectedCategoryId) && String(p.subCategoryId) === String(sc.id))
                      )
                  ).map(sc => (
                    <button 
                      key={sc.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowTrendingOnly(false);
                        setSelectedSubCategoryId(sc.id);
                        
                        // Find parent category to maintain consistency
                        const productWithSub = data.products.find(p => String(p.subCategoryId) === String(sc.id));
                        const parentCat = productWithSub?.categoryId;
                        
                        if (parentCat) setSelectedCategoryId(parentCat);
                        else setSelectedCategoryId('All');

                        setListingContext({ title: sc.name, type: 'subcategory', id: sc.id });
                        setView('listing');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="flex-shrink-0 flex flex-col items-center gap-2 group w-20"
                    >
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 group-active:scale-95 transition-all shadow-sm ${String(selectedSubCategoryId) === String(sc.id) ? 'border-[#2874F0]' : 'border-gray-50'}`}>
                        <img src={sc.img} className="w-full h-full object-cover" alt={sc.name} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter text-center line-clamp-1 ${String(selectedSubCategoryId) === String(sc.id) ? 'text-[#2874F0]' : 'text-gray-600'}`}>{sc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mid Banner Section */}
            {data?.settings?.midBannerUrl && (
              <div className="w-full overflow-hidden">
                <div className="relative w-full">
                  <img 
                    src={data.settings.midBannerUrl} 
                    className="w-full h-auto block" 
                    alt="Mid Banner" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            )}

            {/* Main Listing Section */}
            <div id="all-products" className="bg-white pt-4 px-4 pb-0">
              <div className="flex justify-between items-baseline mb-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {showTrendingOnly ? 'Trending Highlights' : (searchQuery || selectedCategoryId !== 'All' ? 'Search Results' : 'All Products')}
                  </h2>
                  {showTrendingOnly && (
                    <button 
                      onClick={() => setShowTrendingOnly(false)}
                      className="text-[10px] font-black text-[#2874F0] flex items-center gap-1 uppercase"
                    >
                      Show All Products <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {selectedCategoryId !== 'All' && !showTrendingOnly && !searchQuery && (
                    <button 
                      onClick={() => {
                        setSelectedCategoryId('All');
                        setSelectedSubCategoryId('All');
                      }}
                      className="text-[10px] font-black text-[#2874F0] flex items-center gap-1 uppercase"
                    >
                      Clear Category ({data.categories.find(c => c.id === selectedCategoryId)?.name}) <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} Items</span>
                   <button 
                    onClick={() => {
                      setListingContext({ 
                        title: showTrendingOnly ? 'Trending Highlights' : (searchQuery || (selectedCategoryId !== 'All' ? data.categories.find(c => c.id === selectedCategoryId)?.name || 'Filtered' : 'All Products')),
                        type: showTrendingOnly ? 'trending' : 'category'
                      });
                      setView('listing');
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="text-[10px] font-black text-[#2874F0] flex items-center gap-0.5 active:scale-95"
                   >
                     VIEW ALL <ChevronRight className="w-2.5 h-2.5" />
                   </button>
                </div>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 p-1.5">
                  {filteredProducts.slice(0, 6).map(product => (
                    <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                  ))}
                  {filteredProducts.length > 6 && (
                    <button 
                      onClick={() => {
                        setListingContext({ 
                          title: showTrendingOnly ? 'Trending Highlights' : (searchQuery || (selectedCategoryId !== 'All' ? data.categories.find(c => c.id === selectedCategoryId)?.name || 'Filtered' : 'All Products')),
                          type: showTrendingOnly ? 'trending' : 'category'
                        });
                        setView('listing');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="col-span-3 py-4 bg-gray-50 rounded-2xl text-xs font-black text-[#2874F0] uppercase tracking-widest border border-dashed border-gray-200 mt-2 active:scale-95 transition-all outline-none"
                    >
                      View All {filteredProducts.length} Products
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
                     <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No results found</h3>
                  <p className="text-sm text-gray-400 max-w-[200px] mx-auto mt-2 italic">Try adjusting your filters or search query to find what you're looking for.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryId('All');
                      setSelectedSubCategoryId('All');
                      setMinDiscount(0);
                      setPriceRange([0, 5000]);
                      setShowTrendingOnly(false);
                    }}
                    className="mt-6 text-[#2874F0] font-bold text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Footer Banner Image */}
            {data?.settings?.footerStickyUrl && (
              <div className="mt-1 w-full">
                <div className="relative w-full">
                  <img 
                    src={data.settings.footerStickyUrl} 
                    className="w-full h-auto block" 
                    alt="Footer Banner" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ) : view === 'listing' ? (
          <motion.div 
            key="listing"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="min-h-screen bg-white pb-20"
          >
            {/* Listing Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 z-50 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setView('home');
                    setShowTrendingOnly(false);
                    setListingContext(null);
                    setSelectedCategoryId('All');
                    setSelectedSubCategoryId('All');
                    setSearchQuery('');
                  }}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-900"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-none">{listingContext?.title}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{filteredProducts.length} Items Found</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(true)} className="p-2 bg-gray-50 rounded-xl relative">
                  <Menu className="w-5 h-5 text-gray-600" />
                  {(selectedCategoryId !== 'All' || minDiscount > 0) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                  )}
                </button>
              </div>
            </div>
            <div className="px-3 py-4">
               {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-3 gap-2 p-1.5">
                   {filteredProducts.map(product => (
                     <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                   ))}
                 </div>
               ) : (
                  <div className="text-center py-20">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-800">No matches in this section</h3>
                    <button onClick={() => setView('home')} className="mt-4 text-[#2874F0] text-sm font-bold">Return to home</button>
                  </div>
               )}
            </div>
          </motion.div>
        ) : (
          isAuthenticated ? (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-10"
            >
              {/* Admin Panel Header with Back Button */}
              <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setView('home')}
                      className="p-2.5 bg-gray-50 rounded-2xl text-gray-900 active:scale-90 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                       <h2 className="text-lg font-black text-gray-900 tracking-tighter">Admin Dashboard</h2>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store Management</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase ring-1 ring-green-100">Verified</div>
                 </div>
              </div>

              {/* Admin Tabs */}
              <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scrollbar sticky top-[68px] z-40 p-1">
                {[
                  { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                  { id: 'products', label: 'Products', icon: ShoppingBag },
                  { id: 'categories', label: 'Categories', icon: Tag },
                  { id: 'subcategories', label: 'Sub-Categories', icon: Tag },
                  { id: 'banners', label: 'Banners', icon: ImageIcon },
                  { id: 'shopinfo', label: 'Store Info', icon: Info }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold whitespace-nowrap rounded-lg transition-all ${adminTab === tab.id ? 'bg-[#2874F0]/10 text-[#2874F0]' : 'text-gray-400'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {adminTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Global Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-yellow-400">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <BarChart3 className="w-4 h-4 text-yellow-500" /> App Configuration
                      </h3>
                      <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-xl border border-gray-100">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-100 rounded-lg">
                                  <Star className="w-5 h-5 text-blue-600" />
                               </div>
                               <div>
                                 <p className="text-sm font-black text-gray-800">Trending 🔥 Banner</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Main home screen section</p>
                               </div>
                            </div>
                            <button 
                             onClick={() => updateSettings({ showTrendingBanner: !data.settings.showTrendingBanner })}
                             className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${data.settings.showTrendingBanner ? 'bg-[#2874F0]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${data.settings.showTrendingBanner ? 'left-8' : 'left-1'}`} />
                            </button>
                         </div>
                         
                         <div className="mt-2 text-left">
                           <div className="flex justify-between items-end mb-2 px-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Trending Banner URL</label>
                              <span className="text-[9px] font-black text-blue-500 uppercase tracking-tight">Recommended: 1200 x 300px</span>
                           </div>
                           <div className="flex gap-2">
                             <input 
                              placeholder="https://..."
                              defaultValue={data.settings.trendingBannerUrl}
                              onBlur={(e) => updateSettings({ trendingBannerUrl: e.target.value })}
                              className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-[11px] font-medium"
                             />
                             {data.settings.trendingBannerUrl && (
                               <button 
                                 onClick={() => updateSettings({ trendingBannerUrl: '' })}
                                 className="px-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-100 transition-colors"
                               >
                                 CLEAR
                               </button>
                             )}
                           </div>
                           {data.settings.trendingBannerUrl && (
                              <div className="mt-3 relative h-14 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
                                 <img src={data.settings.trendingBannerUrl} className="w-full h-full object-cover opacity-50" alt="Preview" />
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[8px] font-black text-gray-900 bg-white/90 px-2.5 py-1 rounded-lg uppercase shadow-sm border border-gray-100">Live Preview</span>
                                 </div>
                              </div>
                           )}
                           <p className="text-[9px] text-gray-400 mt-2 px-1 italic">* Paste an image URL here to override the default blue gradient design.</p>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Products</p>
                        <h3 className="text-3xl font-black text-gray-900">{data.products.length}</h3>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Categories</p>
                        <h3 className="text-3xl font-black text-gray-900">{data.categories.length}</h3>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Banners</p>
                        <h3 className="text-3xl font-black text-gray-900">{data.banners.length}</h3>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Trending</p>
                        <h3 className="text-3xl font-black text-gray-900">{data.products.filter(p => p.trending).length}</h3>
                      </div>
                    </div>
                  </div>
                )}
                {adminTab === 'products' && (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border-b-4 border-[#2874F0]">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
                          {editingProduct ? <Edit3 className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-[#2874F0]" />}
                          {editingProduct ? 'Update Product' : 'Add New Product'}
                        </h2>
                        {editingProduct && (
                          <button 
                            onClick={() => setEditingProduct(null)}
                            className="text-[10px] font-black uppercase text-gray-400 border border-gray-100 px-3 py-1 rounded-full"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                      <form onSubmit={addProduct} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                Image URL <span className="text-[#2874F0] ml-1">(Recommended: 800x1000 px)</span>
                              </label>
                              <input name="img" required type="url" defaultValue={editingProduct?.img} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Title</label>
                              <input name="name" required defaultValue={editingProduct?.name} placeholder="Product Title" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Price (₹)</label>
                              <input name="price" required type="number" defaultValue={editingProduct?.price} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Old Price (₹)</label>
                              <input name="oldPrice" required type="number" defaultValue={editingProduct?.oldPrice} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Discount Text</label>
                              <input name="discount" required defaultValue={editingProduct?.discount} placeholder="60% OFF" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Display in Trending</label>
                              <div className="flex items-center gap-3 bg-gray-50 rounded-xl py-3 px-4 h-full">
                                <input type="checkbox" name="trending" id="trending-p" defaultChecked={editingProduct?.trending} className="w-5 h-5 rounded-lg border-none bg-white text-[#2874F0] focus:ring-transparent shadow-sm" />
                                <label htmlFor="trending-p" className="text-xs font-bold text-gray-700">Featured</label>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category (Who for?)</label>
                             <select name="categoryId" defaultValue={editingProduct?.categoryId} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium">
                               {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Sub-Category (Type)</label>
                            <select name="subCategoryId" defaultValue={editingProduct?.subCategoryId} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium">
                              {data.subCategories.map(sc => (
                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                          <textarea name="description" rows={3} defaultValue={editingProduct?.description} placeholder="Tell us more about this product..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Product Purchase URL (Direct Buy Link)</label>
                          <input name="url" type="url" defaultValue={editingProduct?.url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <button type="submit" className={`w-full ${editingProduct ? 'bg-orange-500 shadow-orange-100' : 'bg-gray-900 shadow-gray-200'} text-white py-4 rounded-2xl font-black shadow-xl mt-4 active:scale-95 transition-all`}>
                          {editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-tighter">Inventory ({data.products.length})</h2>
                      <div className="space-y-4">
                        {data.products.map(p => (
                          <div key={p.id} className="flex gap-4 p-4 border border-gray-50 rounded-2xl relative group bg-gray-50/50">
                            <img src={p.img} className="w-20 h-24 object-cover rounded-xl shadow-inner" alt={p.name} />
                            <div className="flex-1">
                              <h4 className="text-sm font-black text-gray-800 line-clamp-1">{p.name}</h4>
                              <p className="text-[10px] font-bold text-[#2874F0] bg-white px-2 py-0.5 rounded-full inline-block mt-1 border border-blue-50">
                                {data.categories.find(c => c.id === p.categoryId)?.name} » {data.subCategories.find(sc => sc.id === p.subCategoryId)?.name}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-base font-black text-gray-900">₹{p.price}</span>
                                <span className="text-xs line-through text-gray-400">₹{p.oldPrice}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                              <button 
                                onClick={() => {
                                  setEditingProduct(p);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-2.5 bg-white text-gray-400 rounded-xl border border-gray-100 shadow-sm active:scale-90"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteProduct(p.id)}
                                className="p-2.5 bg-white text-red-500 rounded-xl border border-red-50 shadow-sm shadow-red-50 active:scale-90"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {adminTab === 'categories' && (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <Tag className="w-5 h-5 text-[#2874F0]" /> New Category
                      </h2>
                      <form onSubmit={addCategory} className="space-y-4">
                        <input name="name" required placeholder="Category Name (e.g. Footwear)" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                            Category Image URL <span className="text-[#2874F0] ml-1">(Recommended: 500x500 px)</span>
                          </label>
                          <input name="img" required type="url" placeholder="Paste link here..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <button type="submit" className="w-full bg-[#2874F0] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-all">
                          CREATE CATEGORY
                        </button>
                      </form>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {data.categories.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm relative group">
                          <img src={c.img} className="w-full aspect-square object-cover rounded-xl mb-3 shadow-inner" alt={c.name} />
                          <p className="text-sm font-black text-center text-gray-800">{c.name}</p>
                          <button 
                            onClick={() => deleteCategory(c.id)}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl shadow-lg border border-red-50 transition-transform active:scale-90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {adminTab === 'subcategories' && (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border-b-4 border-yellow-400">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <Tag className="w-5 h-5 text-yellow-400" /> {editingSubCategory ? 'Update Product Type' : 'New Product Type (Sub-Cat)'}
                      </h2>
                      <form onSubmit={addSubCategory} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Sub-Category Name</label>
                          <input name="name" required defaultValue={editingSubCategory?.name} placeholder="e.g. Tshirts, Joggers, Dresses" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                            Thumbnail URL <span className="text-[#2874F0] ml-1">(500x500 px)</span>
                          </label>
                          <input name="img" required type="url" defaultValue={editingSubCategory?.img} placeholder="Paste link here..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <div className="flex gap-3">
                          {editingSubCategory && (
                            <button type="button" onClick={() => setEditingSubCategory(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black active:scale-95 transition-all">
                              CANCEL
                            </button>
                          )}
                          <button type="submit" className="flex-[2] bg-yellow-400 text-blue-900 py-4 rounded-2xl font-black shadow-xl shadow-yellow-100 active:scale-95 transition-all">
                            {editingSubCategory ? 'UPDATE TYPE' : 'CREATE TYPE'}
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {data.subCategories.map(sc => (
                        <div key={sc.id} className="bg-white p-4 rounded-2xl shadow-sm relative group overflow-hidden">
                          <img src={sc.img} className="w-full aspect-square object-cover rounded-xl mb-3 shadow-inner" alt={sc.name} />
                          <div className="text-center">
                            <p className="text-sm font-black text-gray-800">{sc.name}</p>
                          </div>
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                             <button 
                              onClick={() => {
                                setEditingSubCategory(sc);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="p-2 bg-white/90 backdrop-blur-sm text-gray-400 rounded-xl shadow-lg border border-gray-100 active:scale-90"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteSubCategory(sc.id)}
                              className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl shadow-lg border border-red-50 active:scale-90"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {adminTab === 'banners' && (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 pb-8">
                       <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 uppercase tracking-tighter">
                          <ImageIcon className="w-5 h-5 text-indigo-500" /> Special Layout Images
                       </h2>
                       <div className="space-y-6">
                         <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Mid-Page Banner (Between styles & products)</label>
                            <input 
                              type="url"
                              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium"
                              defaultValue={data?.settings?.midBannerUrl}
                              onBlur={(e) => updateSettings({ midBannerUrl: e.target.value })}
                              placeholder="Image URL..."
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Footer Banner Image (Appears at bottom of list)</label>
                            <input 
                              type="url"
                              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-pink-100 text-sm font-medium"
                              defaultValue={data?.settings?.footerStickyUrl}
                              onBlur={(e) => updateSettings({ footerStickyUrl: e.target.value })}
                              placeholder="Image URL..."
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Section Promo Image (Extra layout section)</label>
                            <input 
                              type="url"
                              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-yellow-100 text-sm font-medium"
                              defaultValue={data?.settings?.promoBannerUrl}
                              onBlur={(e) => updateSettings({ promoBannerUrl: e.target.value })}
                              placeholder="Image URL..."
                            />
                         </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <ImageIcon className="w-5 h-5 text-[#2874F0]" /> New Banner
                      </h2>
                      <form onSubmit={addBanner} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                            Banner Image URL <span className="text-[#2874F0] ml-1">(Recommended: 1000x400 px)</span>
                          </label>
                          <input name="url" required type="url" placeholder="Paste link here..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        </div>
                        <input name="link" placeholder="Link to (Optional)" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium" />
                        <button type="submit" className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-yellow-100 active:scale-95 transition-all">
                          SAVE BANNER
                        </button>
                      </form>
                    </div>
                    <div className="space-y-4">
                      {data.banners.map(b => (
                        <div key={b.id} className="bg-white p-3 rounded-2xl shadow-sm relative group overflow-hidden">
                          <img src={b.url} className="w-full aspect-[2.5/1] object-cover rounded-xl shadow-inner" alt="Banner" />
                          <button 
                            onClick={() => deleteBanner(b.id)}
                            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl shadow-xl border border-red-50 transition-opacity active:scale-90"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {adminTab === 'shopinfo' && (
                  <div className="bg-white rounded-3xl shadow-sm p-6 space-y-8 animate-in fade-in duration-500 border border-gray-100 mb-20">
                    <div>
                      <h2 className="text-xl font-black flex items-center gap-3 text-gray-900 mb-6 font-italic">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                          <Info className="w-5 h-5 text-[#2874F0]" />
                        </div>
                        Store Information
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">About Us</label>
                          <textarea 
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium leading-relaxed"
                            rows={4}
                            defaultValue={data?.shopInfo?.about}
                            onBlur={(e) => updateShopInfo({ about: e.target.value })}
                            placeholder="Tell your customers about your store..."
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                            <input 
                              type="text"
                              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium"
                              defaultValue={data?.shopInfo?.phone}
                              onBlur={(e) => updateShopInfo({ phone: e.target.value })}
                              placeholder="+91 00000 00000"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Email Support</label>
                            <input 
                              type="email"
                              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium"
                              defaultValue={data?.shopInfo?.email}
                              onBlur={(e) => updateShopInfo({ email: e.target.value })}
                              placeholder="help@zstore.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Head Office Address</label>
                          <textarea 
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium"
                            rows={2}
                            defaultValue={data?.shopInfo?.address}
                            onBlur={(e) => updateShopInfo({ address: e.target.value })}
                            placeholder="Full physical address..."
                          />
                        </div>

                        <div className="p-4 bg-yellow-50/50 rounded-3xl border border-yellow-100/50">
                           <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-4 px-1">Social Media Links</p>
                           <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                              <input 
                                type="text"
                                className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-200 text-xs font-bold"
                                defaultValue={data?.shopInfo?.instagram}
                                onBlur={(e) => updateShopInfo({ instagram: e.target.value })}
                                placeholder="Instagram Profile URL"
                              />
                            </div>
                            <div className="relative">
                              <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                              <input 
                                type="text"
                                className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-200 text-xs font-bold"
                                defaultValue={data?.shopInfo?.facebook}
                                onBlur={(e) => updateShopInfo({ facebook: e.target.value })}
                                placeholder="Facebook Page URL"
                              />
                            </div>
                            <div className="relative">
                              <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                              <input 
                                type="text"
                                className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-sky-100 text-xs font-bold"
                                defaultValue={data?.shopInfo?.twitter}
                                onBlur={(e) => updateShopInfo({ twitter: e.target.value })}
                                placeholder="Twitter / X Profile URL"
                              />
                            </div>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                              <input 
                                type="text"
                                className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-green-100 text-xs font-bold"
                                defaultValue={data?.shopInfo?.whatsapp}
                                onBlur={(e) => updateShopInfo({ whatsapp: e.target.value })}
                                placeholder="WhatsApp Number"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Outlets & Store Locations</label>
                          <textarea 
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium"
                            rows={3}
                            defaultValue={data?.shopInfo?.outlets}
                            onBlur={(e) => updateShopInfo({ outlets: e.target.value })}
                            placeholder="Detail your physical store outlets..."
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Google Maps Direct Link (for 'Open' button)</label>
                          <input 
                            type="url"
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#2874F0]/20 text-sm font-medium"
                            defaultValue={data?.shopInfo?.googleMapsUrl}
                            onBlur={(e) => updateShopInfo({ googleMapsUrl: e.target.value })}
                            placeholder="https://maps.app.goo.gl/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="p-10 bg-white rounded-[40px] shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">Restricted Access</h2>
                  <p className="text-xs font-bold text-gray-400 mt-2">Please login via the sidebar</p>
               </div>
            </div>
          )
        )}
      </AnimatePresence>



      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col pt-[env(safe-area-inset-top)]"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
                id="close-product-detail"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</h3>
              <div className="flex gap-2">
                <button 
                  className="p-2 -mr-2 rounded-full active:bg-gray-100 transition-colors"
                  onClick={() => {
                    setSelectedProduct(null);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      searchInputRef.current?.focus();
                    }, 200);
                  }}
                >
                  <Search className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-100/50">
              <div className="relative bg-white">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={selectedProduct.img} 
                    className="w-full h-full object-contain bg-[#f8f8f8]" 
                    alt={selectedProduct.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="absolute bottom-12 left-4 z-10">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full shadow-2xl">
                     Special {selectedProduct.discount} Offer
                   </span>
                </div>
              </div>

              <div className="p-6 bg-white rounded-t-[2.5rem] relative z-20 shadow-[0_-15px_30px_rgba(0,0,0,0.04)]">
                <div className="w-10 h-1 bg-gray-200/60 rounded-full mx-auto mb-6" />
                
                <div className="mb-5">
                   <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center text-yellow-400">
                      {[1,2,3,4,5].map(i => <span key={i} className="text-[10px]">★</span>)}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Premium Quality</span>
                  </div>
                  <h2 className="text-[17px] font-black text-gray-900 leading-tight tracking-tight">{selectedProduct.name}</h2>
                </div>

                <div className="flex items-center gap-4 mb-8">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Our Price</span>
                     <span className="text-xl font-black text-gray-900">₹{selectedProduct.price}</span>
                   </div>
                   <div className="h-8 w-px bg-gray-100" />
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">MRP</span>
                     <span className="text-xs line-through text-gray-300 font-bold decoration-red-400/30">₹{selectedProduct.oldPrice}</span>
                   </div>
                   <span className="ml-auto text-[9px] font-black text-green-600 bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100 uppercase">
                     Save ₹{selectedProduct.oldPrice - selectedProduct.price}
                   </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Shipping</p>
                    <p className="text-xs font-bold text-gray-800">Fast Express</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Return</p>
                    <p className="text-xs font-bold text-gray-800">Exchange Only</p>
                  </div>
                </div>
                
                <div className="pb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gray-100" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] whitespace-nowrap">Features & Details</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gray-100" />
                  </div>
                  <div className="bg-gray-50/80 rounded-[2rem] p-6 border border-gray-100/50 shadow-sm">
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                      {selectedProduct.description || "This premium outfit is crafted with precision and high-quality materials to ensure comfort and style. Whether you're heading to a casual outing or a festive event, this piece will make you stand out."}
                    </p>
                    <div className="mt-5 pt-5 border-t border-gray-100/50 grid grid-cols-2 gap-y-3">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-50" />
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Premium Fabric</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-50" />
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Regular Fit</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-50" />
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Eco Friendly</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-50" />
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Durable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 pb-[env(safe-area-inset-bottom,20px)] border-t border-gray-100 bg-white/95 backdrop-blur-xl z-30">
              <button 
                id="buy-now-btn"
                onClick={() => {
                  if (selectedProduct?.url) {
                    window.open(selectedProduct.url, '_blank');
                  } else {
                    alert("Direct purchase link not found for this product.");
                  }
                }}
                className="w-full py-4 bg-yellow-400 text-blue-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-yellow-400/20 active:scale-95 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                     {infoModal === 'about' && <Info className="w-5 h-5 text-blue-600" />}
                     {infoModal === 'contact' && <Phone className="w-5 h-5 text-green-600" />}
                     {infoModal === 'social' && <Instagram className="w-5 h-5 text-pink-600" />}
                     {infoModal === 'outlets' && <MapPin className="w-5 h-5 text-red-500" />}
                   </div>
                   <div>
                     <h2 className="text-xl font-black text-gray-900 capitalize italic tracking-tighter">
                       {infoModal === 'about' ? 'About Us' : infoModal === 'contact' ? 'Contact Us' : infoModal === 'social' ? 'Social Media' : 'Our Outlets'}
                     </h2>
                   </div>
                </div>
                <button onClick={() => setInfoModal(null)} className="p-2 bg-gray-50 rounded-xl text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto no-scrollbar">
                {infoModal === 'about' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl border border-blue-50/50">
                      <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                        {data?.shopInfo?.about || "Welcome to Z Store. We are dedicated to providing you the best of products, with a focus on dependability and customer service."}
                      </p>
                    </div>
                  </div>
                )}

                {infoModal === 'contact' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                         <Phone className="w-6 h-6 text-green-500" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call or WhatsApp</p>
                         <p className="text-lg font-black text-gray-800">{data?.shopInfo?.phone || "+91 9876543210"}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                         <Bell className="w-6 h-6 text-blue-500" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Support</p>
                         <p className="text-lg font-black text-gray-800">{data?.shopInfo?.email || "support@zstore.com"}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                         <MapPin className="w-6 h-6 text-red-500" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Office</p>
                         <p className="text-sm font-bold text-gray-800 leading-relaxed mt-1">{data?.shopInfo?.address || "123, Fashion Street, Mumbai, India"}</p>
                       </div>
                    </div>
                  </div>
                )}

                {infoModal === 'outlets' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100/50">
                       <p className="text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-line mb-6 text-center">
                         {data?.shopInfo?.outlets || "Our outlets are located in key cities across India. Visit us for an exclusive in-store experience."}
                       </p>

                       {data?.shopInfo?.googleMapsUrl && (
                         <div className="flex flex-col items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 shadow-inner">
                              <MapPin className="w-6 h-6" />
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">View exact location on maps</p>
                              <a 
                                href={data.shopInfo.googleMapsUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 px-10 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-100 active:scale-95 transition-all text-sm uppercase"
                              >
                                OPEN
                              </a>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}

                {infoModal === 'social' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-pink-50/50 rounded-3xl border border-pink-100/50">
                      <p className="text-sm font-bold text-gray-700 leading-relaxed italic text-center mb-6">
                        Stay updated with our latest collections and offers. Follow us on our social channels!
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {data?.shopInfo?.instagram && data.shopInfo.instagram !== '#' && (
                          <a href={data.shopInfo.instagram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-pink-100">
                             <Instagram className="w-6 h-6 text-pink-500" />
                             <span className="text-[10px] font-black uppercase text-gray-400">Instagram</span>
                          </a>
                        )}
                        {data?.shopInfo?.facebook && data.shopInfo.facebook !== '#' && (
                          <a href={data.shopInfo.facebook} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                             <Facebook className="w-6 h-6 text-blue-600" />
                             <span className="text-[10px] font-black uppercase text-gray-400">Facebook</span>
                          </a>
                        )}
                        {data?.shopInfo?.twitter && data.shopInfo.twitter !== '#' && (
                          <a href={data.shopInfo.twitter} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-sky-100">
                             <Twitter className="w-6 h-6 text-sky-400" />
                             <span className="text-[10px] font-black uppercase text-gray-400">X / Twitter</span>
                          </a>
                        )}
                        {data?.shopInfo?.whatsapp && (
                          <a href={`https://wa.me/${data.shopInfo.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-green-100">
                             <Phone className="w-6 h-6 text-green-500" />
                             <span className="text-[10px] font-black uppercase text-gray-400">WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product, onClick: () => void }) {
  return (
    <div 
      className="bg-white rounded-2xl flex flex-col shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] rounded-t-2xl overflow-hidden">
        <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
        <div className="absolute bottom-1.5 left-1.5">
           <span className="text-[7px] font-black uppercase tracking-wider bg-yellow-400 text-blue-900 px-1.5 py-0.5 rounded-md shadow-sm">
             {product.discount} OFF
           </span>
        </div>
      </div>
      <div className="p-2 flex-1 flex flex-col rounded-b-2xl overflow-hidden">
        <h3 className="text-[10px] font-bold text-gray-800 line-clamp-1 mb-0.5">{product.name}</h3>
        <div className="mt-auto">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-900 leading-tight">₹{product.price}</span>
            <span className="text-[8px] line-through text-gray-400 font-medium tracking-tight">₹{product.oldPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
