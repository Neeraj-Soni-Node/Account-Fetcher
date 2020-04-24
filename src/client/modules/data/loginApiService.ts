export class PerformLogin {
    static hitApi = (loginCredentials) => fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: loginCredentials
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No response from server');
            }
            return response.json();
        }).then(result => {
            return result;
        })
        .catch((err) => {
            console.log('Fetch Error ', err);
        });
}
