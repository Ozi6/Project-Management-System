import { useTranslation } from 'react-i18next';

/**
 * Generates a human-readable message for an activity
 * @param {Object} activity - The activity object
 * @param {Function} t - The translation function from i18next
 * @returns {string} - The generated message
 */
export const generateActivityMessage = (activity, t) => {
    if (!activity) return '';

    // Special case for project creation/update
    if (activity.entityType === "PROJECT") {
        const actor = activity.user?.username || activity.user?.userId || t('activity.system');
        if (activity.actionType === "UPDATED") {
            return t('activity.project.updated', { actor, projectName: activity.project?.projectName || '' });
        } else {
            return t('activity.project.created', { actor, projectName: activity.project?.projectName || '' });
        }
    }

    // Special case for category
    if (activity.entityType === "CATEGORY") {
        const actor = activity.user?.username || activity.user?.userId || t('activity.system');
        if (activity.actionType === "UPDATED") {
            return t('activity.category.updated', { actor, projectName: activity.project?.projectName || '' });
        } else {
            return t('activity.category.created', { actor, projectName: activity.project?.projectName || '' });
        }
    }

    // For all other cases
    const action = {
        "CREATE": t('activity.actions.created'),
        "UPDATE": t('activity.actions.updated'),
        "DELETE": t('activity.actions.deleted'),
        "ADD": t('activity.actions.added'),
        "REMOVE": t('activity.actions.removed')
    }[activity.actionType] || activity.actionType?.toLowerCase() || '';

    const entityName = activity.entityName 
        ? `'${activity.entityName}'`
        : t('activity.entity.the', { type: t(`activity.entity.types.${activity.entityType?.toLowerCase()}`) || activity.entityType?.toLowerCase() || '' });

    return t('activity.generic', { 
        entityName, 
        action, 
        entityType: t(`activity.entity.types.${activity.entityType?.toLowerCase()}`) || activity.entityType?.toLowerCase() || '',
        projectName: activity.project?.projectName || ''
    });
}; 