<h1 align="center">Portal PPE - Backend</h1>
<p align=center><i align="center">Aplicação Backend para o Projeto Primeiro Emprego, da FLEM</i></p>

<br>

<div align="center">

<a href="https://www.javascript.com"><img src="https://img.shields.io/badge/JavaScript-%23323330.svg?logo=javascript&logoColor=%23F7DF1E" height="22" alt="JavaScript"/></a>
<a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white" height="22" alt="NodeJS"/></a>
<a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next-black?logo=next.js&logoColor=white" height="22" alt="NextJS"/></a>
<a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white" height="22" alt="PrismaIO"/></a>
<a href="https://www.microsoft.com/pt-br/sql-server/sql-server-2019"><img src="https://img.shields.io/badge/Microsoft%20SQL%20Sever-CC2927?logo=microsoft%20sql%20server&logoColor=white" height="22" alt="MSSQLServer"/></a>

<a href=""><img src="https://img.shields.io/badge/maintenance-actively--developed-brightgreen.svg" height="22" alt="Maintenance-actively-developed"/></a>
<a href=""><img src="https://img.shields.io/github/last-commit/frtechdev/flem-ppe-backend" height="22" alt="LastCommit"></a>
<a href=""><img src="https://snyk.io/test/github/frtechdev/flem-ppe-backend/badge.svg" height="22" alt="Snyk"/></a>

<a href=""><img src="https://img.shields.io/github/repo-size/frtechdev/flem-ppe-backend" height="22" alt="RepoSize"/></a>
<a href=""><img src="https://img.shields.io/github/languages/code-size/frtechdev/flem-ppe-backend" height="22" alt="CodeSize"/></a>
<a href=""><img src="https://img.shields.io/github/contributors/frtechdev/flem-ppe-backend" height="22" alt="Contributors"></a>

<a href=""><img src="https://img.shields.io/github/forks/frtechdev/flem-ppe-backend" height="22" alt="Fork"></a>
<a href=""><img src="https://img.shields.io/github/release/DexDevLab/flem-ppe-backend.svg" height="22" alt="LatestRelease"></a>
<a href="https://github.com/frtechdev/flem-ppe-backend/blob/main/LICENSE"><img src="https://img.shields.io/github/license/frtechdev/flem-ppe-backend" height="22" alt="License"></a>

