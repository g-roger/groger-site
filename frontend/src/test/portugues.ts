// Ajuda dos testes: acha trechos em português num texto que deveria estar todo em inglês.

// nomes próprios que mantêm a grafia original, com acento
const NOMES_PROPRIOS = ['Itaú', 'São Paulo', 'Estação Hack']

const ACENTOS = /[ãõçáéíóúâêôà]/gi

// palavras que existem em português e não existem em inglês
// (sem pegar pedaços de palavras com hífen, como o "e" de "e-commerce")
const PALAVRAS = /(?<![\w-])(de|da|dos|das|para|em|na|nas|uma|que|não|pelo|pela|como|mais|você|também|sobre|hoje|aqui|ao|aos|e)(?![\w-])/gi

export function trechosEmPortugues(texto: string): string[] {
  let limpo = texto
  for (const nome of NOMES_PROPRIOS) limpo = limpo.split(nome).join(' ')
  return [...(limpo.match(ACENTOS) ?? []), ...(limpo.match(PALAVRAS) ?? [])]
}
