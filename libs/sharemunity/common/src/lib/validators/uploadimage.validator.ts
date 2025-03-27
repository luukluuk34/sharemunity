import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationError } from '@nestjs/common';

export function uploadImageFileValidator(): ValidatorFn {
  //This only works with a File type and File[]

  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) return null;

    const validImageTypes = ['image/jpeg', 'image/png'];

    if (Array.isArray(value)) {
      for (let file of value) {
        if (!validImageTypes.includes(file.type)) {
          console.log('Invalid File');
          return { uploadImageFileValidator: true }; // Invalid file found
        }
      }
    } else if (value instanceof File) {
      if (!validImageTypes.includes(value.type)) {
        console.log('Invalid File');
        return { uploadImageFileValidator: true }; // Single invalid file
      }
    }
    console.log("Files are valid")
    return null; // All files are valid
  };
}
