import json
import random

def calcular_dificuldade(texto):
    """
    Define a dificuldade baseada no número de palavras:
    - Até 8 palavras: Fácil
    - De 9 a 15 palavras: Médio
    - Acima de 15 palavras: Difícil
    """
    num_palavras = len(texto.split())
    if num_palavras <= 8:
        return "Fácil"
    elif num_palavras <= 15:
        return "Médio"
    else:
        return "Difícil"

def generate_biblo_questions(book, chapter, verse_text, verse_number):
    questions = []
    words = verse_text.split()
    dificuldade = calcular_dificuldade(verse_text)
    
    # 1. Questão de Completar (Cloze)
    target_word = words[-1].strip('.,!?;')
    hidden_text = verse_text.replace(target_word, "______")
    
    questions.append({
        "id": f"{book[:3].lower()}-{chapter}-{verse_number}-q1",
        "tipo": "completar",
        "dificuldade": dificuldade,
        "pergunta": f"Complete o versículo de {book} {chapter}:{verse_number}",
        "texto": hidden_text,
        "lacuna": target_word,
        "xp": 10 if dificuldade == "Fácil" else (15 if dificuldade == "Médio" else 20)
    })

    # 2. Questão de Ordenar (Scramble)
    scrambled = words.copy()
    random.shuffle(scrambled)
    
    questions.append({
        "id": f"{book[:3].lower()}-{chapter}-{verse_number}-q2",
        "tipo": "ordenar",
        "dificuldade": dificuldade,
        "pergunta": "Coloque as palavras na ordem correta:",
        "sequencia_correta": words,
        "embaralhado": scrambled,
        "xp": 15 if dificuldade == "Fácil" else (20 if dificuldade == "Médio" else 30)
    })

    return questions

