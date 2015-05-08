
## A Quick Guide to yup

Create schemas by calling the type factories on the `yup` object.

```console
  // base: matches every type
  yup.mixed() 

  // primitive types
  yup.string()
  yup.date()
  yup.number()
  yup.bool()

  // complex types
  yup.array().of(yup.number())
  yup.object({
      property: yup.string()    
  })
```

Schema objects are immutable, so each method returns a _new_ schema object. This is helpful for reusing schemas without worrying about breaking existing ones.

```console
  var string = yup.string();
  var requiredString = string.required();

  console.log(string !== requiredString)

  console.log(
    requiredString !== requiredString.max(5))
```

Schemas can be combined (as long as they are the same type) using `.concat()`

```console
  var defaultString = yup.string().default('hi');
  var reqString = yup.string().required();

  var reqDefaultString = defaultString.concat(reqString)

  console.log(reqDefaultString.default())

  reqDefaultString.isValid('').then(
    valid => console.log(valid))

```

You can use `yup` to coerce objects to match the defined schema with `.cast()`

```console
  var schema = yup.object()
    .camelcase()
    .shape({
      firstName: yup.string().trim(),
      age:       yup.number()
    })

  console.log(
    schema.cast({ FIRST_NAME: '  John  ', age: '6' }))
```

Validate an object against a schema with `.validate()` or `.isValid()`, By default validation will also call `.cast()` unless you pass the `strict` option, during validation.

```console
  var schema = yup.object()
    .camelcase()
    .shape({
      firstName: yup.string().trim(),
      age:       yup.number()
    })

  schema.validate({ FIRST_NAME: '  John  ', age: '6' })
    .then(value => console.log('validate: ', value))

  // pass in the strict option to disable coercion
  schema.validate(
      { FIRST_NAME: '  John  ', age: '6' },
      { strict: true }
    ).catch(err  => console.log('strict: ', err.errors))

  schema.isValid(
      { FIRST_NAME: '  John  ', age: '6' }, 
      { strict: true }
    ).then( valid => console.log('isValid:', valid))
```