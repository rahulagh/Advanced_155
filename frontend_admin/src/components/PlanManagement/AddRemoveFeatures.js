// components/AddRemoveFeatures.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchPlans, addFeatureToPlan, removeFeatureFromPlan } from '../../services/api';
import { Loader2 } from 'lucide-react';

// Card Component
const Card = ({ className, children }) => (
  <div className={`border rounded shadow-md p-4 ${className}`}>
    {children}
  </div>
);

// Button Component
const Button = ({ onClick, disabled, children, className, variant }) => {
  const baseStyle = "px-4 py-2 rounded focus:outline-none";
  const variantStyle = variant === "destructive" ? "bg-red-500 text-white" : "bg-blue-500 text-white";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ type, value, onChange, placeholder, className }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded p-2 w-full ${className}`}
  />
);

// Main AddRemoveFeatures Component
const AddRemoveFeatures = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [plans, setPlans] = useState([]);
  const [featureName, setFeatureName] = useState('');
  const [featureQuota, setFeatureQuota] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleAddFeature = async () => {
    if (!selectedPlan) {
      return Swal.fire('Select a plan first!');
    }
    
    try {
      const response = await addFeatureToPlan(selectedPlan, { 
        name: featureName, 
        quota: featureQuota, 
        description: featureDescription 
      });
      Swal.fire('Feature added!', response.message);
      const updatedPlans = await fetchPlans();
      setPlans(updatedPlans);
      setFeatureName('');
      setFeatureQuota('');
      setFeatureDescription('');
    } catch (error) {
      Swal.fire('Error adding feature', error.message);
    }
  };

  const handleRemoveFeature = async (featureId) => {
    if (!selectedPlan) {
      return Swal.fire('Select a plan first!');
    }

    try {
      const response = await removeFeatureFromPlan(selectedPlan, featureId);
      Swal.fire('Feature removed!', response.message);
      const updatedPlans = await fetchPlans();
      setPlans(updatedPlans);
    } catch (error) {
      Swal.fire('Error removing feature', error.message);
    }
  };

  if (isLoading) {
    return <Loader2 />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-bold">Manage Features</h2>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select a Plan</option>
          {plans.map(plan => (
            <option key={plan._id} value={plan._id}>{plan.name}</option>
          ))}
        </select>
        <Input
          type="text"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          placeholder="Feature Name"
        />
        <Input
          type="number"
          value={featureQuota}
          onChange={(e) => setFeatureQuota(e.target.value)}
          placeholder="Feature Quota"
        />
        <Input
          type="text"
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
          placeholder="Feature Description"
        />
        <Button onClick={handleAddFeature}>Add Feature</Button>
      </Card>
      {selectedPlan && (
        <Card>
          <h3 className="text-lg font-bold">Current Features</h3>
          {plans.find(plan => plan._id === selectedPlan)?.features?.length > 0 ? (
            <ul>
              {plans.find(plan => plan._id === selectedPlan).features.map((feature, index) => (
                <li key={feature._id || index} className="flex justify-between py-1">
                  <span>
                    {feature.name || 'Unnamed Feature'}
                  </span>
                  <Button variant="destructive" onClick={() => handleRemoveFeature(feature._id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No features available for this plan.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AddRemoveFeatures;
