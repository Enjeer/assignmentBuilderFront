// storageService.ts
class StorageService{

    static setItem(key: string, data: any){
        try{
            const payload = JSON.stringify(data);
            localStorage.setItem(key, payload);
        } catch(error: any) {
            console.log('Encountered and error storing userId');
        }
    }

    static getItem<T = any>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        } catch(error: any) {
            console.log('Error getting user data', error);
            return null;
        }
    }

    static removeItem(key: string){
        try{
            localStorage.removeItem(key);
            return null;
        } catch(error: any) {
            console.log('Error removing data', error);
        }
    }

    static addDocs(key: string, data: {}){
        try{
            localStorage.setItem(key, JSON.stringify(data));
        } catch(error: any) {
            console.log(error)
        }
    }
}

export default StorageService;