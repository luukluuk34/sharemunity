import { Injectable } from "@angular/core";


@Injectable({providedIn:'root'})
export class DataTransferService {
    private data:any

    setData(data:any){
        this.data = data;
    }

    isAvailable():boolean{
        if(this.data != null){
            return true;
        }else{
            return false;
        }
    }

    getData():any{
        const temp = this.data;
        this.data = null;
        console.log("--------",temp)
        return temp;
    }
}