import React from 'react';
import { Paperclip, Download, Code } from 'lucide-react';

const FileAttachment = ({ attachment }) =>
{
    const handleDownload = () =>
    {
        if(!attachment)
        {
            console.error('No attachment data provided');
            return;
        }

        try{
            if(attachment.fileData)
            {
                let mimeType = 'application/octet-stream';
                if (attachment.name.endsWith('.pdf')) mimeType = 'application/pdf';
                else if (attachment.name.endsWith('.jpg') || attachment.name.endsWith('.jpeg'))
                    mimeType = 'image/jpeg';
                else if (attachment.name.endsWith('.png')) mimeType = 'image/png';

                if(!/^[A-Za-z0-9+/=]+$/.test(attachment.fileData))
                {
                    console.error('Invalid base64 string for fileData');
                    return;
                }
                const link = document.createElement('a');
                link.href = `data:${mimeType};base64,${attachment.fileData}`;
                link.download = attachment.name || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else if(attachment.blobUrl)
            {
                const link = document.createElement('a');
                link.href = attachment.blobUrl;
                link.download = attachment.name || 'download';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => URL.revokeObjectURL(attachment.blobUrl), 100);
                document.body.removeChild(link);
            }
            else
                console.error('No fileData or blobUrl available for attachment');
        }catch(error){
            console.error('Error during file download:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    return(
        <div className="flex items-center gap-2 p-2 mt-2 bg-[var(--gray-card3)]/30 rounded-lg">
            {attachment.type === 'image' && attachment.fileData ? (
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <img
                        src={`data:image/jpeg;base64,${attachment.fileData}`}
                        alt="Preview"
                        className="w-6 h-6 object-cover"/>
                </div>
            ) : attachment.type === 'document' ? (
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <Paperclip size={16} className="text-red-500" />
                </div>
            ) : (
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <Code size={16} className="text-purple-500" />
                </div>
            )}
            <div className="flex-1">
                <div className="text-sm font-medium text-[var(--features-title-color)]">
                    {attachment.name}
                </div>
                <div className="text-xs text-[var(--features-text-color)] opacity-70">{attachment.size}</div>
            </div>
            <button
                onClick={handleDownload}
                className="text-[var(--features-icon-color)] hover:text-[var(--hover-color)]"
                title="Download">
                <Download size={16}/>
            </button>
        </div>
    );
};

export default FileAttachment;