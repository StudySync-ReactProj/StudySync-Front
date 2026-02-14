// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchFreeBusyData = async (userId, emails) => {
    // Get JWT token from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');

    let authToken = null;
    
    try {
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            authToken = parsedInfo.token;
        }
        
        if (!authToken) {
            console.error("❌ No authentication token found in localStorage");
            return { calendars: {} };
        }
        
        console.log("✅ Auth Token found, making freebusy request");

        const response = await fetch(`${API_BASE_URL}/api/google-calendar/freebusy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                userId,
                emails,
                timeMin: new Date().toISOString(),
                timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
                console.error('❌ 401 Unauthorized - Token invalid or expired');
                return { calendars: {} };
            }
            
            // If user doesn't have Google connected, return empty calendars object
            if (!errorData.calendars) {
                console.log('ℹ️  Google Calendar not connected - returning empty availability');
                return { calendars: {} };
            }
            
            throw new Error(errorData.message || 'Failed to fetch availability');
        }
        
        const data = await response.json();
        console.log('✅ Freebusy data received successfully');
        return data;
        
    } catch (error) {
        // If any error occurs, return empty calendars to prevent app crashes
        console.log('ℹ️  Error fetching freebusy data - returning empty availability:', error.message);
        return { calendars: {} };
    }
};