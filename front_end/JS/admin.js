document.addEventListener("DOMContentLoaded", loadQuestions())
const botao = document.querySelector('#cadastrar')
botao.addEventListener('click', async function(event){
    event.preventDefault(); // Impede o envio do formulário
  
  const enunciado = document.querySelector('#enunciado').value;
  const alternativa_a = document.querySelector('#alternativa_a').value;
  const alternativa_b = document.querySelector('#alternativa_b').value;
  const alternativa_c = document.querySelector('#alternativa_c').value;
  const alternativa_d = document.querySelector('#alternativa_d').value;
  const correta = document.querySelector('#correta').value;
  

  const res = await fetch('http://localhost:3000/perguntas',{

      method: "POST",
      headers: {
          "Content-Type": "application/json" // Adiciona o cabeçalho correto
      },
      body: JSON.stringify({
          enunciado: enunciado,
          alternativa_a: alternativa_a,
          alternativa_b: alternativa_b,
          alternativa_c: alternativa_c,
          alternativa_d: alternativa_d,
          correta: correta,
        
               
      })

  });
  
     if (
            !enunciado || enunciado === "" ||
            !alternativa_a || alternativa_a === "" ||
            !alternativa_b || alternativa_b === "" ||
            !alternativa_c || alternativa_c === "" ||
            !alternativa_d || alternativa_d === "" ||
            !correta || correta === ""
        ) {
            return res.status(400).json('Todos os campos são obrigatórios')
        }
  
  if(res.status == 200){
    alert('Questões adicionadas com sucesso')
  }
  else if(res.status == 500){
    alert('Ops...houve um erro ao adicionar')
  } 
  
  })


  async function loadQuestions() {
    const questionList = document.getElementById("questionList");
    questionList.innerHTML = ""; // Limpa a lista antes de carregar

    try {
        const response = await fetch("http://localhost:3000/perguntas");
        const questions = await response.json();

        console.log(questions); // Apenas para garantir que estamos recebendo as perguntas

        // Adiciona cada pergunta à lista
        // questions.map((questao) => addQuestionToPage(questao));
        questions.forEach((questoes, index) => {
          // console.log(`Processando pergunta ${index + 1}:`, questions); // Log para depuração
          console.log(questoes)
          addQuestionToPage(questoes);
      });
    } catch (error) {
        return(error)
    }
}

   async function addQuestionToPage(questoes) {
    const questionList = document.getElementById("questionList");

    const card = document.createElement("div");
    card.classList.add("card");

    const hiddenIdInput = document.createElement("input");
    hiddenIdInput.type = "hidden";
    hiddenIdInput.value = questoes.id_pergunta;
    hiddenIdInput.classList.add("question-id");

    const questionTitle = document.createElement("h3");
    questionTitle.classList.add("card-title");
    questionTitle.innerText = `Pergunta: ${questoes.enunciado}`;

    const alternatives = document.createElement("ul");
    alternatives.classList.add("card-alternatives");
    alternatives.innerText = `A: ${questoes.alternativa_a}, 
                              B: ${questoes.alternativa_b}, 
                              C: ${questoes.alternativa_c},
                              D: ${questoes.alternativa_d}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.classList.add("card-correct-answer");
    correctAnswer.innerText = `Resposta correta: ${questoes.correta}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Excluir";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:3000/perguntas/${questoes.id_pergunta}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert('Pergunta excluída');
                card.remove();
            } else {
                alert("Erro ao deletar a pergunta.");
            }
        } catch (error) {
            console.error("Erro na exclusão:", error);
        }
    });

    const editbutton = document.createElement("button");
    editbutton.innerText = "Editar";
    editbutton.classList.add("edit-button");

    // Monta o card
    card.append(questionTitle, hiddenIdInput, alternatives, correctAnswer, deleteButton, editbutton);
    questionList.appendChild(card);
}
