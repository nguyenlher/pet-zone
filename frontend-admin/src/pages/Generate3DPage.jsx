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
  queued:    { icon: Clock,         color: 'bg-amber-50 text-amber-800 border-amber-300',   label: 'Queued' },
  running:   { icon: Loader2,       color: 'bg-blue-50 text-blue-700 border-blue-300',      label: 'Running', spin: true },
  success:   { icon: CheckCircle,   color: 'bg-emerald-50 text-emerald-700 border-emerald-300', label: 'Success' },
  failed:    { icon: XCircle,       color: 'bg-red-50 text-red-700 border-red-300',         label: 'Failed' },
  cancelled: { icon: XCircle,       color: 'bg-neutral-100 text-neutral-500 border-neutral-300',      label: 'Cancelled' },
  unknown:   { icon: AlertCircle,   color: 'bg-neutral-100 text-neutral-500 border-neutral-300',      label: 'Unknown' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-wider font-semibold border ${cfg.color}`}>
      <Icon size={11} className={cfg.spin ? 'animate-spin' : ''} />
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
      <div className="border border-neutral-200 rounded-none p-4 animate-pulse bg-white">
        <div className="h-3.5 bg-neutral-200 rounded-none w-1/3 mb-2" />
        <div className="h-3 bg-neutral-100 rounded-none w-1/2" />
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
    <div className="border border-neutral-200 rounded-none p-4 hover:border-black transition-colors bg-white">
      <div className="flex items-start justify-between gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={task.status} />
            {task.progress != null && task.status === 'running' && (
              <span className="text-[11px] font-mono text-neutral-600">{task.progress}%</span>
            )}
          </div>
          
          <p className="text-[11px] text-neutral-500 mb-1">
            TASK ID: <span className="font-mono text-black font-semibold">{task.task_id}</span>
          </p>

          {task.create_time && (
            <p className="text-[11px] text-neutral-400 font-mono mb-1">
              CREATED: {new Date(task.create_time * 1000).toLocaleString('vi-VN')}
            </p>
          )}
          
          {modelUrl && (
            <p className="text-xs text-emerald-700 font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
              <CheckCircle size={13} className="text-emerald-600" />
              3D Model Ready (.glb)
            </p>
          )}

          {/* Progress bar */}
          {task.status === 'running' && task.progress != null && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono uppercase text-neutral-500 mb-1">
                <span>GENERATING ASSET…</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-none h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-none transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {task.status === 'failed' && task.error?.suggest && (
            <p className="mt-2 text-xs font-mono text-red-700 bg-red-50 border border-red-200 rounded-none px-3 py-1.5">
              {task.error.suggest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {task.status === 'success' && modelUrl && (
            <div className="flex gap-1.5">
              <a
                href={modelUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-neutral-700 hover:text-black hover:border-black rounded-none transition-colors border border-neutral-200"
                title="View 3D Model in Browser"
              >
                <Eye size={16} />
              </a>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 text-neutral-700 hover:text-black hover:border-black rounded-none transition-colors disabled:opacity-40 border border-neutral-200 cursor-pointer"
                title="Download GLB File"
              >
                {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              </button>
            </div>
          )}
          
          {canSave && (
            <button
              onClick={() => onSaveToPet(task.task_id, modelUrl, sourceImageUrl)}
              disabled={savePending}
              className="w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-none transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
              title="Save to Pet Database"
            >
              {savePending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Pet
                </>
              )}
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => onCancel(task.task_id)}
              disabled={cancelPending}
              className="p-2 text-neutral-400 hover:text-red-600 hover:border-red-300 rounded-none transition-colors disabled:opacity-40 border border-neutral-200 cursor-pointer"
              title="Cancel Task"
            >
              <Trash2 size={16} />
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
          <h1 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
            <Box size={16} />
            3D Model Generation
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            Convert 2D pet photography into high-fidelity 3D assets (GLB format via Tripo AI pipeline)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-neutral-700 bg-white border border-neutral-200 rounded-none hover:border-black transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── Pet Selection Card ── */}
      <div className="bg-white rounded-none border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
            <Search size={14} className="text-neutral-600" />
            Target Pet Profile
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Selected Pet Display */}
          {selectedPet ? (
            <div className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-none">
              {selectedPet.thumbnailUrl && (
                <img 
                  src={selectedPet.thumbnailUrl} 
                  alt={selectedPet.name}
                  className="w-14 h-14 rounded-none border border-neutral-200 object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-black">{selectedPet.name}</p>
                <p className="text-[11px] text-neutral-400 font-mono">ID: {selectedPet.id}</p>
              </div>
              <button
                onClick={() => setShowPetSelector(!showPetSelector)}
                className="px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-black bg-white border border-neutral-200 hover:border-black rounded-none transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPetSelector(!showPetSelector)}
              className="w-full p-6 border border-dashed border-neutral-300 rounded-none hover:border-black hover:bg-neutral-50/50 transition-colors text-neutral-600 hover:text-black cursor-pointer text-center"
            >
              <Search size={20} className="mx-auto mb-2 text-neutral-400" />
              <p className="text-xs uppercase font-bold tracking-wider">Click to select target pet</p>
            </button>
          )}

          {/* Pet Selector Dropdown */}
          {showPetSelector && (
            <div className="border border-neutral-200 rounded-none overflow-hidden bg-white">
              <div className="p-3 bg-neutral-50 border-b border-neutral-200">
                <input
                  type="text"
                  placeholder="Search pets by name or ID..."
                  value={petSearchQuery}
                  onChange={(e) => setPetSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {isLoadingPets ? (
                  <div className="p-8 text-center text-neutral-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                    <span className="text-xs font-mono uppercase">Loading pets...</span>
                  </div>
                ) : filteredPets.length === 0 ? (
                  <div className="p-8 text-center text-xs uppercase font-mono text-neutral-400">
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
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-left cursor-pointer"
                    >
                      {pet.thumbnailUrl && (
                        <img 
                          src={pet.thumbnailUrl} 
                          alt={pet.name}
                          className="w-10 h-10 rounded-none border border-neutral-200 object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-bold text-black uppercase tracking-wider">{pet.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{pet.id}</p>
                      </div>
                      {pet.has3DModel && (
                        <span className="text-[10px] font-mono uppercase bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.5">
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
      <div className="bg-white rounded-none border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
            <Upload size={14} className="text-neutral-600" />
            Upload Source Image
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border border-dashed rounded-none p-8 text-center cursor-pointer transition-colors
              ${dragOver
                ? 'border-black bg-neutral-50'
                : previewUrl
                  ? 'border-neutral-400 bg-neutral-50/40'
                  : 'border-neutral-300 hover:border-black hover:bg-neutral-50/50'
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
                  className="max-h-56 mx-auto rounded-none border border-neutral-200 object-contain bg-white"
                />
                <p className="text-xs font-mono text-neutral-600">{selectedFile?.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Click to replace image</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-none flex items-center justify-center mx-auto">
                  <ImageIcon size={20} className="text-neutral-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-black">Drop image here or click to browse</p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">JPG, PNG, WEBP · Max 10 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">
                Model Pipeline Version
              </label>
              <select
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black bg-white"
              >
                {MODEL_VERSIONS.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-none text-[11px] font-mono text-neutral-600">
                <Zap size={12} className="inline mr-1 text-black" />
                <strong>v2.0-20240919</strong>: lowest credit cost, optimized for quadruped pets.
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || !selectedPetId || isPending}
            className="w-full py-3 rounded-none font-bold uppercase tracking-widest text-xs text-white flex items-center justify-center gap-2 transition-colors
              bg-black hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading &amp; Dispatching Task…
              </>
            ) : !selectedPetId ? (
              <>
                <AlertCircle size={16} />
                Select a Pet Profile First
              </>
            ) : (
              <>
                <Zap size={16} />
                Generate 3D Asset
              </>
            )}
          </button>

          {/* Error */}
          {generateError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-none flex gap-2.5">
              <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-red-700">{generateError}</p>
            </div>
          )}

          {/* Success */}
          {generateMutation.isSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-none flex gap-2.5">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-emerald-800">
                Task created successfully. Your 3D model is being generated below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Task History ── */}
      <div className="bg-white rounded-none border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black">Generation Queue &amp; History</h2>
          {allTaskIds.length > 0 && (
            <span className="text-[10px] font-mono uppercase bg-white border border-neutral-200 px-2 py-0.5 text-neutral-700">
              {allTaskIds.length} tasks
            </span>
          )}
        </div>

        <div className="p-6">
          {isLoadingTasks && allTaskIds.length === 0 ? (
            <div className="flex items-center justify-center py-12 gap-3 text-neutral-400">
              <Loader2 size={20} className="animate-spin text-black" />
              <span className="text-xs font-mono uppercase tracking-wider">Syncing tasks…</span>
            </div>
          ) : allTaskIds.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-none flex items-center justify-center mx-auto mb-3">
                <Box size={22} className="text-neutral-400" />
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-black">No generation history</p>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">Upload an image above to dispatch 3D reconstruction</p>
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
