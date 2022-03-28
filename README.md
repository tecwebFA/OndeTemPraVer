
# OndeTemPraVer

**Filipe Avelar**

O objetivo é a criação de um aplicativo para localização em quais serviços de streaming
estão disponíveis séries ou filmes para a região do usuário, e demais funcionalidades como
catálogo e avaliação.
A aplicação utiliza a api do OMDB para obter informações dos filmes e séries, e utiliza o google firebase para registro de usuários, envio do email de confirmação ou para resetar senha, autenticação e para armazenar as informações do usuário.

## 1. Interfaces

### Tela de login

Nesta tela, o usuário tem a possibilidade de fazer login ou se cadastrar.

### Tela home

Nesta tela, o usuário pode buscar por filmes ou séries, e acessar no canto superior o menu de usuário.
Poderá também acessar lista de coleções com filmes/séries salvos. (LISTA AINDA NÃO IMPLEMENTADA).

Ao buscar por um título ou parte do título existente, é carregado cards com capas do filmes/séries, nome, data e um ícone para mais informações.

### Tela de informações do filme

Ao clicar no ícone de informações, é aberto um popup com mais informações sobre o filme/série selecionado.


## 2. Dados do usuário

Nesta aplicação, os dados do usuário que são armazenados são email, nome e senha. 

## 3. Checklist de implementação

- A aplicação é original e não uma cópia da aplicação de um colega ou de uma aplicação já existente? **Sim**
- A aplicação tem pelo menos duas interfaces (telas ou páginas) independentes? **Sim**
- A aplicação armazena e usa de forma relevante dados complexos do usuário? **Sim**
- A aplicação possui um manifesto para instalação no dispositivo do usuário? **Sim**
- A aplicação possui um _service worker_ que permite o funcionamento off-line? **Sim**
- O código da minha aplicação possui comentários explicando cada operação? **Não, foi utilizado variáveis e métodos com nomes objetivos e bem definidos, no padrão do Clean Code**
- A aplicação está funcionando corretamente? **Sim**
- A aplicação está completa?**Não, ainda faltam lista de coleções dos favoritos e os sites disponíveis para streaming do filme/série**

