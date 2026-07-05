import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { uploadImageRequest } from '../services/uploadService';
import {
  updateProfileRequest,
  changePasswordRequest,
  getAddressesRequest,
  addAddressRequest,
  updateAddressRequest,
  deleteAddressRequest,
} from '../services/userService';

const tabs = [
  { key: 'profile', label: 'Profile Info' },
  { key: 'password', label: 'Change Password' },
  { key: 'addresses', label: 'Addresses' },
];

const emptyAddress = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'Nepal', isDefault: false };

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile info state
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Password state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (activeTab === 'addresses') {
      getAddressesRequest().then((data) => setAddresses(data.addresses)).catch(() => {});
    }
  }, [activeTab]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImageRequest(file);
      setAvatarPreview(data.url);
      const updated = await updateProfileRequest({ avatarUrl: data.url });
      updateUser(updated.user);
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error(err.message || 'Could not upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const data = await updateProfileRequest(profileForm);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordRequest(passwordForm);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Could not change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        const data = await updateAddressRequest(editingAddressId, addressForm);
        setAddresses(data.addresses);
        toast.success('Address updated');
      } else {
        const data = await addAddressRequest(addressForm);
        setAddresses(data.addresses);
        toast.success('Address added');
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      setShowAddressForm(false);
    } catch (err) {
      toast.error(err.message || 'Could not save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const data = await deleteAddressRequest(addressId);
      setAddresses(data.addresses);
      toast.success('Address deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      <div className="flex gap-2 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 font-medium text-sm transition border-b-2 ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WEBP. Max 5MB.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {activeTab === 'addresses' && (
        <div>
          {!showAddressForm && (
            <button
              onClick={() => { setAddressForm(emptyAddress); setEditingAddressId(null); setShowAddressForm(true); }}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-lg transition mb-6"
            >
              + Add New Address
            </button>
          )}

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="bg-gray-50 rounded-xl p-5 mb-6 max-w-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Label (e.g. Home)"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  placeholder="Full Name"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <input
                placeholder="Phone"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                required
                placeholder="Address Line 1"
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                placeholder="Address Line 2 (optional)"
                value={addressForm.line2}
                onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  required
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  required
                  placeholder="Postal Code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <input
                required
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                Set as default address
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium px-5 py-2 rounded-lg transition"
                >
                  {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                  className="text-gray-500 hover:text-gray-700 px-5 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-gray-500">No saved addresses yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr._id} className="border border-gray-200 rounded-xl p-4 relative">
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <p className="font-medium text-gray-900">{addr.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-sm text-gray-600">{addr.country}</p>
                  {addr.phone && <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>}
                  <div className="flex gap-3 mt-3 text-sm">
                    <button onClick={() => handleEditAddress(addr)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
