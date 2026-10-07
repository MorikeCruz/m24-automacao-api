const { spec } = require('pactum');

const URL = 'http://lojaebac.ebaconline.art.br/graphql';

async function descobrir() {
    const response = await spec()
        .post(URL)
        .withGraphQLQuery(`
            query {
                __type(name: "Product") {
                    name
                    fields {
                        name
                        type {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        `)
        .expectStatus(200)
        .toss();

    console.log(JSON.stringify(response.body, null, 2));
}

descobrir();