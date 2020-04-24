import { LightningElement, track } from 'lwc';
import { PerformLogin } from '../../data/loginApiService';
import { PerformLogout } from '../../data/logoutApiService';
import { FetchRecordsService } from '../../data/fetchRecordsService';

export default class App extends LightningElement {
    @track isModalOpen:boolean = true;
    @track showLoader:boolean = false;
    @track isLoggedIn:boolean = false;
    @track accountRecords: any;
    @track isDataAvailableToShow: boolean = false;

    //Login Credentials
    @track credentials = {
        userName: '',
        password: '',
        securityToken: '',
        passAndToken: ''
    }

    loginUser() {
        this.credentials.passAndToken = this.credentials.password + this.credentials.securityToken;
        if (this.credentials.userName == '' || this.credentials.password == '' || this.credentials.securityToken == '') {
            this.showSnackbar('error', 'Please fill all the fields.');
        } else {
            this.showLoader = true;
            let loginData = JSON.stringify(this.credentials);
            console.log(loginData);
            PerformLogin.hitApi(loginData).then(result => {
                if(result.error){
                    this.openModal();
                    this.showSnackbar('error', 'Login Unsuccessful !');
                    this.showLoader = false;
                } else if(result.data){
                    this.showSnackbar('success', 'Logged In !');
                    this.isLoggedIn = true;
                    //Perform getObject Operation
                    this.showLoader = false;
                }
            });
        }
    }
    logOut() {
        this.showLoader = true;
        PerformLogout.hitApi().then(result => {
            if(result.error){
                this.showSnackbar('error', 'Error when Logging Out !');
            } else if(result.data){
                this.isLoggedIn = false;
                this.showSnackbar('success', 'Logged Out !');
            }
        });
        this.showLoader = false;
    }
    fetchRecords(event){
        this.showLoader = true;
        FetchRecordsService.hitApi().then(result => {
            console.log("Accounts Fetched ", result);
            this.showLoader = false;
            this.isDataAvailableToShow = true;
            this.accountRecords = result.data;
        });
    }
    handleUsernameChange(event) {
        this.credentials.userName = event.target.value;
    }
    handlePasswordChange(event) {
        this.credentials.password = event.target.value;
    }
    handleTokenChange(event) {
        this.credentials.securityToken = event.target.value;
    }
    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    showSnackbar(variant = 'error', message = 'Some Error Occoured !', duration = 3000) {
        this.template.querySelector('.snackbar').innerHTML= message;
        this.template.querySelector('.snackbar').classList.add('show' , variant);
        setTimeout(() => {
            this.template.querySelector('.snackbar').classList.remove('show' , variant);
        }, duration);
    }
}
