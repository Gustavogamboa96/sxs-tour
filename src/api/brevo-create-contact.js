const apiKey = import.meta.env.VITE_API_KEY;
const listId = 3; //refers to fan-emails 

export default async function addContact(email){
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          email: email,
          listIds: [listId],
        })
    };
    try {
        const res = await fetch('https://api.brevo.com/v3/contacts', options)
        const data = await res.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    }
}