# A sua lista de 100 versículos entra aqui (raw_data)
raw_data = [
    # --- PENTATEUCO (Origens e Lei) ---
    {"livro": "Gênesis", "cap": 1, "ver": 1, "texto": "No princípio criou Deus os céus e a terra"},
    {"livro": "Gênesis", "cap": 1, "ver": 27, "texto": "E criou Deus o homem à sua imagem à imagem de Deus o criou"},
    {"livro": "Gênesis", "cap": 12, "ver": 1, "texto": "Sai-te da tua terra da tua parentela e da casa de teu pai para a terra que eu te mostrarei"},
    {"livro": "Êxodo", "cap": 3, "ver": 14, "texto": "Disse Deus a Moisés Eu Sou o que Sou"},
    {"livro": "Êxodo", "cap": 14, "ver": 14, "texto": "O Senhor pelejará por vós e vós vos calareis"},
    {"livro": "Êxodo", "cap": 20, "ver": 3, "texto": "Não terás outros deuses diante de mim"},
    {"livro": "Levítico", "cap": 19, "ver": 2, "texto": "Santos sereis porque eu o Senhor vosso Deus sou santo"},
    {"livro": "Números", "cap": 6, "ver": 24, "texto": "O Senhor te abençoe e te guarde"},
    {"livro": "Deuteronômio", "cap": 6, "ver": 5, "texto": "Amarás pois o Senhor teu Deus de todo o teu coração e de toda a tua alma"},
    {"livro": "Deuteronômio", "cap": 31, "ver": 6, "texto": "Esforçai-vos e tende bom ânimo não temais nem vos espanteis diante deles"},

    # --- HISTÓRICOS E POÉTICOS ---
    {"livro": "Josué", "cap": 1, "ver": 9, "texto": "Não to mandei eu esforça-te e tem bom ânimo não temas nem te espantes"},
    {"livro": "Josué", "cap": 24, "ver": 15, "texto": "Eu e a minha casa serviremos ao Senhor"},
    {"livro": "1 Samuel", "cap": 16, "ver": 7, "texto": "O homem vê o que está diante dos olhos porém o Senhor olha para o coração"},
    {"livro": "Neemias", "cap": 8, "ver": 10, "texto": "Não vos entristeçais porque a alegria do Senhor é a vossa força"},
    {"livro": "Jó", "cap": 19, "ver": 25, "texto": "Porque eu sei que o meu Redentor vive e que por fim se levantará sobre a terra"},
    {"livro": "Salmos", "cap": 1, "ver": 1, "texto": "Bem-aventurado o homem que não anda segundo o conselho dos ímpios"},
    {"livro": "Salmos", "cap": 19, "ver": 1, "texto": "Os céus declaram a glória de Deus e o firmamento anuncia a obra das suas mãos"},
    {"livro": "Salmos", "cap": 23, "ver": 1, "texto": "O Senhor é o meu pastor nada me faltará"},
    {"livro": "Salmos", "cap": 23, "ver": 4, "texto": "Ainda que eu andasse pelo vale da sombra da morte não temeria mal algum"},
    {"livro": "Salmos", "cap": 27, "ver": 1, "texto": "O Senhor é a minha luz e a minha salvação a quem temerei"},
    {"livro": "Salmos", "cap": 34, "ver": 7, "texto": "O anjo do Senhor acampa-se ao redor dos que o temem e os livra"},
    {"livro": "Salmos", "cap": 37, "ver": 4, "texto": "Deleita-te também no Senhor e ele te concederá os desejos do teu coração"},
    {"livro": "Salmos", "cap": 37, "ver": 5, "texto": "Entrega o teu caminho ao Senhor confia nele e ele tudo fará"},
    {"livro": "Salmos", "cap": 42, "ver": 1, "texto": "Como o cervo brama pelas correntes das águas assim suspira a minha alma por ti ó Deus"},
    {"livro": "Salmos", "cap": 46, "ver": 1, "texto": "Deus é o nosso refúgio e fortaleza socorro bem presente na angústia"},
    {"livro": "Salmos", "cap": 46, "ver": 10, "texto": "Aquietai-vos e sabei que eu sou Deus"},
    {"livro": "Salmos", "cap": 51, "ver": 10, "texto": "Cria em mim ó Deus um coração puro e renova em mim um espírito reto"},
    {"livro": "Salmos", "cap": 91, "ver": 1, "texto": "Aquele que habita no esconderijo do Altíssimo à sombra do Onipotente descansará"},
    {"livro": "Salmos", "cap": 91, "ver": 11, "texto": "Porque aos seus anjos dará ordem a teu respeito para te guardarem em todos os teus caminhos"},
    {"livro": "Salmos", "cap": 100, "ver": 4, "texto": "Entrai pelas portas dele com gratidão e em seus átrios com louvor"},
    {"livro": "Salmos", "cap": 103, "ver": 1, "texto": "Bendize ó minha alma ao Senhor e tudo o que há em mim bendiga o seu santo nome"},
    {"livro": "Salmos", "cap": 119, "ver": 11, "texto": "Escondi a tua palavra no meu coração para não pecar contra ti"},
    {"livro": "Salmos", "cap": 119, "ver": 105, "texto": "Lâmpada para os meus pés é tua palavra e luz para o meu caminho"},
    {"livro": "Salmos", "cap": 121, "ver": 1, "texto": "Levantarei os meus olhos para os montes de onde vem o meu socorro"},
    {"livro": "Salmos", "cap": 121, "ver": 2, "texto": "O meu socorro vem do Senhor que fez o céu e a terra"},
    {"livro": "Salmos", "cap": 125, "ver": 1, "texto": "Os que confiam no Senhor serão como o monte de Sião que não se abala"},
    {"livro": "Salmos", "cap": 126, "ver": 5, "texto": "Os que semeiam em lágrimas segarão com alegria"},
    {"livro": "Salmos", "cap": 133, "ver": 1, "texto": "Oh quão bom e quão suave é que os irmãos vivam em união"},
    {"livro": "Salmos", "cap": 139, "ver": 14, "texto": "Eu te louvarei porque de um modo terrível e tão maravilhoso fui formado"},
    {"livro": "Provérbios", "cap": 1, "ver": 7, "texto": "O temor do Senhor é o princípio do conhecimento"},
    {"livro": "Provérbios", "cap": 3, "ver": 5, "texto": "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento"},
    {"livro": "Provérbios", "cap": 3, "ver": 6, "texto": "Reconhece-o em todos os teus caminhos e ele endireitará as tuas veredas"},
    {"livro": "Provérbios", "cap": 4, "ver": 23, "texto": "Sobre tudo o que se deve guardar guarda o teu coração porque dele procedem as fontes da vida"},
    {"livro": "Provérbios", "cap": 15, "ver": 1, "texto": "A resposta branda desvia o furor mas a palavra dura suscita a ira"},
    {"livro": "Provérbios", "cap": 16, "ver": 3, "texto": "Confia ao Senhor as tuas obras e teus pensamentos serão estabelecidos"},
    {"livro": "Provérbios", "cap": 16, "ver": 9, "texto": "O coração do homem traça o seu caminho mas o Senhor lhe dirige os passos"},
    {"livro": "Provérbios", "cap": 18, "ver": 10, "texto": "Torre forte é o nome do Senhor a ela correrá o justo e estará em alto refúgio"},
    {"livro": "Eclesiastes", "cap": 3, "ver": 1, "texto": "Tudo tem o seu tempo determinado e há tempo para todo o propósito debaixo do céu"},
    {"livro": "Cânticos", "cap": 8, "ver": 7, "texto": "As muitas águas não poderiam apagar esse amor nem os rios afogá-lo"},

    # --- PROFETAS ---
    {"livro": "Isaías", "cap": 6, "ver": 8, "texto": "Depois disto ouvi a voz do Senhor que dizia A quem enviarei e quem há de ir por nós então disse eu Eis-me aqui envia-me a mim"},
    {"livro": "Isaías", "cap": 9, "ver": 6, "texto": "Porque um menino nos nasceu um filho se nos deu e o principado está sobre os seus ombros"},
    {"livro": "Isaías", "cap": 26, "ver": 3, "texto": "Tu conservarás em paz aquele cuja mente está firme em ti porque ele confia em ti"},
    {"livro": "Isaías", "cap": 40, "ver": 31, "texto": "Mas os que esperam no Senhor renovarão as forças subirão com asas como águias"},
    {"livro": "Isaías", "cap": 41, "ver": 10, "texto": "Não temas porque eu sou contigo não te assombres porque eu sou o teu Deus"},
    {"livro": "Isaías", "cap": 43, "ver": 1, "texto": "Não temas porque eu te remi chamei-te pelo teu nome tu és meu"},
    {"livro": "Isaías", "cap": 43, "ver": 13, "texto": "Operando eu quem o impedirá"},
    {"livro": "Isaías", "cap": 53, "ver": 5, "texto": "Mas ele foi ferido por causa das nossas transgressões e moído por causa das nossas iniquidades"},
    {"livro": "Isaías", "cap": 54, "ver": 17, "texto": "Toda a ferramenta preparada contra ti não prosperará"},
    {"livro": "Isaías", "cap": 55, "ver": 6, "texto": "Buscai ao Senhor enquanto se pode achar invocai-o enquanto está perto"},
    {"livro": "Jeremias", "cap": 29, "ver": 11, "texto": "Porque eu bem sei os pensamentos que tenho a vosso respeito diz o Senhor pensamentos de paz e não de mal"},
    {"livro": "Jeremias", "cap": 33, "ver": 3, "texto": "Clama a mim e responder-te-ei e anunciar-te-ei coisas grandes e firmes que não sabes"},
    {"livro": "Lamentações", "cap": 3, "ver": 22, "texto": "As misericórdias do Senhor são a causa de não sermos consumidos porque as suas misericórdias não têm fim"},
    {"livro": "Lamentações", "cap": 3, "ver": 23, "texto": "Novas são cada manhã grande é a tua fidelidade"},
    {"livro": "Habacuque", "cap": 3, "ver": 17, "texto": "Porque ainda que a figueira não floresça nem haja fruto na vide todavia eu me alegrarei no Senhor"},

    # --- NOVO TESTAMENTO (Evangelhos e Atos) ---
    {"livro": "Mateus", "cap": 5, "ver": 14, "texto": "Vós sois a luz do mundo não se pode esconder uma cidade edificada sobre um monte"},
    {"livro": "Mateus", "cap": 6, "ver": 33, "texto": "Mas buscai primeiro o reino de Deus e a sua justiça e todas estas coisas vos serão acrescentadas"},
    {"livro": "Mateus", "cap": 7, "ver": 7, "texto": "Pedi e dar-se-vos-á buscai e encontrareis batei e abrir-se-vos-á"},
    {"livro": "Mateus", "cap": 11, "ver": 28, "texto": "Vinde a mim todos os que estais cansados e oprimidos e eu vos aliviarei"},
    {"livro": "Mateus", "cap": 28, "ver": 19, "texto": "Portanto ide ensinai todas as nações batizando-as em nome do Pai e do Filho e do Espírito Santo"},
    {"livro": "Mateus", "cap": 28, "ver": 20, "texto": "E eis que eu estou convosco todos os dias até à consumação do século"},
    {"livro": "Marcos", "cap": 9, "ver": 23, "texto": "Tudo é possível ao que crê"},
    {"livro": "Lucas", "cap": 1, "ver": 37, "texto": "Porque para Deus nada é impossível"},
    {"livro": "João", "cap": 1, "ver": 1, "texto": "No princípio era o Verbo e o Verbo estava com Deus e o Verbo era Deus"},
    {"livro": "João", "cap": 1, "ver": 12, "texto": "Mas a todos quantos o receberam deu-lhes o poder de serem feitos filhos de Deus"},
    {"livro": "João", "cap": 3, "ver": 16, "texto": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito para que todo aquele que nele crê não pereça mas tenha a vida eterna"},
    {"livro": "João", "cap": 4, "ver": 24, "texto": "Deus é Espírito e importa que os que o adoram o adorem em espírito e em verdade"},
    {"livro": "João", "cap": 8, "ver": 32, "texto": "E conhecereis a verdade e a verdade vos libertará"},
    {"livro": "João", "cap": 10, "ver": 10, "texto": "O ladrão não vem senão a roubar a matar e a destruir eu vim para que tenham vida e a tenham com abundância"},
    {"livro": "João", "cap": 11, "ver": 25, "texto": "Disse-lhe Jesus Eu sou a ressurreição e a vida quem crê em mim ainda que esteja morto viverá"},
    {"livro": "João", "cap": 14, "ver": 6, "texto": "Disse-lhe Jesus Eu sou o caminho e a verdade e a vida ninguém vem ao Pai senão por mim"},
    {"livro": "João", "cap": 14, "ver": 27, "texto": "Deixo-vos a paz a minha paz vos dou não vo-la dou como o mundo a dá"},
    {"livro": "João", "cap": 15, "ver": 5, "texto": "Eu sou a videira vós as varas quem está em mim e eu nele esse dá muito fruto porque sem mim nada podeis fazer"},
    {"livro": "João", "cap": 16, "ver": 33, "texto": "No mundo tereis aflições mas tende bom ânimo eu venci o mundo"},
    {"livro": "Atos", "cap": 1, "ver": 8, "texto": "Mas recebereis a virtude do Espírito Santo que há de vir sobre vós e ser-me-eis testemunhas"},
    {"livro": "Atos", "cap": 4, "ver": 12, "texto": "E em nenhum outro há salvação porque também debaixo do céu nenhum outro nome há dado entre os homens pelo qual devamos ser salvos"},
    {"livro": "Atos", "cap": 16, "ver": 31, "texto": "Crê no Senhor Jesus Cristo e serás salvo tu e a tua casa"},

    # --- CARTAS E APOCALIPSE ---
    {"livro": "Romanos", "cap": 1, "ver": 16, "texto": "Porque não me envergonho do evangelho de Cristo pois é o poder de Deus para salvação de todo aquele que crê"},
    {"livro": "Romanos", "cap": 3, "ver": 23, "texto": "Porque todos pecaram e destituídos estão da glória de Deus"},
    {"livro": "Romanos", "cap": 5, "ver": 8, "texto": "Mas Deus prova o seu amor para conosco em que Cristo morreu por nós sendo nós ainda pecadores"},
    {"livro": "Romanos", "cap": 6, "ver": 23, "texto": "Porque o salário do pecado é a morte mas o dom gratuito de Deus é a vida eterna em Cristo Jesus nosso Senhor"},
    {"livro": "Romanos", "cap": 8, "ver": 1, "texto": "Portanto agora nenhuma condenação há para os que estão em Cristo Jesus"},
    {"livro": "Romanos", "cap": 8, "ver": 28, "texto": "E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus"},
    {"livro": "Romanos", "cap": 8, "ver": 31, "texto": "Que diremos pois a estas coisas se Deus é por nós quem será contra nós"},
    {"livro": "Romanos", "cap": 8, "ver": 37, "texto": "Mas em todas estas coisas somos mais do que vencedores por aquele que nos amou"},
    {"livro": "Romanos", "cap": 10, "ver": 17, "texto": "De sorte que a fé é pelo ouvir e o ouvir pela palavra de Deus"},
    {"livro": "Romanos", "cap": 12, "ver": 2, "texto": "E não vos conformeis com este mundo mas transformai-vos pela renovação do vosso entendimento"},
    {"livro": "1 Coríntios", "cap": 10, "ver": 13, "texto": "Fiel é Deus que não vos deixará tentar acima do que podeis"},
    {"livro": "1 Coríntios", "cap": 13, "ver": 4, "texto": "O amor é sofredor é benigno o amor não é invejoso o amor não trata com leviandade não se ensoberbece"},
    {"livro": "1 Coríntios", "cap": 13, "ver": 13, "texto": "Agora pois permanecem a fé a esperança e o amor estes três mas o maior destes é o amor"},
    {"livro": "1 Coríntios", "cap": 15, "ver": 58, "texto": "Sede firmes e constantes sempre abundantes na obra do Senhor"},
    {"livro": "2 Coríntios", "cap": 5, "ver": 17, "texto": "Assim que se alguém está em Cristo nova criatura é as coisas velhas já passaram eis que tudo se fez novo"},
    {"livro": "2 Coríntios", "cap": 12, "ver": 9, "texto": "A minha graça te basta porque o meu poder se aperfeiçoa na fraqueza"},
    {"livro": "Gálatas", "cap": 2, "ver": 20, "texto": "Já estou crucificado com Cristo e vivo não mais eu mas Cristo vive em mim"},
    {"livro": "Gálatas", "cap": 5, "ver": 22, "texto": "Mas o fruto do Espírito é amor gozo paz longanimidade benignidade bondade fé"},
    {"livro": "Efésios", "cap": 2, "ver": 8, "texto": "Porque pela graça sois salvos por meio da fé e isto não vem de vós é dom de Deus"},
    {"livro": "Efésios", "cap": 6, "ver": 10, "texto": "No demais irmãos meus fortalecei-vos no Senhor e na força do seu poder"},
    {"livro": "Filipenses", "cap": 1, "ver": 21, "texto": "Porque para mim o viver é Cristo e o morrer é ganho"},
    {"livro": "Filipenses", "cap": 4, "ver": 4, "texto": "Regozijai-vos sempre no Senhor outra vez digo regozijai-vos"},
    {"livro": "Filipenses", "cap": 4, "ver": 7, "texto": "E a paz de Deus que excede todo o entendimento guardará os vossos corações e os vossos sentimentos em Cristo Jesus"},
    {"livro": "Filipenses", "cap": 4, "ver": 13, "texto": "Posso todas as coisas naquele que me fortalece"},
    {"livro": "Colossenses", "cap": 3, "ver": 23, "texto": "E tudo quanto fizerdes fazei-o de todo o coração como ao Senhor e não aos homens"},
    {"livro": "1 Tessalonicenses", "cap": 5, "ver": 17, "texto": "Orai sem cessar"},
    {"livro": "2 Timóteo", "cap": 1, "ver": 7, "texto": "Porque Deus não nos deu o espírito de temor mas de fortaleza e de amor e de moderação"},
    {"livro": "2 Timóteo", "cap": 4, "ver": 7, "texto": "Combati o bom combate acabei a carreira guardei a fé"},
    {"livro": "Hebreus", "cap": 4, "ver": 12, "texto": "Porque a palavra de Deus é viva e eficaz e mais penetrante do que espada alguma de dois gumes"},
    {"livro": "Hebreus", "cap": 11, "ver": 1, "texto": "Ora a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem"},
    {"livro": "Hebreus", "cap": 12, "ver": 2, "texto": "Olhando para Jesus autor e consumador da fé"},
    {"livro": "Hebreus", "cap": 13, "ver": 8, "texto": "Jesus Cristo é o mesmo ontem e hoje e eternamente"},
    {"livro": "Tiago", "cap": 1, "ver": 5, "texto": "E se algum de vós tem falta de sabedoria peça-a a Deus que a todos dá liberalmente"},
    {"livro": "Tiago", "cap": 4, "ver": 7, "texto": "Sujeitai-vos pois a Deus resisti ao diabo e ele fugirá de vós"},
    {"livro": "1 Pedro", "cap": 5, "ver": 7, "texto": "Lançando sobre ele toda a vossa ansiedade porque ele tem cuidado de vós"},
    {"livro": "1 João", "cap": 1, "ver": 9, "texto": "Se confessarmos os nossos pecados ele é fiel e justo para nos perdoar os pecados e nos purificar de toda a injustiça"},
    {"livro": "1 João", "cap": 4, "ver": 8, "texto": "Aquele que não ama não conhece a Deus porque Deus é amor"},
    {"livro": "1 João", "cap": 5, "ver": 4, "texto": "Porque todo o que é nascido de Deus vence o mundo e esta é a vitória que vence o mundo a nossa fé"},
    {"livro": "Apocalipse", "cap": 3, "ver": 20, "texto": "Eis que estou à porta e bato se alguém ouvir a minha voz e abrir a porta entrarei em sua casa e com ele cearei"},
    {"livro": "Apocalipse", "cap": 22, "ver": 13, "texto": "Eu sou o Alfa e o Ômega o princípio e o fim o primeiro e o derradeiro"}
]

full_content = []

for item in raw_data:
    questions = generate_biblo_questions(item['livro'], item['cap'], item['texto'], item['ver'])
    
    lesson = {
        "id": f"lesson-{item['livro'][:3].lower()}-{item['cap']}-{item['ver']}",
        "titulo": f"{item['livro']} {item['cap']}:{item['ver']}",
        "dificuldade_geral": calcular_dificuldade(item['texto']),
        "questoes": questions
    }
    full_content.append(lesson)

# Salva o resultado
with open('biblo_lessons_v2.json', 'w', encoding='utf-8') as f:
    json.dump(full_content, f, ensure_ascii=False, indent=2)

print(f"JSON gerado com níveis de dificuldade!")