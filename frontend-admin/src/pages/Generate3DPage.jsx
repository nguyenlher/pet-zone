// src/pages/Generate3DPage.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Upload, Image as ImageIcon, Loader2, Download, Eye,
  Trash2, CheckCircle, XCircle, Clock, Zap, RefreshCw,
  AlertCircle, Box, Save, Search
} from 'lucide-react';
import { useGenerateModel, useTaskList, useCancelTask, useTaskStatus, useSave3DModelToPet } from '../hooks/useTripo';
import { usePets } from '../hooks/usePets';
import { DEFAULT_MODEL_VERSION } from '../services/tripoService';

/* ─── Model versions: cheapest first ─────────────────────────────────────── */
const MODEL_VERSIONS = [
  { value: 'v2.0-20240919', label: 'v2.0 Standard (cheapest)' },
  { value: 'v2.5-20250123', label: 'v2.5 Enhanced' },
];

/* ─── Status config ─────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  queued:    { icon: Clock,         color: 'bg-amber-100 text-amber-700 border-amber-200',   label: 'Queued' },
  running:   { icon: Loader2,       color: 'bg-blue-100 text-blue-700 border-blue-200',      label: 'Running', spin: true },
  success:   { icon: CheckCircle,   color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Success' },
  failed:    { icon: XCircle,       color: 'bg-red-100 text-red-700 border-red-200',         label: 'Failed' },
  cancelled: { icon: XCircle,       color: 'bg-gray-100 text-gray-500 border-gray-200',      label: 'Cancelled' },
  unknown:   { icon: AlertCircle,   color: 'bg-gray-100 text-gray-500 border-gray-200',      label: 'Unknown' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={12} className={cfg.spin ? 'animate-spin' : ''} />
      {cfg.label}
    </span>
  );
}

/* ─── Single Task Row ────────────────────────────────────────────────────── */
function TaskRow({ taskId, onCancel, cancelPending, onSaveToPet, savePending, selectedPetId, sourceImageUrl, selectedPetName }) {
  const { data: task, isLoading } = useTaskStatus(taskId);
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading || !task) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  const canCancel = task.status === 'queued' || task.status === 'running';
  
  // Model URL is in task.result.pbr_model.url (confirmed from API response)
  const modelUrl = task.result?.pbr_model?.url 
    || task.output?.pbr_model 
    || task.output?.model?.url 
    || task.output?.rendered_image?.url;
    
  const canSave = task.status === 'success' && modelUrl && selectedPetId;

  // Download GLB file with proper filename
  const handleDownload = async () => {
    if (!modelUrl) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(modelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedPetName 
        ? `${selectedPetName.replace(/\s+/g, '_')}_3d_model.glb`
        : `pet_3d_model_${task.task_id.substring(0, 8)}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download model');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={task.status} />
            {task.progress != null && task.status === 'running' && (
              <span className="text-xs text-gray-500">{task.progress}%</span>
            )}
          </div>
          
          <p className="text-xs text-gray-400 mb-1">
            Task ID: <span className="font-mono">{task.task_id}</span>
          </p>

          {task.create_time && (
            <p className="text-xs text-gray-400 mb-1">
              Created: {new Date(task.create_time * 1000).toLocaleString()}
            </p>
          )}
          
          {modelUrl && (
            <p className="text-xs text-emerald-600 mb-1 flex items-center gap-1">
              <CheckCircle size={12} />
              3D Model ready
            </p>
          )}

          {/* Progress bar */}
          {task.status === 'running' && task.progress != null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Generating…</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {task.status === 'failed' && task.error?.suggest && (
            <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">
              {task.error.suggest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {task.status === 'success' && modelUrl && (
            <div className="flex gap-1">
              <a
                href={modelUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                title="View 3D Model in Browser"
              >
                <Eye size={18} />
              </a>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40 border border-emerald-200"
                title="Download GLB File"
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              </button>
            </div>
          )}
          
          {canSave && (
            <button
              onClick={() => onSaveToPet(task.task_id, modelUrl, sourceImageUrl)}
              disabled={savePending}
              className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              title="Save to Pet Database"
            >
              {savePending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save to Pet
                </>
              )}
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => onCancel(task.task_id)}
              disabled={cancelPending}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 border border-red-200"
              title="Cancel Task"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function Generate3DPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modelVersion, setModelVersion] = useState(DEFAULT_MODEL_VERSION);
  const [dragOver, setDragOver] = useState(false);
  const [activeTaskIds, setActiveTaskIds] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [petSearchQuery, setPetSearchQuery] = useState('');
  const [showPetSelector, setShowPetSelector] = useState(false);
  const fileInputRef = useRef(null);

  const generateMutation = useGenerateModel();
  const { data: taskList = [], isLoading: isLoadingTasks, refetch } = useTaskList();
  const cancelMutation = useCancelTask();
  const save3DModelMutation = useSave3DModelToPet();
  
  // Fetch pets for selection
  const { data: petsData, isLoading: isLoadingPets } = usePets(0, 100);
  const pets = petsData?.content || [];
  
  // Filter pets based on search
  const filteredPets = pets.filter(pet => 
    pet.name?.toLowerCase().includes(petSearchQuery.toLowerCase()) ||
    pet.id?.toLowerCase().includes(petSearchQuery.toLowerCase())
  );
  
  const selectedPet = pets.find(p => p.id === selectedPetId);

  // Merge server task list ids into activeTaskIds for display
  const allTaskIds = [
    ...activeTaskIds.filter(id => !taskList.includes(id)),
    ...taskList,
  ];

  /* Handlers */
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedPetId) return;
    try {
      const taskId = await generateMutation.mutateAsync({ file: selectedFile, modelVersion });
      setActiveTaskIds(prev => [taskId, ...prev]);
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Generate failed:', err);
    }
  };

  const handleCancel = async (taskId) => {
    if (!window.confirm('Cancel this task?')) return;
    try {
      await cancelMutation.mutateAsync(taskId);
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const handleSaveToPet = async (taskId, glbUrl, sourceImageUrl) => {
    if (!selectedPetId) {
      alert('Please select a pet first');
      return;
    }
    
    if (!window.confirm(`Save this 3D model to ${selectedPet?.name || 'selected pet'}?`)) return;
    
    try {
      await save3DModelMutation.mutateAsync({
        petId: selectedPetId,
        glbUrl,
        sourceImageUrl: sourceImageUrl || previewUrl,
      });
      alert('3D model saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save 3D model: ' + (err.message || 'Unknown error'));
    }
  };

  /* Step indicator while generating */
  const isPending = generateMutation.isPending;
  const generateError = generateMutation.isError
    ? (generateMutation.error?.response?.data?.message || generateMutation.error?.message || 'Generation failed')
    : null;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Box className="text-emerald-500" size={26} />
            Generate 3D Model
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select a pet, upload a 2D image → Tripo AI converts it to a 3D model (GLB)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Pet Selection Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Search size={17} className="text-purple-600" />
            Select Pet
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Selected Pet Display */}
          {selectedPet ? (
            <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              {selectedPet.thumbnailUrl && (
                <img 
                  src={selectedPet.thumbnailUrl} 
                  alt={selectedPet.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedPet.name}</p>
                <p className="text-sm text-gray-500">ID: {selectedPet.id}</p>
              </div>
              <button
                onClick={() => setShowPetSelector(!showPetSelector)}
                className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPetSelector(!showPetSelector)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-gray-600 hover:text-purple-600"
            >
              <Search size={24} className="mx-auto mb-2" />
              <p className="font-medium">Click to select a pet</p>
            </button>
          )}

          {/* Pet Selector Dropdown */}
          {showPetSelector && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search pets by name or ID..."
                  value={petSearchQuery}
                  onChange={(e) => setPetSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {isLoadingPets ? (
                  <div className="p-8 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading pets...
                  </div>
                ) : filteredPets.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No pets found
                  </div>
                ) : (
                  filteredPets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => {
                        setSelectedPetId(pet.id);
                        setShowPetSelector(false);
                        setPetSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {pet.thumbnailUrl && (
                        <img 
                          src={pet.thumbnailUrl} 
                          alt={pet.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{pet.name}</p>
                        <p className="text-xs text-gray-500">{pet.id}</p>
                      </div>
                      {pet.has3DModel && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          Has 3D
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Upload Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Upload size={17} className="text-emerald-600" />
            Upload Image
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${dragOver
                ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
                : previewUrl
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-56 mx-auto rounded-lg shadow-md object-contain"
                />
                <p className="text-sm text-gray-500 font-medium">{selectedFile?.name}</p>
                <p className="text-xs text-gray-400">Click to change</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto">
                  <ImageIcon size={30} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Drop your image here or click to browse</p>
                  <p className="text-sm text-gray-400 mt-1">Supports: JPG, PNG, WEBP · Max 10 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Model Version <span className="text-xs text-gray-400">(lower = cheaper)</span>
              </label>
              <select
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                {MODEL_VERSIONS.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <Zap size={13} className="inline mr-1" />
                <strong>v2.0-20240919</strong> = lowest credit cost. Suitable for pets & objects.
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || !selectedPetId || isPending}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200
              bg-gradient-to-r from-emerald-500 to-teal-500
              hover:from-emerald-600 hover:to-teal-600
              disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed
              shadow-md hover:shadow-emerald-200 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Uploading &amp; Creating Task…
              </>
            ) : !selectedPetId ? (
              <>
                <AlertCircle size={19} />
                Select a Pet First
              </>
            ) : (
              <>
                <Zap size={19} />
                Generate 3D Model
              </>
            )}
          </button>

          {/* Error */}
          {generateError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{generateError}</p>
            </div>
          )}

          {/* Success */}
          {generateMutation.isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3">
              <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700">
                Task created! Your 3D model is being generated below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Task History ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Generation History</h2>
          {allTaskIds.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {allTaskIds.length} tasks
            </span>
          )}
        </div>

        <div className="p-6">
          {isLoadingTasks && allTaskIds.length === 0 ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading tasks…</span>
            </div>
          ) : allTaskIds.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box size={30} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No generation history yet</p>
              <p className="text-sm text-gray-400 mt-1">Upload an image above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allTaskIds.map((taskId) => (
                <TaskRow
                  key={taskId}
                  taskId={taskId}
                  onCancel={handleCancel}
                  cancelPending={cancelMutation.isPending}
                  onSaveToPet={handleSaveToPet}
                  savePending={save3DModelMutation.isPending}
                  selectedPetId={selectedPetId}
                  selectedPetName={selectedPet?.name}
                  sourceImageUrl={previewUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
