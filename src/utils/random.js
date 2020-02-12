const randToken = require('rand-token')
const uuidV1 = require('uuid/v1')

exports.generateReference =  async function generateReference (schema, fields, taille) {

    const code = randToken.generate(taille);

    const result = await schema.findOne({
        [fields]: code
    }).exec()

    if(result === null || typeof result._id === 'undefined'){

        return code

    }else{

        return generateReference(schema, fields, taille)

    }

}

exports.generateUuid =  async function generateUuid  (schema, fields)  {
    
    const code = uuidV1();

    const result = await schema.findOne({
        [fields]: code
    }).exec()

    if(result === null || typeof result._id === 'undefined'){

        return code

    }else{

        return generateUuid(schema, fields)

    }

}