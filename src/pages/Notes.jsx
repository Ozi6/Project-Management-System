import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Search, AlertCircle, PenTool, Calendar, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useUser } from '@clerk/clerk-react';



const Notes = () => {
  const { t } = useTranslation();
  const { id: projectId } = useParams();
  const { getToken } = useAuth();

  const {user,isLoaded} = useUser();

  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    projectId: projectId
  });

  // Fetch notes when component mounts
  useEffect(() => {
    if(isLoaded && user && projectId)
    {
      fetchNotes();

    }
  }, [isLoaded,user,projectId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      console.log("Sending request with userId:", user.id);
      const response = await axios.get(
        `http://localhost:8080/api/projects/${projectId}/notes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': user.id
          }
        }
      );
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        [name]: value
      });
    } else {
      setNewNote({
        ...newNote,
        [name]: value
      });
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await axios.post(
        'http://localhost:8080/api/notes',
        newNote,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'userId': user.id
          }
        }
      );
      
      // Reset form and close modal
      setNewNote({
        title: '',
        content: '',
        projectId: projectId
      });
      setShowNoteModal(false);
      
      // Refresh notes list
      fetchNotes();
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note. Please try again.');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:8080/api/notes/${currentNote.id}`,
        currentNote,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'userId': user.id
          }
        }
      );
      
      // Reset form and close modal
      setCurrentNote(null);
      setShowNoteModal(false);
      
      // Refresh notes list
      fetchNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm(t('notes.confirmDelete'))) return;
    
    try {
      const token = await getToken();
      await axios.delete(
        `http://localhost:8080/api/notes/${noteId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': user.id
          }
        }
      );
      
      // Refresh notes list
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setShowNoteModal(true);
  };

  const addNewNote = () => {
    setCurrentNote(null);
    setShowNoteModal(true);
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b border-gray-200">
        <Header
          title={<span className="text-xl font-semibold text-[var(--text-color)]">{t('notes.title')}</span>}
          action={{
            onClick: addNewNote,
            icon: <Plus className="mr-2 h-4 w-4" />,
            label: t('notes.addNote')
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-[var(--gray-card2)] p-6">
        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-[var(--bg-color)] border border-gray-300 text-[var(--text-color)] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder={t('notes.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <PenTool className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-[var(--features-title-color)] mb-1">
              {searchTerm ? t('notes.noResults') : t('notes.noNotes')}
            </h3>
            <p className="text-[var(--features-text-color)]">
              {searchTerm ? t('notes.tryDifferent') : t('notes.createFirst')}
            </p>
            {!searchTerm && (
              <button 
                onClick={addNewNote}
                className="mt-4 inline-flex items-center px-4 py-2 bg-[var(--features-icon-color)] text-white rounded-md hover:bg-[var(--hover-color)] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('notes.addNote')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--bg-color)] rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <h3 className="font-medium text-lg text-[var(--features-title-color)] mb-2 line-clamp-1">
                    {note.title}
                  </h3>
                  <div className="text-[var(--features-text-color)] text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                    {note.content}
                  </div>
                  <div className="flex justify-between items-center text-xs text-[var(--text-color3)]">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => editNote(note)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title={t('notes.edit')}
                      >
                        <PenTool className="h-4 w-4 text-[var(--features-icon-color)]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title={t('notes.delete')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Note modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-color)] rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[var(--features-title-color)]">
                {currentNote ? t('notes.editNote') : t('notes.addNote')}
              </h3>
            </div>
            
            <form onSubmit={currentNote ? handleUpdateNote : handleCreateNote} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">
                  {t('notes.noteTitle')}
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentNote ? currentNote.title : newNote.title}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[var(--gray-card3)] border border-gray-300 text-[var(--text-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder={t('notes.titlePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">
                  {t('notes.noteContent')}
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={currentNote ? currentNote.content : newNote.content}
                  onChange={handleInputChange}
                  rows="8"
                  className="w-full p-3 bg-[var(--gray-card3)] border border-gray-300 text-[var(--text-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder={t('notes.contentPlaceholder')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNoteModal(false);
                    setCurrentNote(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-[var(--text-color)] hover:bg-gray-100"
                >
                  {t('notes.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--features-icon-color)] text-white rounded-md hover:bg-[var(--hover-color)]"
                >
                  {currentNote ? t('notes.update') : t('notes.create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notes;