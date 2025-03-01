import {ID, Account, Client  } from 'appwrite'

const appwriteClient = new Client();

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "ai-ecommerce";
const APPWRITE_API_KEY = "standard_4cb4626c4d8c95307b118f746aa0c231f2eed06244f32627738802ea87aa7389ac61af1b3b9087f1ea712b8b6c921d40dbcb67360d59436342226ccf26c86974fac8868927a0c7b359fd807e07b5881421e683904bba648d3a2da0102688c8b86ca7a55ff9a6ecf2f263fd45619db24081050bf8148b57da9a7eaab26ae01a5a"; 



//create an appwrite class
//from documentation
class AppwriteService {
    account;

    constructor() {
        appwriteClient
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        

        this.account = new Account(appwriteClient)    
        
    } 
    //create a new record of an user inside appwrite

    async createAccount( {email, password, name} ) {
        try {
            //no need to pass object on registering
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if(userAccount) {
                //but need to pass object during login 
                //login the user
                return this.login({email, password})
            }
            else {
                return userAccount;
            }
        }
        catch (error) {
            console.log("Error", error);
        }
    }   
    async login({email, password}) {
        try {
           return await this.account.createEmailPasswordSession(email, password);
        }
        catch (error) {
            console.log("Error", error);
        }
    }  

    async getCurrentUserDetails () {
        try {
           return await this.account.get()

        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession('current');
 
         }
         catch (error) {
             console.log("Error", error)
         }
    }
}

export default AppwriteService;
