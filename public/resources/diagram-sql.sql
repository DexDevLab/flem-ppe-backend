CREATE TABLE [Ba_Acoes_Cr] (
  [id] String PRIMARY KEY,
  [codAcao] Int NOT NULL IDENTITY(1, 1),
  [nome] String NOT NULL,
  [descricao] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [evento_id] String,
  [tipoAcaoCr_Id] String,
  [evento] Ba_Eventos,
  [colabCr] Ba_Colaboradores_Cr NOT NULL,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [contatos] Ba_Contatos_Acoes_Cr NOT NULL,
  [tipoAcaoCr] Ba_Tipos_Acoes_Cr,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Beneficiarios] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [cpf] String,
  [matriculaFlem] Int,
  [matriculaSec] String UNIQUE NOT NULL,
  [rg] String,
  [dataNasc] DateTime,
  [ctps] String,
  [pis] String,
  [sexo] String,
  [deficiencia] String,
  [dataInicioAtividade] DateTime,
  [observacao] String,
  [logradouro] String,
  [numero] String,
  [complemento] String,
  [bairro] String,
  [municipio] String,
  [uf] String,
  [cep] String,
  [carteiraAssinada1Ano] Boolean DEFAULT (false),
  [ausenciaEstagio] Boolean DEFAULT (false),
  [escolaConclusao] String,
  [escolaMunicipio] String,
  [superiorConcluido] String,
  [superiorModalidade] String,
  [superiorPeriodo] Int,
  [cursoTipo] String,
  [superiorTipo] String,
  [superiorPretende] String,
  [superiorCursando] String,
  [superiorCursandoData] DateTime,
  [tecnicoMatriculadoOutro] String,
  [tecnicoCursandoOutro] String,
  [superiorCurso] String,
  [superiorInstituicao] String,
  [rendaPpeAjuda] String,
  [superiorAnoInicio] Int,
  [superiorAnoConclusao] Int,
  [anamnese] Boolean NOT NULL DEFAULT (false),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [acoes] Ba_Acoes_Cr NOT NULL,
  [contatosAcoes] Ba_Contatos_Acoes_Cr NOT NULL,
  [eventos] Ba_Eventos NOT NULL,
  [eventosListaPresenca] Ba_Eventos_Lista_Presenca NOT NULL,
  [materiais] Ba_Materiais NOT NULL,
  [monitoramentos] Ba_Monitoramentos NOT NULL,
  [comunicados] Ba_Comunicados NOT NULL,
  [enviosComunicados] Ba_Comunicados_Enviados NOT NULL,
  [oficios] Ba_Oficios NOT NULL,
  [enviosOficios] Ba_Oficios_Enviados NOT NULL,
  [documentos] Ba_Documentos NOT NULL,
  [contatos] Ba_Contatos_Beneficiarios NOT NULL,
  [vaga] Ba_Vaga NOT NULL,
  [historico] Ba_Historico NOT NULL,
  [pendencias] Ba_Pendencias NOT NULL,
  [etnia_Id] String,
  [tamanhoUniforme_Id] String,
  [formacao_Id] String,
  [etnia] Ba_Etnia,
  [formacao] Ba_Formacao,
  [tamanhoUniforme] Ba_TamanhoUniforme,
  [materiaisEntregues] Ba_Materiais_Entregues NOT NULL
)
GO

CREATE TABLE [Ba_Colaboradores_Cr] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [login_usuario] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [acoes] Ba_Acoes_Cr NOT NULL,
  [contatosAcoes] Ba_Contatos_Acoes_Cr NOT NULL
)
GO

CREATE TABLE [Ba_Comunicados] (
  [id] String PRIMARY KEY,
  [codComunicado] Int NOT NULL IDENTITY(1, 1),
  [assunto] String NOT NULL,
  [conteudoEmail] String NOT NULL,
  [anexosId] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [remetenteComunicado_Id] String,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [enviosComunicados] Ba_Comunicados_Enviados NOT NULL,
  [remetenteComunicado] Ba_Comunicados_Remetentes,
  [historico] Ba_Historico,
  [historico_Id] String,
  [evento] Ba_Eventos,
  [evento_Id] String
)
GO

