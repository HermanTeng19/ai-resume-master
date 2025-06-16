'use client';

import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import { getDefaultModel } from '@/lib/models';

interface ResumeFormProps {
  onSubmit: (data: any, selectedModel?: string) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    socialLinks: [
      { platform: 'LinkedIn', url: '' },
      { platform: 'GitHub', url: '' },
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    }],
    projects: [{
      name: '',
      description: '',
      technologies: [''],
      url: '',
    }],
    education: [{
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    }],
    languages: [''],
    certifications: [''],
    interests: [''],
  });

  const [selectedModel, setSelectedModel] = useState(getDefaultModel().id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up the form data before submitting
    const cleanedData = {
      personalInfo: formData.personalInfo,
      socialLinks: formData.socialLinks.filter(link => link.url.trim() !== ''),
      skills: formData.skills.filter(skill => skill.trim() !== ''),
      experience: formData.experience.filter(exp => 
        exp.company.trim() !== '' || exp.position.trim() !== '' || exp.description.trim() !== ''
      ),
      projects: formData.projects.filter(project => 
        project.name.trim() !== '' || project.description.trim() !== ''
      ),
      education: formData.education.filter(edu => 
        edu.school.trim() !== '' || edu.degree.trim() !== '' || edu.field.trim() !== ''
      ),
      languages: formData.languages.filter(lang => lang.trim() !== ''),
      certifications: formData.certifications.filter(cert => cert.trim() !== ''),
      interests: formData.interests.filter(interest => interest.trim() !== ''),
    };
    
    onSubmit(cleanedData, selectedModel);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-user mr-2 text-primary-600"></i>
          个人信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">姓名 *</label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">职位头衔 *</label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">邮箱 *</label>
            <input
              type="email"
              className="form-input"
              value={formData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">电话 *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">地址 *</label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">个人简介 *</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              required
              placeholder="简要介绍您的专业背景、核心技能和职业目标..."
            />
          </div>
        </div>
      </div>

      <ModelSelector
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary text-lg px-8 py-3"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              生成中...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              生成AI简历
            </>
          )}
        </button>
      </div>
    </form>
  );
} 