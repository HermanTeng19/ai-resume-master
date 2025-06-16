'use client';

import React from 'react';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function GenerateButton({ onGenerate, isLoading, disabled }: GenerateButtonProps) {
  return (
    <div className="card">
      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              生成中...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              生成提示词套装
            </>
          )}
        </button>
      </div>
    </div>
  );
} 