CREATE TABLE [Ba_Comunicados_Enviados] (
  [id] String PRIMARY KEY,
  [enviado] Boolean NOT NULL DEFAULT (false),
  [conteudoEmail] String NOT NULL,
  [anexosId] String,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [comunicado_Id] String,
  [beneficiario_Id] String,
  [comunicado] Ba_Comunicados,
  [beneficiario] Ba_Beneficiarios,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Comunicados_Remetentes] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [email] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [comunicados] Ba_Comunicados NOT NULL,
  [oficios] Ba_Oficios NOT NULL
)
GO

CREATE TABLE [Ba_Contatos_Acoes_Cr] (
  [id] String PRIMARY KEY,
  [descricao] String NOT NULL,
  [concluido] Boolean NOT NULL DEFAULT (false),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [acaoCr_id] String,
  [beneficiario_id] String,
  [colabCr_id] String,
  [acao_Cr] Ba_Acoes_Cr,
  [beneficiario] Ba_Beneficiarios,
  [colabCr] Ba_Colaboradores_Cr,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Contatos_Beneficiarios] (
  [id] String PRIMARY KEY,
  [contato] String NOT NULL,
  [observacao] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [tipoContato_Id] String NOT NULL,
  [benefAssoc_Id] String NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipoContato] Ba_Contatos_Tipos NOT NULL,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Contatos_Pontos_Focais] (
  [id] String PRIMARY KEY,
  [contato] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [tipoContato_Id] String NOT NULL,
  [pontoFocal_Id] String,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipoContato] Ba_Contatos_Tipos NOT NULL,
  [pontoFocal] Ba_Unidade_Lotacao_Ponto_Focal
)
GO

CREATE TABLE [Ba_Contatos_Tipos] (
  [id] String PRIMARY KEY,
  [nome] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [contatosBeneficiarios] Ba_Contatos_Beneficiarios NOT NULL,
  [contatosPontosFocais] Ba_Contatos_Pontos_Focais NOT NULL
)
GO

CREATE TABLE [Ba_Demandantes] (
  [id] String PRIMARY KEY,
  [sigla] String NOT NULL,
  [nome] String UNIQUE NOT NULL,
  [vagas] Ba_Vaga NOT NULL,
  [monitores] Ba_Monitores NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Documentos] (
  [id] String PRIMARY KEY,
  [descricao] String,
  [sigiloso] Boolean NOT NULL DEFAULT (false),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [anexosId] String,
  [benefAssoc_Id] String NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Editor_Parametros] (
  [id] String PRIMARY KEY,
  [rotulo] String NOT NULL,
  [nomeColuna] String NOT NULL,
  [nomeTabela] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Eixo_Formacao] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [formacoes] Ba_Formacao NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Escritorio_Regional] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [cep] String NOT NULL,
  [logradouro] String NOT NULL,
  [complemento] String,
  [bairro] String NOT NULL,
  [cidade] String NOT NULL,
  [uf] String NOT NULL,
  [email] String,
  [num_contato] String,
  [monitores] Ba_Monitores NOT NULL,
  [municipios] Ba_Municipios NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Etnia] (
  [id] String PRIMARY KEY,
  [etnia] String NOT NULL,
  [beneficiarios] Ba_Beneficiarios NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false)
)
GO

CREATE TABLE [Ba_Eventos] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [data] DateTime NOT NULL,
  [modalidade] String NOT NULL,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [localEvento] Ba_Locais_Eventos,
  [local_EventoId] String,
  [tipoEvento] Ba_Tipos_Eventos,
  [tipo_eventoId] String,
  [acao_Cr] Ba_Acoes_Cr NOT NULL,
  [comunicado] Ba_Comunicados NOT NULL,
  [evento_lista_Presenca] Ba_Eventos_Lista_Presenca NOT NULL,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Eventos_Lista_Presenca] (
  [id] String PRIMARY KEY,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [eventoId] String,
  [evento] Ba_Eventos,
  [benefAssocId] String,
  [benefAssoc] Ba_Beneficiarios,
  [historico] Ba_Historico,
  [historicoId] String
)
GO

CREATE TABLE [Ba_Formacao] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [beneficiarios] Ba_Beneficiarios NOT NULL,
  [eixo] Ba_Eixo_Formacao,
  [eixo_FormacaoId] String
)
GO

