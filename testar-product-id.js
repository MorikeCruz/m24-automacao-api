const { spec } = require('pactum');

const URL = 'http://lojaebac.ebaconline.art.br/graphql';

async function testar() {

    const token = await spec()
        .post(URL)
        .withGraphQLQuery(`
            mutation AuthUser($email: String, $password: String) {
                authUser(email: $email, password: $password) {
                    success
                    token
                }
            }
        `)
        .withGraphQLVariables({
            email: 'admin@admin.com',
            password: 'admin123'
        })
        .stores('data.authUser.token');

    const response = await spec()
        .post(URL)
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            query {
                Product(id: "1") {
                    name
                    description
                    price
                    specialPrice
                    quantity
                    visible
                }
            }
        `)
        .expectStatus(200)
        .toss();

    console.log(JSON.stringify(response.body, null, 2));
}

testar();
