import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const PageHeader = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backTo, 
  actions,
  breadcrumbs,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="container-custom section-padding">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-red-600 md:ml-2"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Quay lại
              </Button>
            )}
            
            <div>
              <h1 className="heading-2">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-body">{subtitle}</p>
              )}
            </div>
          </div>

          {actions && (
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;