CREATE TABLE [Ba_Historico] (
  [id] String PRIMARY KEY,
  [descricao] String NOT NULL,
  [sigiloso] Boolean NOT NULL DEFAULT (false),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipoHistorico_Id] String,
  [tipoHistorico] Ba_Historico_Tipo,
  [beneficiario] Ba_Beneficiarios NOT NULL,
  [oficio] Ba_Oficios NOT NULL,
  [oficiosEnviados] Ba_Oficios_Enviados NOT NULL,
  [eventos] Ba_Eventos NOT NULL,
  [eventosListaPresenca] Ba_Eventos_Lista_Presenca NOT NULL,
  [acoesCr] Ba_Acoes_Cr NOT NULL,
  [contatosAcoesCr] Ba_Contatos_Acoes_Cr NOT NULL,
  [comunicados] Ba_Comunicados NOT NULL,
  [comunicadosEnviados] Ba_Comunicados_Enviados NOT NULL,
  [contatosBeneficiarios] Ba_Contatos_Beneficiarios NOT NULL,
  [documentos] Ba_Documentos NOT NULL,
  [vaga] Ba_Vaga NOT NULL,
  [situacaoVaga] Ba_Situacoes_Vaga NOT NULL,
  [remessaSec] Ba_RemessaSec NOT NULL,
  [materialEntregue] Ba_Materiais_Entregues NOT NULL
)
GO

CREATE TABLE [Ba_Historico_Tipo] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [sigiloso] Boolean NOT NULL DEFAULT (false),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [historico] Ba_Historico NOT NULL
)
GO

CREATE TABLE [Ba_Locais_Eventos] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [cep] String NOT NULL,
  [logradouro] String NOT NULL,
  [complemento] String,
  [bairro] String NOT NULL,
  [cidade] String NOT NULL,
  [uf] String NOT NULL,
  [email] String,
  [num_contato] String,
  [eventos] Ba_Eventos NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Materiais] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [descricao] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [beneficiarios] Ba_Beneficiarios NOT NULL,
  [materiaisEntregues] Ba_Materiais_Entregues NOT NULL
)
GO

CREATE TABLE [Ba_Materiais_Entregues] (
  [id] String PRIMARY KEY,
  [dataEntrega] DateTime NOT NULL,
  [observacao] String,
  [quantidade] Int NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipo] Ba_Materiais,
  [tipoMaterial_Id] String,
  [beneficiario] Ba_Beneficiarios,
  [beneficiarios_Id] String,
  [tamanhoEntregue] Ba_TamanhoUniforme,
  [tamanhoUniforme_Id] String,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Monitoramentos] (
  [id] String PRIMARY KEY,
  [dataMonitoramento] DateTime NOT NULL,
  [presencaTecnico] Boolean NOT NULL DEFAULT (true),
  [tipoMonitoramento] String NOT NULL,
  [registrosVisitacao] String NOT NULL,
  [desvioFuncao] Boolean NOT NULL DEFAULT (false),
  [desvioFuncaoTipo] String,
  [desvioFuncaoDescricao] String,
  [gravidez] Boolean,
  [acidenteTrabalho] Boolean NOT NULL DEFAULT (false),
  [acidenteTrabalhoDescricao] String,
  [impressoesConhecimento] String NOT NULL,
  [impressoesHabilidade] String NOT NULL,
  [impressoesAutonomia] String NOT NULL,
  [impressoesPontualidade] String NOT NULL,
  [impressoesMotivacao] String NOT NULL,
  [impressoesExperienciaCompFormacao] String NOT NULL,
  [observacoesEquipePpe] String,
  [metaType] String NOT NULL,
  [autoAvaliacao_anexoId] String,
  [benefPontoFocal_anexoId] String,
  [ambienteTrabalho_anexoId] String,
  [beneficiario_Id] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [beneficiario] Ba_Beneficiarios NOT NULL,
  [monitoramentoComprovacao] Ba_Monitoramentos_Comprovacoes,
  [monitoramentoComprovacao_Id] String,
  [monitor] Ba_Monitores,
  [monitor_Id] String
)
GO

CREATE TABLE [Ba_Monitoramentos_Comprovacoes] (
  [id] String PRIMARY KEY,
  [monitoramento] Ba_Monitoramentos NOT NULL,
  [anexoId] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Monitores] (
  [id] String PRIMARY KEY,
  [matricula] Int UNIQUE NOT NULL,
  [nome] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [escritoriosRegionais] Ba_Escritorio_Regional NOT NULL,
  [demandantes] Ba_Demandantes NOT NULL,
  [monitoramentos] Ba_Monitoramentos NOT NULL
)
GO

