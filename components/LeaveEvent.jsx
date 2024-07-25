import { Alert } from 'react-native';
import {eventNameJoin} from './ShowEvents';
import { ipAddress } from './ipAddress';

const LeaveEvent = async (eventName, userName) => {
    try {
        console.log(userName);
        console.log(eventNameJoin);
        const response = await fetch(`http://${ipAddress}:3000/leave/${eventName}/${userName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Wystąpił błąd podczas wypisywania się z wydarzenia');
        }
        Alert.alert('Sukces', 'Wypisano się z wydarzenia');
    } catch (error) {
        console.error('Błąd podczas przesyłania danych: ', error);
        Alert.alert('Błąd', 'Wystąpił problem podczas wypisywania się z wydarzenia');
    }
};

export default LeaveEvent;