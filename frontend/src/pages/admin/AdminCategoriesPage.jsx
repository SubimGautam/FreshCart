import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCategoryListRequest } from '../../services/productService';
import { createCategoryRequest, updateCategoryRequest, deleteCategoryRequest } from '../../services/adminService';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', icon: '🛒' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoryListRequest();
      setCategories(data.categories);
    } catch (err) {
      toast.error('Could not load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCategoryRequest(editingId, form);
        toast.success('Category updated');
      } else {
        await createCategoryRequest(form);
        toast.success('Category added');
      }
      setForm({ name: '', icon: '🛒' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Could not save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategoryRequest(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Could not delete category');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">🗂️ Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-100 shadow-card p-5 mb-8 max-w-lg flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Icon (emoji)</label>
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl text-center text-xl focus:ring-2 focus:ring-primary-400 outline-none"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-gray-500 mb-1">Category Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Snacks"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-full transition shadow-pop"
        >
          {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setForm({ name: '', icon: '🛒' }); }}
            className="text-gray-500 font-medium px-3 py-2"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No categories yet. Add one above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent hover:border-primary-200 transition">
                <span className="font-medium text-ink flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  {cat.name}
                </span>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => handleEdit(cat)} className="text-primary-600 hover:underline font-bold">Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