CREATE TABLE [Ba_Municipios] (
  [id] String PRIMARY KEY,
  [idIBGE] Int UNIQUE NOT NULL,
  [nome] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [escritorioRegional] Ba_Escritorio_Regional,
  [escritorio_RegionalId] String,
  [territorioIdentidade] Ba_TerritoriosIdentidade,
  [territorioIdentidade_Id] String,
  [vagas] Ba_Vaga NOT NULL
)
GO

CREATE TABLE [Ba_Oficio_Template] (
  [id] String PRIMARY KEY,
  [titulo] String UNIQUE NOT NULL,
  [descricao] String,
  [conteudo] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipo] Ba_Oficio_Tipo,
  [oficio_TipoId] String,
  [oficios] Ba_Oficios NOT NULL
)
GO

CREATE TABLE [Ba_Oficio_Tipo] (
  [id] String PRIMARY KEY,
  [sigla] String UNIQUE NOT NULL,
  [descricao] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [oficios] Ba_Oficio_Template NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Oficios] (
  [id] String PRIMARY KEY,
  [codOficio] Int NOT NULL IDENTITY(1, 1),
  [assunto] String NOT NULL,
  [conteudoEmail] String NOT NULL,
  [anexosId] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [remetenteOficio_Id] String,
  [templateOficio_Id] String NOT NULL,
  [benefAssoc] Ba_Beneficiarios NOT NULL,
  [enviosOficios] Ba_Oficios_Enviados NOT NULL,
  [templateOficio] Ba_Oficio_Template NOT NULL,
  [remetenteOficio] Ba_Comunicados_Remetentes,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Oficios_Enviados] (
  [id] String PRIMARY KEY,
  [enviado] Boolean NOT NULL DEFAULT (false),
  [conteudoEmail] String NOT NULL,
  [conteudoOficio] String NOT NULL,
  [anexosId] String,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [oficio_Id] String,
  [beneficiario_Id] String,
  [oficio] Ba_Oficios,
  [beneficiario] Ba_Beneficiarios,
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Pendencias] (
  [id] String PRIMARY KEY,
  [pendente] Boolean NOT NULL DEFAULT (true),
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [beneficiarios] Ba_Beneficiarios NOT NULL,
  [tipoPendencia] Ba_Pendencias_Tipos,
  [tipoPendencia_Id] String
)
GO

CREATE TABLE [Ba_Pendencias_Tipos] (
  [id] String PRIMARY KEY,
  [label] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [pendencias] Ba_Pendencias NOT NULL
)
GO

CREATE TABLE [Ba_RemessaSec] (
  [id] String PRIMARY KEY,
  [remessa] Int NOT NULL,
  [data_remessa] DateTime NOT NULL,
  [arquivo_importacao] String NOT NULL,
  [vaga] Ba_Vaga NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [historico] Ba_Historico,
  [historico_Id] String
)
GO

CREATE TABLE [Ba_Situacoes_Vaga] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [tipoSituacao] Ba_Tipos_Situacoes_Vaga,
  [tipoSituacao_Id] String,
  [vagas] Ba_Vaga NOT NULL,
  [historicos] Ba_Historico NOT NULL
)
GO

CREATE TABLE [Ba_TamanhoUniforme] (
  [id] String PRIMARY KEY,
  [tamanho] String NOT NULL,
  [beneficiarios] Ba_Beneficiarios NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [materiaisEntregues] Ba_Materiais_Entregues NOT NULL
)
GO

CREATE TABLE [Ba_TerritoriosIdentidade] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [municipios] Ba_Municipios NOT NULL
)
GO

CREATE TABLE [Ba_Tipos_Acoes_Cr] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [acoes] Ba_Acoes_Cr NOT NULL
)
GO

CREATE TABLE [Ba_Tipos_Eventos] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [eventos] Ba_Eventos NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Tipos_Situacoes_Vaga] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [situacoesVaga] Ba_Situacoes_Vaga NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL
)
GO

CREATE TABLE [Ba_Unidade_Lotacao] (
  [id] String PRIMARY KEY,
  [nome] String UNIQUE NOT NULL,
  [cep] String NOT NULL,
  [logradouro] String NOT NULL,
  [complemento] String,
  [bairro] String NOT NULL,
  [municipio] String NOT NULL,
  [uf] String NOT NULL,
  [pontoFocal] Ba_Unidade_Lotacao_Ponto_Focal NOT NULL,
  [vaga] Ba_Vaga NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false)
)
GO

