import { FormControl } from '@angular/forms';

export function validarPassword(control: FormControl): { [key: string]: boolean } | null {

  const password = control.value;


  // Ejemplo de validación de longitud mínima
  if (password.length < 6) {
    return { 'longitudMinima': true };
  }

  // Ejemplo de validación de longitud máxima
  if (password.length > 16) {
    return { 'longitudMaxima': true };
  }

  // Ejemplo de validación de caracteres especiales
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { 'caracterEspecial': true };
  }

  // Ejemplo de validación de letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return { 'letraMayuscula': true };
  }

  // Ejemplo de validación de letra minúscula
  if (!/[a-z]/.test(password)) {
    return { 'letraMinuscula': true };
  }

  if (!/\d/.test(password)) {
    return { 'numero': true };
  }
  // Si la contraseña pasa todas las validaciones, retorna null
  return null;
}