const { spec } = require('pactum');

const URL = 'http://lojaebac.ebaconline.art.br/graphql';

let token;

beforeEach(async () => {
    token = await spec()
        .post(URL)
        .withGraphQLQuery(
            'mutation AuthUser($email: String, $password: String) {' +
            ' authUser(email: $email, password: $password) {' +
            ' success' +
            ' token' +
            ' }' +
            '}'
        )
        .withGraphQLVariables({
            email: 'admin@admin.com',
            password: 'admin123'
        })
        .stores('data.authUser.token');
});

describe('Contrato - Produto', () => {

    it('deve validar o contrato do addProduct', async () => {

        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(
                'mutation {' +
                ' addProduct(' +
                ' name: "Contrato Produto M24"' +
                ' description: "Produto para teste de contrato"' +
                ' price: 100' +
                ' specialPrice: 90' +
                ' quantity: 10' +
                ' visible: true' +
                ' ) {' +
                ' name' +
                ' description' +
                ' price' +
                ' specialPrice' +
                ' quantity' +
                ' visible' +
                ' }' +
                '}'
            )
            .expectStatus(200)
            .expectJsonMatch({
                data: {
                    addProduct: {
                        name: null,
                        description: null,
                        price: null,
                        specialPrice: null,
                        quantity: null,
                        visible: null
                    }
                }
            });
    });

});