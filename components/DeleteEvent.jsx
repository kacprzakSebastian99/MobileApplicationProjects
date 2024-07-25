import { Alert } from 'react-native';
import { ipAddress } from './ipAddress';

const DeleteEvent = ({ eventId }) => {
    const deleteEvent = async () => {
        try {
            const response = await fetch(`http://${ipAddress}:3000/deleteEvent/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Wystąpił błąd podczas usuwania wydarzenia');
            }
            Alert.alert('Sukces', 'Wydarzenie zostało pomyślnie usunięte z bazy danych');
        } catch (error) {
            console.error('Błąd podczas usuwania wydarzenia: ', error);
            Alert.alert('Błąd', 'Wystąpił problem podczas usuwania wydarzenia');
        }
    };
    return deleteEvent;
};

export default DeleteEvent;
