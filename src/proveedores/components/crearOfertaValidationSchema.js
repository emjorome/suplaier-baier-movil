
import * as Yup from 'yup';

const crearOfertaValidationSchema = Yup.object().shape({
    // title: Yup.string().required('Title is required'),
    product: Yup.number().required('El producto es requerido'),
    idValorInst: Yup.string().required('El valor instantáneo es requerido'),
    description: Yup.string().required('La descripción es requerida')
    .min(20,"La descripción no puede ser menor a 20 caracteres")
    .max(480,"La descripción no puede ser superior a los 480 caracteres")
    .test('valid-structure', '" - \' son caracteres especiales inválidos',
    function (value) {
       const regex=/^[^-"']*$/;
       return regex.test(value) 
   }),
    pmin: Yup.string().required('El precio mínimo es requerido')
    .test('positive', 'El precio mínimo debe ser un número positivo', function (value) {           
        return parseFloat(value) > 0;
   }).test('limit', 'El precio mínimo no puede ser mayor a 10000', function (value) {           
    return parseFloat(value) <= 10000;
})
    .test('twodecimals-price', 'El precio unitario debe ser con punto y tener dos decimales', function (value) {
        const regex = /^\d+(\.\d{2})?$/;
        return regex.test(value.toString());
   }),
    pmax: Yup.string()
         .when('idValorInst', {
            is: 'conInst',
            then: (schema) => schema.required('El precio instantáneo es requerido')
                .test('positive', 'El precio instantáneo debe ser un número positivo', function (value) {       
                    return parseFloat(value) > 0;
                })
                .test('limit', 'El precio máximo no puede ser mayor a 10000', function (value) {           
                    return parseFloat(value) <= 10000;
                })
                .test('higher-price', 'El precio instantáneo debe ser mayor o igual al precio mínimo', function (value) {
                    const pmin = parseFloat(this.parent.pmin);
                    return value >= pmin;
                })
                .test('twodecimals-price', 'El precio instantáneo debe ser con punto y tener dos decimales', function (value) {
                    const regex = /^\d+(\.[0-9]{2})?$/;
                    return regex.test(value.toString());
                }),
            otherwise: (schema) => schema.notRequired()
         }),
    umin: Yup.number()
    .required('La cantidad mínima de unidades es requerida')
    .integer('La cantidad minima debe ser un número entero')
    .positive('La cantidad minima debe ser un número positivo')
    .max(8000,'La cantidad minima no puede ser mayor a 8000'),
    umax: Yup.number()
        .required('La cantidad total es requerida')
        .integer('La cantidad total debe ser un número entero')
        .positive('La cantidad total debe ser un número positivo').max(8000,'La cantidad máxima no puede ser mayor a 8000')
        .test('higher-min', 'La cantidad total debe ser mayor o igual a la cantidad minima', function (value) {
            const umin = this.parent.umin;
            return value >= umin;
        }),
    date: Yup.date().required("La fecha límite es requerida")
});

export default crearOfertaValidationSchema;