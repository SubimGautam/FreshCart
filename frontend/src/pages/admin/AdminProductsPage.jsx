import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { getProductsRequest } from '../../services/productService';
import { createProductRequest, updateProductRequest, deleteProductRequest } from '../../services/adminService';
import { uploadImageRequest } from '../../services/uploadService';

const emptyProduct = {
  name: '',
  category: '',
  price: '',
  discountPrice: '',
  unit: '',
  stock: '',
  description: '',
  imageUrl: '',
  isFeatured: false,
  isBestSeller: false,
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsRequest({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImageRequest(file);
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
      };

      if (editingId) {
        await updateProductRequest(editingId, payload);
        toast.success('Product updated');
      } else {
        await createProductRequest(payload);
        toast.success('Product added — now live on the shop! 🎉');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyProduct);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || '',
      unit: product.unit,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProductRequest(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Could not delete product');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-extrabold text-ink">🛒 Manage Products</h1>
        <button
          onClick={() => { setForm(emptyProduct); setEditingId(null); setShowForm(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-full transition shadow-pop active:translate-y-0.5 active:shadow-none"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-primary-100 shadow-card p-6 mb-8 max-w-2xl">
          <h2 className="font-display font-bold text-ink text-lg mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-100 flex-shrink-0">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🛒</span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-full transition disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP. Max 5MB.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <input
              required
              placeholder="Category (e.g. Fruits)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <input
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="Price ($)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Discount Price (optional)"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <input
              required
              placeholder="Unit (e.g. 1 kg)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full mt-3 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none resize-none"
          />

          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              ✨ Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
              />
              🔥 Best Seller
            </label>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-full transition"
            >
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="text-gray-500 hover:text-gray-700 px-6 py-2.5 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No products yet. Add your first one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-left">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>🛒</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{product.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.isFeatured && <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-bold">Featured</span>}
                            {product.isBestSeller && <span className="text-[10px] bg-flash-300 text-ink px-1.5 py-0.5 rounded-full font-bold">Best Seller</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{product.category}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-deal-600">${product.price.toFixed(2)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">${product.discountPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={product.stock === 0 ? 'text-red-500 font-bold' : 'text-gray-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleEdit(product)} className="text-primary-600 hover:underline font-bold text-sm mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline font-bold text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
