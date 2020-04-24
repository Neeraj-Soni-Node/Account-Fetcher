export class PerformLogout {
    static hitApi = () => fetch('/api/logout')
        .then(response => {
            if (!response.ok) {
                throw new Error('No response from server');
            }
            return response.json();
        })
        .then(result => {
            return result;
        });
}