CREATE TABLE [Ba_Unidade_Lotacao_Ponto_Focal] (
  [id] String PRIMARY KEY,
  [nome] String NOT NULL,
  [contato] Ba_Contatos_Pontos_Focais NOT NULL,
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [unidadeLotacao_Id] String,
  [unidadeLotacao] Ba_Unidade_Lotacao
)
GO

CREATE TABLE [Ba_Vaga] (
  [id] String PRIMARY KEY,
  [dataConvocacao] DateTime NOT NULL,
  [publicadoDiarioOficial] Boolean NOT NULL DEFAULT (false),
  [observacao] String,
  [excluido] Boolean NOT NULL DEFAULT (false),
  [createdBy] String NOT NULL DEFAULT 'SISTEMA',
  [updatedBy] String NOT NULL DEFAULT 'SISTEMA',
  [createdAt] DateTime NOT NULL DEFAULT (now()),
  [updatedAt] DateTime NOT NULL,
  [situacaoVaga_Id] String,
  [remessaSec_Id] String,
  [unidadeLotacao_Id] String,
  [demandante_Id] String,
  [municipio] Ba_Municipios,
  [remessaSec] Ba_RemessaSec,
  [situacaoVaga] Ba_Situacoes_Vaga,
  [unidadeLotacao] Ba_Unidade_Lotacao,
  [beneficiario] Ba_Beneficiarios,
  [beneficiario_Id] String,
  [demandante] Ba_Demandantes,
  [historico] Ba_Historico,
  [historico_Id] String,
  [municipio_Id] String
)
GO

ALTER TABLE [Ba_Acoes_Cr] ADD FOREIGN KEY ([evento_id]) REFERENCES [Ba_Eventos] ([id])
GO

ALTER TABLE [Ba_Acoes_Cr] ADD FOREIGN KEY ([tipoAcaoCr_Id]) REFERENCES [Ba_Tipos_Acoes_Cr] ([id])
GO

ALTER TABLE [Ba_Acoes_Cr] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Beneficiarios] ADD FOREIGN KEY ([etnia_Id]) REFERENCES [Ba_Etnia] ([id])
GO

ALTER TABLE [Ba_Beneficiarios] ADD FOREIGN KEY ([formacao_Id]) REFERENCES [Ba_Formacao] ([id])
GO

ALTER TABLE [Ba_Beneficiarios] ADD FOREIGN KEY ([tamanhoUniforme_Id]) REFERENCES [Ba_TamanhoUniforme] ([id])
GO

ALTER TABLE [Ba_Comunicados] ADD FOREIGN KEY ([remetenteComunicado_Id]) REFERENCES [Ba_Comunicados_Remetentes] ([id])
GO

ALTER TABLE [Ba_Comunicados] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Comunicados] ADD FOREIGN KEY ([evento_Id]) REFERENCES [Ba_Eventos] ([id])
GO

ALTER TABLE [Ba_Comunicados_Enviados] ADD FOREIGN KEY ([comunicado_Id]) REFERENCES [Ba_Comunicados] ([id])
GO

ALTER TABLE [Ba_Comunicados_Enviados] ADD FOREIGN KEY ([beneficiario_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Comunicados_Enviados] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Contatos_Acoes_Cr] ADD FOREIGN KEY ([acaoCr_id]) REFERENCES [Ba_Acoes_Cr] ([id])
GO

ALTER TABLE [Ba_Contatos_Acoes_Cr] ADD FOREIGN KEY ([beneficiario_id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Contatos_Acoes_Cr] ADD FOREIGN KEY ([colabCr_id]) REFERENCES [Ba_Colaboradores_Cr] ([id])
GO

ALTER TABLE [Ba_Contatos_Acoes_Cr] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Contatos_Beneficiarios] ADD FOREIGN KEY ([tipoContato_Id]) REFERENCES [Ba_Contatos_Tipos] ([id])
GO

ALTER TABLE [Ba_Contatos_Beneficiarios] ADD FOREIGN KEY ([benefAssoc_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Contatos_Beneficiarios] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Contatos_Pontos_Focais] ADD FOREIGN KEY ([tipoContato_Id]) REFERENCES [Ba_Contatos_Tipos] ([id])
GO

ALTER TABLE [Ba_Contatos_Pontos_Focais] ADD FOREIGN KEY ([pontoFocal_Id]) REFERENCES [Ba_Unidade_Lotacao_Ponto_Focal] ([id])
GO

ALTER TABLE [Ba_Documentos] ADD FOREIGN KEY ([benefAssoc_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Documentos] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Eventos] ADD FOREIGN KEY ([local_EventoId]) REFERENCES [Ba_Locais_Eventos] ([id])
GO

