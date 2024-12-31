import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { UserAssignment } from '../../../types/assignment';

interface AssignmentHeaderProps {
  assignment: UserAssignment;
  lastSaved: string | null;
  onSave: () => void;
  onSubmit: () => Promise<void>;
}

export default function AssignmentHeader({ 
  assignment, 
  lastSaved, 
  onSave, 
  onSubmit 
}: AssignmentHeaderProps) {
  const navigate = useNavigate();
  const isCompleted = assignment.status === 'completed';

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit this assignment? This action cannot be undone.')) {
      await onSubmit();
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {assignment.assignment.name}
      </h2>
      {!isCompleted && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : ''}
          </span>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <Send size={16} />
            Submit
          </button>
        </div>
      )}
    </div>
  );
}