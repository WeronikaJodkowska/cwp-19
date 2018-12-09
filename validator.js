const Joi = require('joi');
// Язык описания схемы объекта и валидатор для объектов JavaScript.
const schemas = {
    '/signin': Joi.object().keys({
        login: Joi.string(),
        password: Joi.string(),
    }),
    '/signup': Joi.object().keys({
        login: Joi.string(), // строка
        password: Joi.string().min(10), // строка, минимальная длина 10
        email:  Joi.string().email().optional(), // электронная почта, опциональный параметр
        invitedBy: Joi.string().optional(), // строка, опциональный параметр
        birth: Joi.date().min('01-01-1997'), // дата, минимум 21 год
        sex: Joi.string().valid(['male', 'female']), // строка, разрешено только 'male' и 'female'
        agreedWithTerms: Joi.boolean().invalid(false) // булеан, равен true
    }),
    '/drinks': Joi.object().keys({
        name: Joi.string().min(3).max(50), // строка, минимальная длина 3 максимальная 50
        strength: Joi.number().precision(2).positive(), // число, дробное, положительное
        code: Joi.string().regex(/\w/), // строка, только числа и буквы
        alcoholic: Joi.any().when('strength', {is: Joi.number().greater(0), then: Joi.boolean().valid(true)})
        // булеан, должно быть true если strength больше 0
    }),
    '/recipes': Joi.object().keys({
        name: Joi.string(), // строка
        ingredients: Joi.array().unique('name').min(2).items(Joi.object().keys({ // массив объектов, минимум 2
            name: Joi.string(), // строка, уникальная в массиве
            weight: Joi.number().integer().positive(), // число, целое, положительное
            photos: Joi.array().items(Joi.string()).optional() // массив строк, опциональный параметр
        })),
        photos: Joi.array().items(Joi.string()).optional(), // массив строк, опциональный параметр
        portions: Joi.alternatives().try(Joi.string(), Joi.number().greater(0)) // строка или положительное не нулевое число
    })
};

exports.check = function (schema, body) {
    if (!schemas[schema])  return {};
    return Joi.validate(body, schemas[schema], { presence: 'required' });
};