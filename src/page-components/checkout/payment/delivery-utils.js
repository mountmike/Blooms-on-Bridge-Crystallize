import axios from "axios";

export const getAddresses = async (address) => {
        const options = {
            method: 'GET',
            url: 'https://addressr.p.rapidapi.com/addresses',
            params: {q: address},
            headers: {
                'X-RapidAPI-Key': '4354519a8amshb8290e08d4b9d8fp11e6a3jsnb8de5d605ddf',
                'X-RapidAPI-Host': 'addressr.p.rapidapi.com'
            }
        };
    
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);

    }
}