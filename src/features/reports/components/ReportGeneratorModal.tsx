'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ReportTemplate, ReportGeneration, ReportFormat, ReportPriority, ReportFrequency } from '../types'
import { getFormatOptions, getPriorityOptions, getFrequencyOptions } from '../utils/mockData'

interface ReportGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  templates: ReportTemplate[]
  onGenerate: (config: ReportGeneration) => void
}

export function ReportGeneratorModal({
  isOpen,
  onClose,
  templates,
  onGenerate
}: ReportGeneratorModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [step, setStep] = useState(1) // 1: Template, 2: Parameters, 3: Config, 4: Schedule
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    format: 'pdf' as ReportFormat,
    priority: 'normal' as ReportPriority,
    parameters: {} as Record<string, any>,
    recipients: [''],
    includeCharts: true,
    includeRawData: false,
    tags: [] as string[],
    schedule: null as any
  })

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setReportConfig(prev => ({
      ...prev,
      name: template.name,
      format: template.defaultFormat,
      parameters: template.parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue || ''
        return acc
      }, {} as Record<string, any>)
    }))
    setStep(2)
  }

  const handleGenerate = () => {
    if (!selectedTemplate) return

    const generation: ReportGeneration = {
      templateId: selectedTemplate.id,
      name: reportConfig.name,
      description: reportConfig.description,
      parameters: reportConfig.parameters,
      format: reportConfig.format,
      recipients: reportConfig.recipients.filter(email => email.trim()),
      priority: reportConfig.priority,
      tags: reportConfig.tags,
      config: {
        includeCharts: reportConfig.includeCharts,
        includeRawData: reportConfig.includeRawData
      },
      schedule: reportConfig.schedule
    }

    onGenerate(generation)
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setSelectedTemplate(null)
    setReportConfig({
      name: '',
      description: '',
      format: 'pdf',
      priority: 'normal',
      parameters: {},
      recipients: [''],
      includeCharts: true,
      includeRawData: false,
      tags: [],
      schedule: null
    })
    onClose()
  }

  const formatOptions = getFormatOptions()
  const priorityOptions = getPriorityOptions()
  const frequencyOptions = getFrequencyOptions()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Generate New Report
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleClose}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {[
                      { step: 1, label: 'Template' },
                      { step: 2, label: 'Parameters' },
                      { step: 3, label: 'Configuration' },
                      { step: 4, label: 'Schedule' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= item.step 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {item.step}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          step >= item.step ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </span>
                        {item.step < 4 && (
                          <svg className="w-5 h-5 text-gray-300 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* Step 1: Template Selection */}
                  {step === 1 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Choose a Report Template</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.filter(t => t.isActive).map((template) => (
                          <div
                            key={template.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-md font-medium text-gray-900">{template.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                <div className="flex items-center mt-3 space-x-4 text-xs text-gray-500">
                                  <span className="bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                                  <span>~{template.estimatedTime}min</span>
                                  <span>{template.supportedFormats.join(', ').toUpperCase()}</span>
                                </div>
                              </div>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Parameters */}
                  {step === 2 && selectedTemplate && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Configure Parameters</h4>
                      <div className="space-y-4">
                        {selectedTemplate.parameters.map((param) => (
                          <div key={param.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {param.name}
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {param.description && (
                              <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                            )}
                            
                            {param.type === 'string' && (
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.parameters[param.id] || ''}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  parameters: { ...prev.parameters, [param.id]: e.target.value }
                                }))}
                              />
                            )}
                            
                            {param.type === 'number' && (
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.parameters[param.id] || ''}
                                min={param.validation?.min}
                                max={param.validation?.max}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  parameters: { ...prev.parameters, [param.id]: parseFloat(e.target.value) || '' }
                                }))}
                              />
                            )}
                            
                            {param.type === 'date' && (
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.parameters[param.id] || ''}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  parameters: { ...prev.parameters, [param.id]: e.target.value }
                                }))}
                              />
                            )}
                            
                            {param.type === 'boolean' && (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={reportConfig.parameters[param.id] || false}
                                  onChange={(e) => setReportConfig(prev => ({
                                    ...prev,
                                    parameters: { ...prev.parameters, [param.id]: e.target.checked }
                                  }))}
                                />
                                <span className="ml-2 text-sm text-gray-600">Enable this option</span>
                              </label>
                            )}
                            
                            {(param.type === 'select' || param.type === 'multiselect') && param.options && (
                              <select
                                multiple={param.type === 'multiselect'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={param.type === 'multiselect' ? reportConfig.parameters[param.id] || [] : reportConfig.parameters[param.id] || ''}
                                onChange={(e) => {
                                  const value = param.type === 'multiselect' 
                                    ? Array.from(e.target.selectedOptions, option => option.value)
                                    : e.target.value
                                  setReportConfig(prev => ({
                                    ...prev,
                                    parameters: { ...prev.parameters, [param.id]: value }
                                  }))
                                }}
                              >
                                {param.type === 'select' && (
                                  <option value="">Select an option...</option>
                                )}
                                {param.options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Configuration */}
                  {step === 3 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={reportConfig.name}
                              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={reportConfig.description}
                              onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={reportConfig.format}
                              onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value as ReportFormat }))}
                            >
                              {selectedTemplate?.supportedFormats.map((format) => {
                                const option = formatOptions.find(f => f.value === format)
                                return option ? (
                                  <option key={format} value={format}>
                                    {option.label}
                                  </option>
                                ) : null
                              })}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={reportConfig.priority}
                              onChange={(e) => setReportConfig(prev => ({ ...prev, priority: e.target.value as ReportPriority }))}
                            >
                              {priorityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                            {reportConfig.recipients.map((email, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                  type="email"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="email@example.com"
                                  value={email}
                                  onChange={(e) => {
                                    const newRecipients = [...reportConfig.recipients]
                                    newRecipients[index] = e.target.value
                                    setReportConfig(prev => ({ ...prev, recipients: newRecipients }))
                                  }}
                                />
                                {reportConfig.recipients.length > 1 && (
                                  <button
                                    onClick={() => {
                                      const newRecipients = reportConfig.recipients.filter((_, i) => i !== index)
                                      setReportConfig(prev => ({ ...prev, recipients: newRecipients }))
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setReportConfig(prev => ({ 
                                ...prev, 
                                recipients: [...prev.recipients, ''] 
                              }))}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Recipient
                            </button>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={reportConfig.includeCharts}
                                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                              />
                              <span className="ml-2 text-sm text-gray-600">Include Charts</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={reportConfig.includeRawData}
                                onChange={(e) => setReportConfig(prev => ({ ...prev, includeRawData: e.target.checked }))}
                              />
                              <span className="ml-2 text-sm text-gray-600">Include Raw Data</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter tags separated by commas"
                              value={reportConfig.tags.join(', ')}
                              onChange={(e) => setReportConfig(prev => ({ 
                                ...prev, 
                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Schedule */}
                  {step === 4 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Schedule (Optional)</h4>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={!!reportConfig.schedule}
                            onChange={(e) => setReportConfig(prev => ({ 
                              ...prev, 
                              schedule: e.target.checked ? {
                                frequency: 'monthly' as ReportFrequency,
                                time: '09:00',
                                timezone: 'UTC',
                                startDate: new Date(),
                                isActive: true,
                                maxRetries: 3
                              } : null 
                            }))}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Schedule this report</span>
                        </label>

                        {reportConfig.schedule && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.schedule.frequency}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  schedule: { ...prev.schedule, frequency: e.target.value as ReportFrequency }
                                }))}
                              >
                                {frequencyOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                              <input
                                type="time"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.schedule.time}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  schedule: { ...prev.schedule, time: e.target.value }
                                }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.schedule.startDate.toISOString().split('T')[0]}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  schedule: { ...prev.schedule, startDate: new Date(e.target.value) }
                                }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={reportConfig.schedule.endDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setReportConfig(prev => ({
                                  ...prev,
                                  schedule: { 
                                    ...prev.schedule, 
                                    endDate: e.target.value ? new Date(e.target.value) : undefined 
                                  }
                                }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex space-x-3">
                    {step > 1 && (
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setStep(step - 1)}
                      >
                        Back
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    {step < 4 ? (
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setStep(step + 1)}
                        disabled={!selectedTemplate}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleGenerate}
                        disabled={!reportConfig.name || reportConfig.recipients.filter(email => email.trim()).length === 0}
                      >
                        Generate Report
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}