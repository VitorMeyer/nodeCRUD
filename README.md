# Criação de um CRUD básico com Node.js e React-Admin

## Introdução

Nesse projeto, mostraremos como criar um CRUD (Create, Read, Update, Delete) básico utilizando Node.js para o backend e React-Admin para o frontend. Para isso, precisaremos instalar algumas bibliotecas, como Express e React-Admin. Utilizaremos o Prisma como nosso ORM e o MySQL como banco de dados.

Primeiramente, iniciamos um projeto Node.js e instalamos as dependências necessárias. Vamos criar um servidor onde o arquivo app.ts será responsável por iniciar o nosso servidor e o arquivo index das rotas será responsável por gerir as rotas da aplicação. Em seguida, definimos o modelo do nosso banco de dados no arquivo `schema.prisma` gerado pelo Prisma.

veja como ficou o arquivo de configuração do banco de dados:

```tsx

generator client {
  provider = "prisma-client-js"
  engineType = "library"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model user {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  phone     String?
  createdAt DateTime @default(now()) 
  updatedAt DateTime @updatedAt       
}

```

Um modelo de usuário bem simples para essa demonstração.

## O que é CRUD?

CRUD é um acrônimo para as operações básicas que uma aplicação realiza num banco de dados: Create (criação), Read (leitura), Update (atualização) e Delete (exclusão) de registros.

## Funções CRUD

### **Create**:

 A função Create é responsável por criar novos registros no banco de dados. Através de uma rota `POST`, recebemos os dados do usuário e os utilizamos para criar um novo registro no banco de dados. Veja aqui como tratarei essa operação no código:

```tsx
// Dentro da rotas de usuários temos:
router.post('/',async (req, res) => { // function do post

    try {
        const newUser = await userControllerInstance.userCreateController(req, res)
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({erro: error.message})
    }
   
    
});

//Dentro do controlador de usuários temos:
async userCreateController(req:Request,res:Response){

        try {
            const userName = req.body.name
            const userEmail = req.body.email
            const userPhone = req.body.phone

            const newUser = await userServiceInstance.userCreateService( userName, userEmail, userPhone)
            return newUser
        } catch (error) {
            
            throw new Error('Erro ao cadastrar ' + error);
            
        }
    }
// Dentro do serviço de usuários temos
async userCreateService(name: string, email: string, phone:string) {
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    phone:phone
                },
            });
            
            
            return newUser;
        } catch (error) {
            throw new Error('Erro ao cadastrar usuário: ' + error);
        }
    }
```

Uma estrutura bem simples baseada no MVC, Iremos utilizar ela em todas as etapas desse projeto. 

### **Read**:

A função Read é utilizada para ler os registros existentes no banco de dados. Temos duas rotas para isso: uma rota `GET` para listar todos os usuários e uma rota `GET` com um parâmetro de ID para buscar um usuário específico.

```tsx
// Dentro da rotas de usuários temos:
router.get('/', async (req, res) => {

    try {
        const userList = await userControllerInstance.userListController(req,res)
        res.status(200).json(userList)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id', async (req, res) => {

    try {
        const userList = await userControllerInstance.userGetController(req,res)
        res.status(200).json(userList)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Dentro do controlador de usuários temos:
  async userListController(req:Request, res:Response){
        const DEFAULT_LIMIT = 0
        const page = typeof req.query._page === 'string' ? parseInt(req.query._page) : 0;
        const take = typeof req.query._limit === 'string' ? parseInt(req.query._limit) : DEFAULT_LIMIT;
        const skip = (page-1)*take
        console.log(skip);
        
        try {
            const response = await userServiceInstance.userListService(skip,take)
            return response
        } catch (error) {
            throw new Error('Erro ao listar todos ' + error);

        }
    }
    async userGetController(req:Request,res:Response){

        try {
            const id = parseInt(req.params.id); 
            
            const getUser = await userServiceInstance.userGetService(id)
            return getUser
        } catch (error) {
            
            throw new Error('Erro ao buscar ' + error);
            
        }
    }

// Dentro do serviço de usuários temos

 async userListService(skip:number, take:number) {
        
        
        try {
            const[users,totalCount]= await this.prisma.$transaction([
                this.prisma.user.findMany({
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }, skip, take
                }),
                this.prisma.user.count()
                

            ])
            console.log(users);
            
            return { data: users, totalCount };
        } catch (error) {
            throw new Error('Erro ao listar usuários: ' + error);
        }
    }
    async userGetService(id: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar usuário: ' + error);
        }
    }
```

Na rota onde buscamos uma lista de usuários utilizamos conceitos de paginação e limite de itens, tornando a busca mais eficiente.

### **Update**:

A função Update é utilizada para atualizar registros existentes no banco de dados. Utilizamos uma rota `PUT` com um parâmetro de ID. Os novos dados são recebidos através do corpo da requisição e são usados para atualizar o registro correspondente no banco de dados.

```tsx
// Dentro da rotas de usuários temos:
router.put('/:id',async (req, res) => { // function do put
    
    try {
        const userUpdate = await userControllerInstance.userUpdateController(req,res)
        res.status(200).json(userUpdate)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
  
    
});

//Dentro do controlador de usuários temos:
    async userUpdateController(req:Request,res:Response){

        try {
            const id = parseInt(req.params.id)
            const userName = req.body.name
            const userEmail = req.body.email
            const userPhone = req.body.phone

            const newUser = await userServiceInstance.userUpdateService(id, userName, userEmail, userPhone)
            return newUser
        } catch (error) {
            
            throw new Error('Erro ao atualizar ' + error);
            
        }
    }
    
    // Dentro do serviço de usuários temos
    
        async userUpdateService(userId: number, name: string, email: string, phone: string) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: userId }, // Especifique o ID do usuário que você deseja atualizar
                data: {
                    name: name,
                    email: email,
                    phone: phone
                },
            });
    
            return updatedUser;
        } catch (error) {
            throw new Error('Erro ao atualizar usuário: ' + error);
        }
    }
```

### delete:

A função Delete é utilizada para deletar registros existentes no banco de dados. Utilizamos uma rota `DELETE` com um parâmetro de ID. A função busca o registro correspondente no banco de dados e o remove.

```tsx
// Dentro da rotas de usuários temos:
router.delete('/:id',async (req, res) => {  // function do delete
   try {
        const userDelete = await userControllerInstance.userDeleteController(req,res)
        res.status(200).json(userDelete)
   } catch (error) {
    res.status(500).json({ error: error.message });
    
   }

});

//Dentro do controlador de usuários temos:
async userDeleteController(req:Request, res:Response){

        try {
            const id = parseInt(req.params.id)
            const userDelete = await userServiceInstance.userDeleteService(id)
            return userDelete
        } catch (error) {
            throw new Error('Erro ao deletar ' + error);
            
        }
    }
// Dentro do serviço de usuários temos
    async userDeleteService(userId: number) {
        try {
            const deletedUser = await this.prisma.user.delete({
                where: { id: userId }
            });
            
            return deletedUser;
        } catch (error) {
            throw new Error('Erro ao deletar usuário: ' + error);
        }
    }
```

### Conclusão

Esse é um exemplo simples de como um CRUD pode ser feito. O que podemos fazer para essa estrutura ser mais fiel a realidade é adicionar middleware de autenticação e de proteção para as rotas. O que faria também é criar um serviço para verificar a existência do usuário antes de realizar operações CREATE, UPDATE, DELETE. Outro ponto seria fazer uma atualização do modelo do usuário para conter senha e criptografar essa senha.
