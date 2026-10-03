const { spec } = require('pactum');

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
        await spec()
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
            .expectStatus(200);
    });

    it('deve editar uma categoria', async () => {
        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    editCategory(
                        id: "1"
                        name: "Categoria M24 Editada"
                        photo: "https://example.com/categoria-editada.jpg"
                    ) {
                        name
                        photo
                    }
                }
            `)
            .expectStatus(200);
    });

    it('deve excluir uma categoria', async () => {
        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    deleteCategory(id: "1") {
                        name
                        photo
                    }
                }
            `)
            .expectStatus(200);
    });

});