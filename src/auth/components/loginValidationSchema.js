import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
    user: yup
    .string()
    .required("Usuario es requerido")
    .min(3,"El usuario debe tener mínimo 3 caracteres")
    .max(30, "El usuario debe tener máximo 30 caracteres")
    .test('valid-user', 'El usuario no puede tener espacios ni caracteres especiales diferentes a _',
     function (value) {
        const regex=/^\w{3,30}$/;
        return regex.test(value) 
    }),
    password: yup
    .string()
    .required("Contraseña es requerida")
    .min(8, "La contraseña debe tener mínimo 8 caracteres")
    .max(100, "La contraseña puede tener máximo 100 caracteres")
    .test('valid-password', 'La contraseña tiene una estructura inválida',
     function (value) {
        const regex=/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,100}$/;
        return regex.test(value) 
    })
})