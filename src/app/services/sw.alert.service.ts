import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

@Injectable({
    providedIn: "root"
})
export class SwAlertService {
    showError(message: string) {
        return this.showAlert("error", "Error", message);
    }

    showSuccess(message: string) {
        return this.showAlert("success", "Success", message);
    }

    async showAlert(icon: SweetAlertIcon, title: string, message: string): Promise<SweetAlertResult<any>> {
        return Swal.fire({
            icon,
            title,
            text: message,
            allowOutsideClick: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK"
        });
    }
}