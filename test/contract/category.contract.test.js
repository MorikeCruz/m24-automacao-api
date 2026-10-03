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

describe('Contrato - Categoria', () => {

    it('deve validar o contrato do addCategory', async () => {

        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(
                'mutation {' +
                ' addCategory(' +
                ' name: "Contrato Categoria M24"' +
                ' photo: "https://example.com/contrato.jpg"' +
                ' ) {' +
                ' name' +
                ' photo' +
                ' }' +
                '}'
            )
            .expectStatus(200)
            .expectJsonMatch({
                data: {
                    addCategory: {
                        name: null,
                        photo: null
                    }
                }
            });
    });

});