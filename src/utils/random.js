import randToken from 'rand-token';
import uuid from 'uuid';

const uuidV1 = uuid.v1

export async function generateReference (schema, fields, taille) {

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

export async function generateUuid  (schema, fields)  {
    
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