import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  File,
  Plus,
  X
} from 'lucide-react';
import { ProjectAttachment } from '@/types/project';

interface FileUploadAreaProps {
  attachments: ProjectAttachment[];
  onAttachmentsChange: (attachments: ProjectAttachment[]) => void;
  compact?: boolean;
  showTitle?: boolean;
}

export default function FileUploadArea({ 
  attachments, 
  onAttachmentsChange, 
  compact = false,
  showTitle = true 
}: FileUploadAreaProps) {
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // Simular upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAttachments: ProjectAttachment[] = Array.from(files).map((file, index) => ({
      id: `att_${Date.now()}_${index}`,
      project_id: '',
      name: file.name,
      file_url: `/uploads/${file.name}`,
      file_size: file.size,
      mime_type: file.type,
      uploaded_at: new Date().toISOString()
    }));

    const updatedAttachments = [...attachments, ...newAttachments];
    onAttachmentsChange(updatedAttachments);
    setIsUploading(false);

    // Limpar input
    event.target.value = '';
  };

  const handleDownload = (attachment: ProjectAttachment) => {
    // Simular download
    window.open(attachment.file_url, '_blank');
  };

  const handleDelete = (attachmentId: string) => {
    const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
    onAttachmentsChange(updatedAttachments);
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">Anexos</h4>
          {attachments.length > 0 && (
            <span className="text-xs text-gray-400">
              {attachments.length} arquivo{attachments.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className={`border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-blue-500 transition-colors ${
        compact ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className={`space-y-3 ${compact ? '' : 'sm:space-y-4'}`}>
          <div className="flex justify-center">
            <Upload className="text-gray-400" size={compact ? 32 : 40} />
          </div>
          <div>
            <p className={`text-white font-medium mb-2 ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
              Adicionar arquivos
            </p>
            <p className={`text-gray-400 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
              {compact ? 'Clique para selecionar' : 'Arraste arquivos aqui ou clique para selecionar'}
            </p>
          </div>
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <span className={`inline-flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer touch-manipulation ${
                compact 
                  ? 'px-3 py-2 text-xs min-h-[36px]' 
                  : 'px-4 sm:px-5 py-2.5 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm sm:text-base'
              }`}>
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className={compact ? 'hidden' : 'hidden sm:inline'}>Enviando...</span>
                    <span className={compact ? 'inline' : 'sm:hidden'}>...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span className={compact ? 'inline' : 'hidden sm:inline'}>
                      {compact ? 'Anexar' : 'Selecionar Arquivos'}
                    </span>
                    <span className={compact ? 'hidden' : 'sm:hidden'}>Arquivos</span>
                  </>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Lista de Anexos */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className={`space-y-2 ${compact ? 'max-h-40' : 'max-h-60'} overflow-y-auto`}>
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.mime_type);
              
              return (
                <div 
                  key={attachment.id} 
                  className={`flex items-center gap-3 bg-[#23232b] rounded-lg border border-[#2a2a2a] hover:border-blue-500/50 transition-all ${
                    compact ? 'p-2.5' : 'p-3'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <FileIcon className="text-blue-400" size={compact ? 16 : 18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-white font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                      {attachment.name}
                    </div>
                    <div className={`text-gray-400 flex items-center gap-2 ${compact ? 'text-xs' : 'text-xs'}`}>
                      <span>{formatFileSize(attachment.file_size)}</span>
                      {!compact && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            {new Date(attachment.uploaded_at).toLocaleDateString('pt-BR')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!compact && (
                      <button
                        onClick={() => handleDownload(attachment)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-lg transition-all duration-300 touch-manipulation"
                        title="Baixar arquivo"
                      >
                        <Download size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(attachment.id)}
                      className={`text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-300 touch-manipulation ${
                        compact ? 'p-1.5' : 'p-2'
                      }`}
                      title="Remover arquivo"
                    >
                      {compact ? <X size={12} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!compact && attachments.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">Nenhum arquivo anexado ainda</p>
        </div>
      )}
    </div>
  );
} 