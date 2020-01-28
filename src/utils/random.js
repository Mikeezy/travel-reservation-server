import { generate } from 'rand-token';
import uuidV1 from 'uuid/v1';
import Promise from 'bluebird';


export function generateReference (schema, fields, taille) {

    return new Promise((resolve, reject) => {

        let code = generate(taille);

        schema.findOne({
            [fields]: code
        }).exec().then((result) => {

            if (result === null || typeof result._id === 'undefined') {

                resolve(code);

            } else {
                generateReference(schema, fields, taille);
            }

        }).catch((error) => {

            reject(error);
        });

    });


}

export function generateUuid  (schema, fields)  {

    return new Promise((resolve, reject) => {

        let code = uuidV1();

        schema.findOne({
            [fields]: code
        }).exec().then((result) => {


            if (result === null || typeof result._id === 'undefined') {

                resolve(code);

            } else {

                generateUuid(schema, fields);

            }

        }).catch((error) => {

            reject(error);
        });

    });

}