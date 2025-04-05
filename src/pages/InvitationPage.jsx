import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const InvitationPage = () => {
  const { t } = useTranslation();
  const { invitationId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, error, success
  const [error, setError] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:8080/api/invitations/${invitationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setProjectDetails(response.data);
        setStatus('pending');
      } catch (err) {
        setError(t('invitation.error') || 'Invalid or expired invitation');
        setStatus('error');
      }
    };

    fetchInvitationDetails();
  }, [invitationId, isLoaded, user, getToken]);

  const handleAcceptInvitation = async () => {
    try {
      const token = await getToken();
      await axios.post(`http://localhost:8080/api/invitations/${invitationId}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setStatus('success');
      setTimeout(() => {
        navigate(`/project/${projectDetails.projectId}`);
      }, 2000);
    } catch (err) {
      setError(t('invitation.accept.error') || 'Failed to accept invitation');
      setStatus('error');
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      const token = await getToken();
      await axios.post(`http://localhost:8080/api/invitations/${invitationId}/decline`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setStatus('declined');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(t('invitation.decline.error') || 'Failed to decline invitation');
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--loginpage-bg2)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--features-icon-color)] mx-auto" />
          <p className="mt-2 text-[var(--features-text-color)]">{t('invitation.loading')}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--loginpage-bg2)]">
        <div className="text-center p-8 bg-[var(--bg-color)] rounded-lg shadow-xl max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--features-title-color)] mb-2">{t('invitation.error.title')}</h2>
          <p className="text-[var(--features-text-color)] mb-4">{error}</p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-[var(--features-icon-color)] text-white px-4 py-2 rounded hover:bg-[var(--hover-color)]"
          >
            {t('invitation.return')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--loginpage-bg2)]">
      <div className="p-8 bg-[var(--bg-color)] rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-[var(--features-title-color)] mb-6">{t('invitation.title')}</h2>
        
        {status === 'success' && (
          <div className="text-center">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-[var(--features-text-color)] mb-4">{t('invitation.accepted')}</p>
          </div>
        )}
        
        {status === 'declined' && (
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-[var(--features-text-color)] mb-4">{t('invitation.declined')}</p>
          </div>
        )}
        
        {status === 'pending' && projectDetails && (
          <>
            <p className="text-[var(--features-text-color)] mb-6">
              {t('invitation.message', { project: projectDetails.projectName })}
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeclineInvitation}
                className="px-4 py-2 border border-gray-300 rounded-lg text-[var(--features-text-color)] hover:bg-gray-100"
              >
                {t('invitation.decline')}
              </button>
              <button
                onClick={handleAcceptInvitation}
                className="px-4 py-2 bg-[var(--features-icon-color)] text-white rounded-lg hover:bg-[var(--hover-color)]"
              >
                {t('invitation.accept')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvitationPage;
