const { spec } = require('pactum');
const assert = require('assert');

const URL = 'http://lojaebac.ebaconline.art.br/graphql';

let token;

beforeEach(async () => {
    token = await spec()
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
});

describe('Contrato - Produto', () => {

    it('deve validar o contrato do addProduct', async () => {

        const response = await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    addProduct(
                        name: "Contrato Produto M24"
                        description: "Produto para teste de contrato"
                        price: 100
                        specialPrice: 90
                        quantity: 10
                        visible: true
                    ) {
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

        assert.ok(!response.body.errors, 'A mutation retornou errors');

        assert.ok(response.body.data, 'A resposta não possui data');

        assert.ok(
            response.body.data.addProduct,
            'addProduct não foi retornado'
        );

        const product = response.body.data.addProduct;

        assert.ok(Object.prototype.hasOwnProperty.call(product, 'name'));
        assert.ok(Object.prototype.hasOwnProperty.call(product, 'description'));
        assert.ok(Object.prototype.hasOwnProperty.call(product, 'price'));
        assert.ok(Object.prototype.hasOwnProperty.call(product, 'specialPrice'));
        assert.ok(Object.prototype.hasOwnProperty.call(product, 'quantity'));
        assert.ok(Object.prototype.hasOwnProperty.call(product, 'visible'));
    });

});