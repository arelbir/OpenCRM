import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export const PageContainer = ({ children, title, actions }: PageContainerProps) => {
  return (
    <div className="flex-1 p-8">
      {/* Header */}
      {(title || actions) && (
        <div className="mb-8 flex justify-between items-center">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {actions && <div className="flex space-x-4">{actions}</div>}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
    </div>
  );
};

export default PageContainer;
