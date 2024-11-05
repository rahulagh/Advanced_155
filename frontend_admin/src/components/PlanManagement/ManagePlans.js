import React, { useState } from 'react';
import { Edit2, Users, Check } from 'lucide-react';

const PlanManager = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Basic',
      price: 29.99,
      duration: 'month',
      activeUsers: 156,
      features: [
        'Up to 10 job postings',
        'Basic candidate search',
        'Email support',
        'Standard analytics',
      ],
    },
    {
      id: 2,
      name: 'Premium',
      price: 59.99,
      duration: 'month',
      activeUsers: 284,
      features: [
        'Unlimited job postings',
        'Advanced candidate search',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
      ],
    },
    {
      id: 3,
      name: 'VIP',
      price: 99.99,
      duration: 'month',
      activeUsers: 92,
      features: [
        'All Premium features',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Unlimited storage',
      ],
    },
  ]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    duration: 'month',
    features: [],
  });

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setEditForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
    });
  };

  const handleSave = () => {
    setPlans(
      plans.map((plan) =>
        plan.id === editingPlan ? { ...plan, ...editForm } : plan
      )
    );
    setEditingPlan(null);
  };

  const totalUsers = plans.reduce(
    (sum, plan) => sum + plan.activeUsers,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-medium">{totalUsers} Total Active Users</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="relative border shadow-lg rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-gray-600 mt-2">
                  ${plan.price}/{plan.duration}
                </p>
              </div>
              <button
                onClick={() => handleEdit(plan)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{plan.activeUsers} active users</span>
              </div>
              <div className="space-y-2 mt-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-1 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-bold mb-4">Edit {editForm.name} Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea
                  value={editForm.features.join('\n')}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      features: e.target.value.split('\n'),
                    })
                  }
                  className="w-full p-2 border rounded"
                  rows="5"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingPlan(null)}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManager;