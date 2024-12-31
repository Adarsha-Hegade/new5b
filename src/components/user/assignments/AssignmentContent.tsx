import React from 'react';
import PDFViewer from '../../shared/PDFViewer';
import QuillEditor from '../../shared/QuillEditor';
import { UserAssignment } from '../../../types/assignment';

interface AssignmentContentProps {
  assignment: UserAssignment;
  content: string;
  onChange: (value: string) => void;
}

export default function AssignmentContent({ 
  assignment, 
  content, 
  onChange 
}: AssignmentContentProps) {
  const isCompleted = assignment.status === 'completed';

  return (
    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 overflow-hidden">
      <div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <PDFViewer pdfUrl={assignment.assignment.pdf_path} />
      </div>
      <div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <QuillEditor
          value={content}
          onChange={onChange}
          readOnly={isCompleted}
        />
      </div>
    </div>
  );
}