|| [Conteúdo](#section-conteudo) || [Características](#section-caracteristicas) || [Stack](#section-stack) || [Documentação](#section-documentacao) || [Instruções](#section-instrucoes) ||

|| [Variáveis de Ambiente](#section-vars) || [Notas de versão](#section-changelog) || [Autores](#section-autores) || [Contato](#section-contato) || [Licença](#section-licenca) ||

</div>

<hr>

<a name="section-conteudo">

## Conteúdo

</a>

<br>

Essa aplicação tem como função servir de Backend para o Portal Projeto Primeiro Emprego, um novo conceito de sistema que integra funcionalidades, hoje separadas, de um dos serviços essenciais do cliente (FLEM).
Tem os seguintes objetivos:

- Apresentar uma nova solução informatizada que facilite, dinamize e aumente a produtividade dos sistemas computacionais que giram em torno do PPE
- Fornecer de maneira segura, confiável e precisa, dados relacionados ao PPE, seguindo os Princípios Básicos de Desenvolvimento, para garantir a sustentabilidade, manutenibilidade e confiabilidade do Software, melhorando sua performance no geral
- Promover documentação clara e densa o suficiente para discriminar processos e permitir que o Software seja facilmente mantido por qualquer profissional da área de Desenvolvimento

<hr>

<a name="section-caracteristicas">

## Características

</a>

<br>

- Desenhado para assumir a responsabilidade das múltiplas conexões com consulta a APIs não-FLEM e manter um circuito de distribuição de informações onde o Backend seja a fonte principal dos dados
- Fácil modularização, atualização e adequação com diferentes sistemas de bancos de dados e inclusão de funcionalidades

<hr>

<a name="section-stack">

## Stack

</a>

<br>

- **Linguagem Principal:** [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Framework Principal:** [Node.js](https://nodejs.org/en/docs/)
- **Framework estrutural:** [Next.js](https://nextjs.org/docs/getting-started)
- **Biblioteca de Conexão ODBC / ORM:** [Prisma.io](https://www.prisma.io)
- **Banco de Dados:** [SQL](https://pt.wikipedia.org/wiki/SQL)
- **Gerenciador de Dependências:** [Yarn](https://yarnpkg.com/getting-started)
- **Bibliotecas:** Para uma lista completa de bibliotecas e dependências nos mais variados escopos, conferir o arquivo [package.json](https://github.com/frtechdev/flem-ppe-backend/blob/main/package.json).

<hr>

<a name="section-documentacao">

## Documentação

</a>

<br>

- [Manual de Especificações de UML](https://frtechdev.github.io/flem-ppe-backend/resources/portalppe_manual_de_especificacoes_de_uml.pdf)

- [Diagrama de Modelo de Banco de Dados em PDF](https://frtechdev.github.io/flem-ppe-backend/resources/diagram-pdf.pdf)

- [Diagrama de Modelo de Banco de Dados em SQL](https://frtechdev.github.io/flem-ppe-backend/resources/diagram-sql.sql)

Documentação adicional pode ser encontrada [aqui](https://frtechdev.github.io/flem-ppe-backend/).

<hr>

<a name="section-instrucoes">

## Instruções

</a>

<br>

### Utilizando o repositório como projeto

</a>

1 - Faça um git clone ou o download do repositório, da forma que preferir

```bash

git clone https://github.com/frtechdev/flem-ppe-backend.git

```

2 - Instale um gerenciador de pacotes (preferencialmente yarn) utilizando um terminal no diretório raiz do repositório clonado

`yarn` ou `npm install`

3 - Execute a aplicação no terminal

`yarn dev` ou `npm run dev`

### Implantando o projeto

</a>

#### Por um repositório clonado

**Lembre-se de executar `yarn build` ANTES de criar seu container com base no repositório local.**

Para criar a imagem, utilize o `docker build` referenciando o arquivo local do [Dockerfile](https://github.com/frtechdev/flem-ppe-backend/blob/main/Dockerfile):

```bash
docker build - < Dockerfile
```

#### Diretamente do repositório remoto

Você pode utilizar o `docker build` referenciando diretamente o repositório:

```bash
docker build https://github.com/frtechdev/flem-ppe-backend.git#main
```

Alternativamente, pode usar o comando detalhado para alterar diretamente configurações como porta e nome do repositório:

```bash
docker run -p X:3000 -e github='https://github.com/frtechdev/flem-ppe-backend.git' -it frtechdev/flem-ppe-backend
```

Onde "X" é uma porta externa de sua escolha. Por padrão, a porta interna é 3000.
Para alterar a porta interna, altere a linha `ENV PORT` do [Dockerfile](https://github.com/frtechdev/flem-ppe-backend/blob/main/Dockerfile).

Para mais informações, visite a [Documentação do Docker](https://docs.docker.com).

</a>

<hr>

<a name="section-vars">

### Variáveis de Ambiente

</a>

<br>

#### Variáveis Principais

| Variável      | Uso   |
|---------------|-------|
|`DATABASE_URL` | Define o endereço do Servidor de BD e as demais informações do mesmo. Aceita uma string no formato `sqlserver://<ENDEREÇO DO SERVIDOR>:<PORTA>;database=<NOME DO BANCO DE DADOS>;user=<USUÁRIO>;password=<SENHA>`. | |
|`QUERY_BATCH_SIZE` | Define o tamanho total de uma query SQL com o banco de dados. O valor padrão é 2000. | |

#### APIs Externas

| Variável      | Uso   |
|---------------|-------|
|`NEXT_PUBLIC_API_MUNIC` | Conexão com a API do IBGE para receber dados da listagem de municípios do país. Por exemplo: '<https://servicodados.ibge.gov.br/api/v1/localidades/estados>'  | |
|`NEXT_PUBLIC_API_MUNIC_FALLBACK` | Conexão com a API do IBGE para receber dados da listagem de municípios do país, como fallback para a API anterior. Por exemplo: '<https://brasilapi.com.br/api/ibge/municipios/v1>'  | |
|`NEXT_PUBLIC_API_CEP` | Conexão com API para validar e prover CEPs válidos. Por exemplo: '<https://brasilapi.com.br/api/cep/v2>'  | |

#### APIs Externas Específicas para dados da Bahia

| Variável      | Uso   |
|---------------|-------|
|`NEXT_PUBLIC_API_DEMAND_BA` | Conexão com API governamental para prover lista de demandantes de acordo com a Secretaria do Estado da Bahia. Por exemplo: '<http://servicos.ba.gov.br/api/secretarias>'  | |
|`NEXT_PUBLIC_API_TERRITORIOS_BA` | Conexão com API governamental para prover lista de Territórios de Identidade de acordo com a Secretaria do Estado da Bahia. Por exemplo: '<https://maps.sihs.ba.gov.br/server/rest/services/DVPA_BAHIA/Territorios_Identidade_BA/MapServer/0?f=pjson>'  | |
|`NEXT_PUBLIC_API_TERRITORIOS_BA` | Conexão com API governamental para prover lista de Territórios de Identidade de acordo com a Secretaria do Estado da Bahia. Por exemplo: '<https://maps.sihs.ba.gov.br/server/rest/services/DVPA_BAHIA/Territorios_Identidade_BA/MapServer/0?f=pjson>'  | |

#### Outras APIs Externas

| Variável      | Uso   |
|---------------|-------|
|`NEXT_PUBLIC_API_GOOGLE_MAPS_KEY` | Chave API do Google Maps para prover conexão com a API e calcular distância entre o município de residência do beneficiário e o município da vaga.  | |

#### APIs Internas

| Variável      | Uso   |
|---------------|-------|
|`NEXT_PUBLIC_API_PPE_BD_LEGADO` | URL da API de conexão com o BD legado, para obter dados de colaboradores, monitores e beneficiários contidos na aplicação legado do Portal PPE. | |
|`NEXT_PUBLIC_API_BD_DOMINIO` | URL da API de conexão com o BD da DominioRH, aplicação da Domínio Sistemas atualmente responsável por prover dados de funcionários e colaboradores FLEM, além de dados cadastrais dos beneficiários da aplicação legado do Portal PPE. | |
|`NEXT_PUBLIC_API_FILE_UPLOAD` | URL da API de armazenamento de arquivos. | |
|`NEXT_PUBLIC_APP_SOURCE` | Nome da aplicação. Necessário para indexar os arquivos na API de Upload de Arquivo (padrão: "Portal_PPE") | |
|`NEXT_PUBLIC_PPE_FRONTEND` | URL da Aplicação Frontend | |

<hr>

<a name="section-changelog">

## Notas de versão

</a>

<br>

### v1.0.0-230623

- Features
  - Criação de um script de Github Actions para Tag e Release automáticos das versões no branch `main`
  - Adição de um script de Github Actions para deploy automático de imagem Docker
  - Adição de script de limpeza de index de cache do Git
  - Adição do arquivo `.yarnclean` para sanitização de módulos
  - Documentação de todos os componentes, módulos, arquivos e componentes do projeto
  - Criação de Handler para tratamento de Exceções e resposta para o usuário
  - Inclusão dos assets do Prisma para manutenção e implementação do BD (migração do branch frontend)

- Alterações
  - Remoção do CHANGELOG.MD
  - Atualização da documentação
  - Remoção de assets frontend do projeto padrão do Next.js
  - Remoção dos testes de API de email

- Outros
  - Sanitização de dependências
  - Remoção do Yarn.lock do GITIGNORE

### v0.0.4-220721dx

- Alteração da localização da documentação feita pelo jsdoc
- Atualização da documentação
- Alteração dos parâmetros de redirecionamento da página principal da API para redirecionar para a documentação
- Documentação dos métodos e demais componentes
- Definição da Homepage da API
- Remoção da especificação de porta via .env (utilizando sintaxe direta dos scripts de execução do Node)
- Atualização do README
- Criação de controller para consulta via API externa
- Remoção de "eixo de formação" como parâmetro de manipulação da importação de beneficiários da planilha
- Melhoria no processamento das rotas, com tratamento de exceções
- Adição de rota central na página da API para transferência da documentação
- Testes iniciais com nodemailer e configuração dos serviços de envio de email
- Reorganização dos utilitários e ferramentas de serviço
- Criação da instância do Prisma Client

### v0.0.3-220701

- v0.0.2-220701dx

### v0.0.2-220701dx

- Criação dos arquivos principais do projeto
- Criação e definição das variáveis de ambiente
- Criação de linting do ES para Next
- Criação do gitattributes
- Criação do gitignore
- Adição de regras de linting para markdown
- Criação do changelog
- Criação do arquivo de Schema do ORM
- Atualização do README
- Criação da rota de recebimento dos dados da planilha de importação
- Criação do algoritmo de validação perante BD/APIs
- Criação da rota de validação dos dados da planilha de importação
- Criação da rota com API externa para solicitar listagem de Demandantes BA e Municípios BA
- Criação de utilitários para formatação de CPF, Data e Nomes Próprios (capitalização)

### initial commit

- Initial commit

<hr>

<a name="section-autores">

## Autores

</a>

<br>

<a href="https://github.com/frtechdev/flem-ppe-backend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=frtechdev/flem-ppe-backend" />
</a>

<hr>

<a name="section-contato">

## Contato

</a>

<br>

Se você gostou deste projeto, dê uma <a href="https://github.com/frtechdev/flem-ppe-backend" data-icon="octicon-star" aria-label="Star frtechdev/flem-ppe-backend on GitHub">estrela</a>. <br>
Para contato, envie um email a: <a href="mailto:dex.houshi@hotmail.com">dex.houshi@hotmail.com</a>

<hr>

<a name="section-licenca">

## Licença

</a>

Licenciado sob a [MIT License](https://github.com/frtechdev/flem-ppe-backend/blob/main/LICENSE).
