import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getAllUsersRequest, updateUserRoleRequest, toggleBlockUserRequest, deleteUserRequest } from '../../services/adminService';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsersRequest();
      setUsers(data.users);
    } catch (err) {
      toast.error('Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Make ${targetUser.name} ${newRole === 'admin' ? 'an admin' : 'a regular customer'}?`)) return;
    try {
      await updateUserRoleRequest(targetUser._id, newRole);
      toast.success(`${targetUser.name} is now ${newRole === 'admin' ? 'an admin' : 'a customer'}`);
      setUsers((prev) => prev.map((u) => u._id === targetUser._id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.message || 'Could not update role');
    }
  };

  const handleBlockToggle = async (targetUser) => {
    const newBlocked = !targetUser.isBlocked;
    try {
      await toggleBlockUserRequest(targetUser._id, newBlocked);
      toast.success(newBlocked ? `${targetUser.name} blocked` : `${targetUser.name} unblocked`);
      setUsers((prev) => prev.map((u) => u._id === targetUser._id ? { ...u, isBlocked: newBlocked } : u));
    } catch (err) {
      toast.error(err.message || 'Could not update user');
    }
  };

  const handleDelete = async (targetUser) => {
    if (!window.confirm(`Permanently delete ${targetUser.name}'s account?`)) return;
    try {
      await deleteUserRequest(targetUser._id);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
    } catch (err) {
      toast.error(err.message || 'Could not delete user');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">👥 Manage Users</h1>

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-left">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0">
                            {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase()}
                          </span>
                          <span className="font-medium text-ink">
                            {u.name}
                            {isSelf && <span className="text-xs text-gray-400 ml-1">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-deal-100 text-deal-600' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {u.isBlocked ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">Blocked</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-700">Active</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                        {!isSelf && (
                          <>
                            <button onClick={() => handleRoleToggle(u)} className="text-primary-600 hover:underline font-bold text-xs">
                              {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                            </button>
                            <button onClick={() => handleBlockToggle(u)} className="text-orange-500 hover:underline font-bold text-xs">
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button onClick={() => handleDelete(u)} className="text-red-500 hover:underline font-bold text-xs">
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
