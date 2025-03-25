import { AbstractControl, ValidatorFn } from "@angular/forms";
import { ValidationError } from "@nestjs/common";

export function uploadImageFileValidator(): ValidatorFn {
    //This only works with a FILE type

    return (control:AbstractControl): {[key: string] : any } | null => {
        const value = control.value;
        if(!value) return null;

        const pattern = /\.(png|jpe?g)$/;
        const isValid = pattern.test(value.filename);

        if(isValid){
            console.log("Valid");
            return null;
        }else{
            console.log("Invalid");
            console.log(value);
            return {uploadImageFileValidator:true};
        }
    }
}