# devcoins

O devcoins é uma aplicação FICTÍCIA de analise/compra das 10 maiores cryptomoedas atualmente. 

## Pequena demonstração
![Demonstração](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHhmaDVjNzA4bmdxZWIweWR6dm5mdHdnMXFjdWRxM2J2cmdoNjN1OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ttE5HqK7LDj6Pklyjz/giphy.gif)

Para uma demonstração completa, a aplicação está online para testes [clique aqui](https://devcoins-prod.vercel.app/sign-in).

## Funcionalidades

- Criação/Atualização de usuário
- Perfil do usuário (Informações/Saldo)
- Login (username/senha ou OAuth Google/GitHub/LinkedIn)
- Modo admin (acesso ao painel admin)
- Gráfico de analise para todas as cryptomoedas (dia/semanal)
- Conversão de valores (converte o valor real da moeda atualmente)
- Pesquisar
- Informações sobre a cryptomoeda
- Compra de cryptomoeda
- Forma de pagamento (Pix funcional)
- Versões para Desktop/Mobile

## Tecnologias(libs) usadas ⚡️

- React: Biblioteca JavaScript para construção de interfaces de usuário.
- Next.js: Framework React para renderização no lado do servidor e rotas.
- Prisma: ORM (Object-Relational Mapper) para o banco de dados, usado para migrações, - consultas e geração de clientes.
- Axios: Biblioteca para fazer requisições HTTP.
- Bcrypt: Utilizado para hashing de senhas.
- Cloudinary: Serviço para upload e manipulação de imagens.
- JWT (jsonwebtoken): Biblioteca para criação e verificação de JSON Web Tokens.
- Lucide-React: Ícones SVG para React.
- Tailwind CSS: Framework utilitário para estilização com CSS.
- Tailwind Merge: Ferramenta para mesclar classes do Tailwind CSS.
- Tailwind CSS Animate: Animações baseadas em classes para Tailwind CSS.
- Radix UI (Avatar, Dialog, Select, Slot, Switch): Componentes acessíveis e descomplicados - para construção de UI.
- TanStack React Query: Gerenciamento de estado e sincronização de dados do servidor.
- TanStack React Table: Biblioteca para criação de tabelas em React.
- Embla Carousel React: Biblioteca para criação de carrosséis.
- QRCode.react: Biblioteca para gerar códigos QR em React.
- Recharts: Biblioteca para criar gráficos e visualizações de dados com base em React.
- Sonner: Biblioteca para criação de notificações.
- UUID: Geração de identificadores únicos.
- Zod: Biblioteca para validação de esquemas e parsing de dados.

## Observações

Eu estou utilizando a API pública do [CryptoCompare](https://www.cryptocompare.com/) para obter os dados sobre as cryptomoedas.

## Instalação 💡

Crie uma pasta para clonar o projeto e siga os seguintes passos.

Dentro da pasta que você criou, você vai abrir o seu prompt de comando e escolher qual método de clonagem que você irá utilizar:

```
// Método HTTPS

$ git clone https://github.com/julioishikawa/devcoins.git
$ npm install
$ npm run dev

ou

// Método SSH

$ git clone git@github.com:julioishikawa/devcoins.git
$ npm install
$ npm run dev
```

Feito por [Julio Ishikawa](https://www.linkedin.com/in/julio-ishikawa) 👋.
