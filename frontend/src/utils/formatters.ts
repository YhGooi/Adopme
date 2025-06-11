// Utility functions for formatting values in the UI

/**
 * Maps housing type enum values to user-friendly display values
 * @param housingType The housing type enum value
 * @returns A user-friendly display value
 */
export const formatHousingType = (housingType: string | null | undefined): string => {
    if (!housingType) return 'Not provided';
    
    const housingTypeMap: { [key: string]: string } = {
        'LANDED': 'Landed Property',
        'CONDO': 'Condominium/Apartment'
    };
    
    return housingTypeMap[housingType] || housingType;
};

/**
 * Maps petting experience enum values to user-friendly display values
 * @param experience The petting experience enum value
 * @returns A user-friendly display value
 */
export const formatPettingExperience = (experience: string | null | undefined): string => {
    if (!experience) return 'Not provided';
    
    const experienceMap: { [key: string]: string } = {
        'NONE': 'No Experience',
        'LITTLE': 'Little Experience',
        'SOME': 'Some Experience',
        'LOT': 'Experienced Pet Owner'
    };
    
    return experienceMap[experience] || experience;
};

/**
 * Returns a display value for empty or null values
 * @param value The value to check
 * @returns The original value or a default message for empty values
 */
export const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
        return 'Not provided';
    }
    return value;
};

/**
 * Formats a date string to a readable format
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not provided';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Error formatting date';
    }
};