ALTER TABLE [Ba_Eventos] ADD FOREIGN KEY ([tipo_eventoId]) REFERENCES [Ba_Tipos_Eventos] ([id])
GO

ALTER TABLE [Ba_Eventos] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Eventos_Lista_Presenca] ADD FOREIGN KEY ([eventoId]) REFERENCES [Ba_Eventos] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Eventos_Lista_Presenca] ADD FOREIGN KEY ([benefAssocId]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Eventos_Lista_Presenca] ADD FOREIGN KEY ([historicoId]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Formacao] ADD FOREIGN KEY ([eixo_FormacaoId]) REFERENCES [Ba_Eixo_Formacao] ([id])
GO

ALTER TABLE [Ba_Historico] ADD FOREIGN KEY ([tipoHistorico_Id]) REFERENCES [Ba_Historico_Tipo] ([id])
GO

ALTER TABLE [Ba_Materiais_Entregues] ADD FOREIGN KEY ([tipoMaterial_Id]) REFERENCES [Ba_Materiais] ([id])
GO

ALTER TABLE [Ba_Materiais_Entregues] ADD FOREIGN KEY ([beneficiarios_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Materiais_Entregues] ADD FOREIGN KEY ([tamanhoUniforme_Id]) REFERENCES [Ba_TamanhoUniforme] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Materiais_Entregues] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Monitoramentos] ADD FOREIGN KEY ([beneficiario_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Monitoramentos] ADD FOREIGN KEY ([monitoramentoComprovacao_Id]) REFERENCES [Ba_Monitoramentos_Comprovacoes] ([id])
GO

ALTER TABLE [Ba_Monitoramentos] ADD FOREIGN KEY ([monitor_Id]) REFERENCES [Ba_Monitores] ([id])
GO

ALTER TABLE [Ba_Municipios] ADD FOREIGN KEY ([escritorio_RegionalId]) REFERENCES [Ba_Escritorio_Regional] ([id])
GO

ALTER TABLE [Ba_Municipios] ADD FOREIGN KEY ([territorioIdentidade_Id]) REFERENCES [Ba_TerritoriosIdentidade] ([id])
GO

ALTER TABLE [Ba_Oficio_Template] ADD FOREIGN KEY ([oficio_TipoId]) REFERENCES [Ba_Oficio_Tipo] ([id])
GO

ALTER TABLE [Ba_Oficios] ADD FOREIGN KEY ([templateOficio_Id]) REFERENCES [Ba_Oficio_Template] ([id])
GO

ALTER TABLE [Ba_Oficios] ADD FOREIGN KEY ([remetenteOficio_Id]) REFERENCES [Ba_Comunicados_Remetentes] ([id])
GO

ALTER TABLE [Ba_Oficios] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Oficios_Enviados] ADD FOREIGN KEY ([oficio_Id]) REFERENCES [Ba_Oficios] ([id])
GO

ALTER TABLE [Ba_Oficios_Enviados] ADD FOREIGN KEY ([beneficiario_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Oficios_Enviados] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO

ALTER TABLE [Ba_Pendencias] ADD FOREIGN KEY ([tipoPendencia_Id]) REFERENCES [Ba_Pendencias_Tipos] ([id])
GO

ALTER TABLE [Ba_RemessaSec] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id])
GO

ALTER TABLE [Ba_Situacoes_Vaga] ADD FOREIGN KEY ([tipoSituacao_Id]) REFERENCES [Ba_Tipos_Situacoes_Vaga] ([id])
GO

ALTER TABLE [Ba_Unidade_Lotacao_Ponto_Focal] ADD FOREIGN KEY ([unidadeLotacao_Id]) REFERENCES [Ba_Unidade_Lotacao] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([municipio_Id]) REFERENCES [Ba_Municipios] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([remessaSec_Id]) REFERENCES [Ba_RemessaSec] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([situacaoVaga_Id]) REFERENCES [Ba_Situacoes_Vaga] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([unidadeLotacao_Id]) REFERENCES [Ba_Unidade_Lotacao] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([beneficiario_Id]) REFERENCES [Ba_Beneficiarios] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([demandante_Id]) REFERENCES [Ba_Demandantes] ([id])
GO

ALTER TABLE [Ba_Vaga] ADD FOREIGN KEY ([historico_Id]) REFERENCES [Ba_Historico] ([id]) ON DELETE NO ACTION
GO
