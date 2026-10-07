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

    console.log('TOKEN OK');

    const nomeProduto = 'Produto Investigacao M24';

    const criar = await spec()
        .post(URL)
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            mutation {
                addProduct(
                    name: "${nomeProduto}"
                    description: "Produto criado para investigação"
                    price: 999
                    specialPrice: 899
                    quantity: 5
                    visible: true
                ) {
                    __typename
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

    console.log('\n===== RESPOSTA DO ADD =====');
    console.log(JSON.stringify(criar.body, null, 2));

    const produtos = await spec()
        .post(URL)
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            query {
                Products {
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

    console.log('\n===== LISTA DE PRODUTOS =====');
    console.log(JSON.stringify(produtos.body, null, 2));
}

testar();