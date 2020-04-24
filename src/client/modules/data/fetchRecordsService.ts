export class FetchRecordsService {
    static hitApi = () => fetch('/api/fetchRecords')
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
