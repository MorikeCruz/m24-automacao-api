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

describe('Serviço de Produtos', () => {

    it('deve adicionar um produto', async () => {
        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    addProduct(
                        name: "Produto M24 Teste"
                        description: "Produto criado para testes"
                        price: 100
                        specialPrice: 90
                        photos: ["https://example.com/produto.jpg"]
                        popular: false
                        quantity: 10
                        visible: true
                        location: "Loja"
                        additionalDetails: ["Teste M24"]
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
            .expectStatus(200);
    });

    it('deve editar um produto', async () => {
        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    editProduct(
                        id: "1"
                        name: "Produto M24 Editado"
                        description: "Produto editado para testes"
                        price: 120
                        specialPrice: 110
                        quantity: 20
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
            .expectStatus(200);
    });

    it('deve excluir um produto', async () => {
        await spec()
            .post(URL)
            .withHeaders('Authorization', token)
            .withGraphQLQuery(`
                mutation {
                    deleteProduct(id: "1") {
                        name
                    }
                }
            `)
            .expectStatus(200);
    });

});