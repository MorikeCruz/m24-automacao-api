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

describe('Serviço de Categorias', () => {

    it('deve adicionar uma categoria', async () => {

        const response = await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    addCategory(
                        name: "Categoria M24 Teste"
                        photo: "https://example.com/categoria.jpg"
                    ) {
                        name
                        photo
                    }
                }
            `)
            .expectStatus(200)
            .toss();

        assert.ok(!response.body.errors, 'A mutation retornou errors');

        assert.ok(response.body.data);
        assert.ok(response.body.data.addCategory);

        assert.ok(
            Object.prototype.hasOwnProperty.call(
                response.body.data.addCategory,
                'name'
            )
        );

        assert.ok(
            Object.prototype.hasOwnProperty.call(
                response.body.data.addCategory,
                'photo'
            )
        );
    });

});