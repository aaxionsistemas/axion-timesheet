import React, { useState } from 'react';
import { 
  Paperclip, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  File,
  Plus
} from 'lucide-react';

import { Project, ProjectAttachment } from '@/types/project';

interface AttachmentModalProps {
  project: Project;
  onUpdate: (attachments: ProjectAttachment[]) => void;
}

export default function AttachmentModal({ project, onUpdate }: AttachmentModalProps) {
  const [attachments, setAttachments] = useState<ProjectAttachment[]>(project.attachments || []);
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
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAttachments: ProjectAttachment[] = Array.from(files).map((file, index) => ({
      id: `att_${Date.now()}_${index}`,
      project_id: project.id,
      name: file.name,
      file_url: `/uploads/${file.name}`,
      file_size: file.size,
      mime_type: file.type,
      uploaded_at: new Date().toISOString()
    }));

    const updatedAttachments = [...attachments, ...newAttachments];
    setAttachments(updatedAttachments);
    onUpdate(updatedAttachments);
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
    setAttachments(updatedAttachments);
    onUpdate(updatedAttachments);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">Anexos do Projeto</h3>
          <p className="text-sm text-gray-400 truncate">{project.canal} - {project.cliente}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 flex-shrink-0">
          <Paperclip size={16} />
          <span className="hidden sm:inline">{attachments.length} arquivo{attachments.length !== 1 ? 's' : ''}</span>
          <span className="sm:hidden">{attachments.length}</span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <Upload className="text-gray-400" size={40} />
          </div>
          <div>
            <p className="text-white font-medium mb-2 text-sm sm:text-base">Adicionar novos arquivos</p>
            <p className="text-xs sm:text-sm text-gray-400">Arraste arquivos aqui ou clique para selecionar</p>
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
              <span className="inline-flex items-center gap-2 bg-[#23232b] border border-[#2a2a2a] text-white font-medium px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl hover:bg-[#2a2a2a] hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer touch-manipulation min-h-[44px] sm:min-h-0 text-sm sm:text-base"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Enviando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span className="hidden sm:inline">Selecionar Arquivos</span>
                    <span className="sm:hidden">Arquivos</span>
                  </>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Lista de Anexos */}
      {attachments.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm sm:text-base">Arquivos Anexados</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.mime_type);
              
              return (
                <div 
                  key={attachment.id} 
                  className="flex items-center gap-3 p-3 bg-[#23232b] rounded-lg border border-[#2a2a2a] hover:border-blue-500/50 transition-all"
                >
                  <div className="flex-shrink-0">
                    <FileIcon className="text-blue-400" size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {attachment.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{new Date(attachment.uploaded_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-2.5 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-lg transition-all duration-300 touch-manipulation"
                      title="Baixar arquivo"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(attachment.id)}
                      className="p-2.5 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-300 touch-manipulation"
                      title="Excluir arquivo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Paperclip className="mx-auto text-gray-500 mb-3" size={48} />
          <p className="text-gray-400">Nenhum arquivo anexado ainda</p>
          <p className="text-sm text-gray-500 mt-1">Adicione arquivos usando o botão acima</p>
        </div>
      )}

      <div className="border-t border-[#23232b] pt-4">
        <p className="text-xs text-gray-500">
          Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF
          <br />
          Tamanho máximo por arquivo: 10MB
        </p>
      </div>
    </div>
  );
} 