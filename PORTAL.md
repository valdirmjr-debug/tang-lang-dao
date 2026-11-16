# Acesso às Aulas: sugestão de estrutura

A área "Acesso às Aulas" desta versão é um **protótipo**. Ela mostra as telas e o fluxo pedidos, mas tem uma limitação: os cadastros ficam salvos só no navegador de quem usa, e a grade de todas as faixas está dentro do site. Quem souber mexer no navegador consegue ver tudo. Para usar com alunos de verdade, o login e o conteúdo precisam ficar num servidor.

## O que o protótipo já faz

| Pedido | Como está no protótipo |
|---|---|
| Login e senha | Tela `aulas.html`. A senha é guardada como hash SHA-256 com sal, nunca em texto. |
| Professor cadastra, edita e exclui alunos | Tela `aulas-admin.html`. Campos: nome, e-mail, login, senha, arte marcial, grau no Kung Fu e grau no Tai Chi. Também define se o cadastro é de professor. |
| Escolha da modalidade | Tela `aulas-modalidade.html`. A modalidade que o aluno não pratica fica cinza e não abre. |
| Cascata de graus | Tela `aulas-grade.html`. Abre o grau do aluno e todos os anteriores. Os graus acima ficam bloqueados. |
| Conteúdo da grade | Vem do PDF "Grade Curricular - Tang Lang Dao V_0.96" (Kung Fu, 9º ao 1º grau). O PDF não tem a grade de Tai Chi por faixa, então essas telas mostram "ainda será cadastrada". |
| Botões "Grade anterior" e "Próxima grade" | Estão no rodapé da grade, com animação de virar página. "Próxima" só aparece se o aluno já tiver acesso a ela. |
| Sair após 10 minutos parado | Funciona. O aluno volta para o login com um aviso. |
| Evitar cópia | A grade é desenhada como imagem, com o nome do aluno como marca-d'água. Selecionar, copiar, clicar com o botão direito, imprimir e Ctrl+C/S/P/A ficam bloqueados. |

## Logins de exemplo

| Login | Senha | Perfil |
|---|---|---|
| professor | tld2026 | Professor, pode cadastrar |
| aluno.kungfu | kungfu | Kung Fu, 6º grau |
| aluna.taichi | taichi | Tai Chi, 9º grau |
| aluno.ambos | ambos | Kung Fu 8º grau e Tai Chi 10º grau |

## Estrutura sugerida para a versão real

O site já está na Netlify, então o caminho mais curto é usar o que ela oferece:

1. **Login: Netlify Identity ou Auth0/Clerk.**
   - Só convidados: o professor convida o aluno pelo e-mail e ninguém se cadastra sozinho.
   - "Esqueci minha senha" envia um e-mail automático com um link para criar uma senha nova.
   - O papel de professor é marcado no cadastro, como `role: professor`.
2. **Cadastro dos alunos: um banco pequeno.**
   - Pode ser Netlify Blobs, Supabase ou Firebase.
   - Guarda login, nome, e-mail, modalidade, grau no Kung Fu e grau no Tai Chi.
   - Só o professor altera esses dados, por uma função no servidor que confere o papel.
3. **Conteúdo das grades no servidor.**
   - Cada grade fica num arquivo privado (JSON ou PDF) fora da pasta pública.
   - Uma Netlify Function recebe o pedido, confere o login e o grau do aluno, e só então devolve a grade daquele grau ou dos anteriores.
   - Assim, ninguém vê uma faixa acima da sua, nem abrindo o código do site.
4. **Sessão.**
   - O login tem validade curta (uma hora) e é renovado enquanto o aluno usa a área.
   - Depois de 10 minutos sem atividade, o site encerra a sessão, como no protótipo.
5. **Vídeos das aulas gravadas (ideia futura).**
   - Usar Vimeo com vídeos privados ou o Bunny Stream.
   - Os links devem ser assinados e expirar, para não serem repassados.

## Limites da proteção contra cópia

Nenhum site consegue impedir totalmente a cópia: o aluno sempre pode fotografar a tela com outro aparelho. O que dá para fazer é dificultar e desestimular:

- A grade é mostrada como imagem.
- A cópia e a impressão ficam bloqueadas.
- A marca-d'água leva o nome do aluno, o que identifica quem vazou uma foto.

O vídeo pode levar a mesma marca-d'água.

## Custos

- O plano gratuito da Netlify cobre as funções e o Identity para poucas dezenas de alunos.
- O Supabase e o Firebase também têm planos gratuitos suficientes para o começo.
- Vídeos privados costumam ser pagos (Vimeo Starter ou Bunny Stream, cobrado pelo uso).
