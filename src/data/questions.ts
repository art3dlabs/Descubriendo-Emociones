import { CategoryName } from '../types';

export const CATEGORY_COLORS: Record<CategoryName, string> = {
  "Relaciones Mágicas": "#6366f1",
  "Mi Mundo": "#a855f7",
  "Mar de Emociones": "#ec4899",
  "Caja de Sorpresas": "#f59e0b",
  "Misiones Especiales": "#10b981"
};

export const CATEGORY_ICONS: Record<CategoryName, string> = {
  "Relaciones Mágicas": "fa-heart",
  "Mi Mundo": "fa-earth-americas",
  "Mar de Emociones": "fa-water",
  "Caja de Sorpresas": "fa-gift",
  "Misiones Especiales": "fa-star"
};

export const QUESTION_BANK: Record<CategoryName, string[]> = {
  "Relaciones Mágicas": [
    "¿Quién es esa persona que siempre logra sacarte una sonrisa cuando estás triste?",
    "¿Qué es lo que más te gusta hacer en familia durante los fines de semana?",
    "Si pudieras regalarle un superpoder a tu mejor amigo/a, ¿cuál le darías y por qué?",
    "¿Qué abrazo recuerdas como el más reconfortante que hayas recibido?",
    "¿Hay alguna regla de casa que te gustaría cambiar o negociar?",
    "¿Qué cualidad admiras profundamente de la persona que se sienta a tu lado?",
    "¿Cómo te das cuenta de que alguien en tu familia necesita un gesto de cariño?",
    "¿Qué actividad comparten en la que sientas que el tiempo pasa muy rápido?",
    "¿Cuál ha sido el momento más divertido que recuerdes junto a tus amigos/as?",
    "Si tu familia fuera una banda de música o equipo de superhéroes, ¿qué rol tendría cada uno?",
    "¿Qué palabra usas con más frecuencia para demostrar amor a tus seres queridos?",
    "¿Cómo te gusta que te consuelen cuando sientes enfado o tristeza?",
    "¿Qué es algo que aprendiste de tus abuelos o adultos mayores que nunca olvidarás?",
    "¿Qué detalle o pequeño gesto tuyo hace sonreír a los demás?",
    "¿A quién acudirías si tuvieras un secreto muy importante y necesitaras consejo?",
    "¿Qué tradición o costumbre familiar es tu favorita?",
    "¿Cómo reaccionas cuando un amigo/a piensa de forma muy diferente a la tuya?",
    "¿Qué es lo más valioso que puede ofrecer una persona en una amistad?",
    "¿Qué lugar de la casa sientes que es el más cálido y acogedor para reunirse?",
    "¿Qué palabra te gustaría escuchar más seguido por parte de tus seres queridos?",
    "¿Qué apodo cariñoso te gusta que te digan y quién te lo puso?",
    "¿Cómo celebras los logros de las personas que te rodean?",
    "¿Qué te hace sentir más orgulloso/a de tu grupo de amigos?",
    "¿Qué consejo le darías a alguien que se siente solo en el recreo o trabajo?",
    "¿Qué palabra define mejor la armonía dentro de tu hogar?",
    "¿Cuál es el regalo más significativo que has hecho o recibido?",
    "¿Cómo demuestras agradecimiento cuando alguien te ayuda sin que se lo pidas?",
    "¿Qué actividad familiar te gustaría que se repita más seguido?",
    "¿Qué te enseñó una discusión que tuviste con alguien querido en el pasado?",
    "¿Qué significa para ti ser un buen compañero o compañera?"
  ],
  "Mi Mundo": [
    "Si pudieras inventar una asignatura o materia para la escuela, ¿cuál sería?",
    "¿Qué paisaje o lugar que viste alguna vez te transmitió una paz absoluta?",
    "Si pudieras viajar en el tiempo por un día, ¿irías al pasado o al futuro?",
    "¿Qué objeto pequeño de tu habitación tiene un significado especial para ti?",
    "¿Qué causa social o de la naturaleza te gustaría ayudar a proteger?",
    "Si tuvieras la oportunidad de construir una casa en un árbol, ¿cómo la diseñarías?",
    "¿Qué sonido de la naturaleza te resulta más relajante y agradable?",
    "¿Qué es lo más curioso que has descubierto sobre el mundo en el último tiempo?",
    "Si fueras un animal durante un día entero, ¿cuál elegirías ser y qué harías?",
    "¿Qué comida o aroma te transporta inmediatamente a un recuerdo feliz de la infancia?",
    "¿Qué superpoder te ayudaría a resolver los problemas de tu entorno escolar o laboral?",
    "¿Qué invento de la humanidad consideras que ha sido el más útil de todos?",
    "¿Qué espacio de tu rutina diaria disfrutas contemplar en silencio?",
    "Si fueras el/la creador/a de un planeta nuevo, ¿cuál sería su regla principal?",
    "¿Qué talento o habilidad te gustaría aprender si tuvieras tiempo ilimitado?",
    "¿Cómo imaginas un día perfecto desde que te levantas hasta que te acostás?",
    "¿Qué misterio del universo te genera mucha curiosidad por resolver?",
    "Si pudieras hablar con los animales, ¿a cuál le harías la primera pregunta?",
    "¿Qué es lo que más te enorgullece del lugar donde vives?",
    "¿Qué elemento de la tecnología actual te gustaría desconectar por un tiempo?",
    "Si pudieras diseñar tu propia ciudad ideal, ¿qué edificio nunca faltaría?",
    "¿Qué libro, película o historia te marcó profundamente en tu forma de ver la vida?",
    "¿Qué actividad artística te permite desconectar y expresar lo que sientes?",
    "Si tuvieras un programa de radio propio, ¿de qué temas hablarías?",
    "¿Qué estación del año disfrutas más y por qué razón?",
    "Si pudieras cambiar una ley del mundo actual, ¿cuál cambiarías?",
    "¿Qué monumento histórico o maravilla del mundo te gustaría visitar en persona?",
    "¿Qué mensaje dejarías escrito en una cápsula del tiempo para dentro de 50 años?",
    "¿Qué valor consideras indispensable para que la sociedad funcione mejor?",
    "Si tu vida fuera un mapa de descubrimientos, ¿cuál es tu próximo gran destino?"
  ],
  "Mar de Emociones": [
    "¿En qué parte de tu cuerpo sientes la frustración cuando algo no sale como esperabas?",
    "¿Qué actividad o música te ayuda a calmar la mente cuando sientes enojo?",
    "¿Cuál es el miedo más grande que has logrado superar hasta hoy?",
    "¿Cómo describirías el color y la forma de la felicidad si fueras a dibujarla?",
    "¿Qué te hace sentir seguro/a cuando experimentas incertidumbre o cambios?",
    "¿Qué pensamiento te ayuda a levantarte con energía por las mañanas?",
    "¿Cuándo fue la última vez que sentiste orgullo por ti mismo/a y por qué motivo?",
    "¿Qué emoción te resulta más difícil de expresar en palabras frente a los demás?",
    "¿Qué pequeño logro personal de esta semana merece ser celebrado?",
    "¿Qué haces para recargar energías cuando te sientes agotado/a emocionalmente?",
    "¿Qué persona te ayuda a mantener la calma durante los momentos difíciles?",
    "¿Qué pensamiento positivo te repites cuando sientes vergüenza o timidez?",
    "¿Cómo reaccionas cuando cometes un error importante? ¿Te perdonas con facilidad?",
    "¿Qué objeto o amuleto te transmite tranquilidad tener cerca?",
    "¿Qué sentimiento te invade cuando ves a otra persona lograr algo muy deseado?",
    "¿Qué olor o sabor te provoca una sensación instantánea de alegría?",
    "¿En qué momentos del día sientes que puedes ser 100% tú mismo/a sin filtros?",
    "¿Qué aprendizaje valioso te ha dejado un momento de tristeza en el pasado?",
    "¿Qué palabra o frase reconfortante te gustaría recordar en momentos de estrés?",
    "¿Cómo distingues cuando estás cansado/a físicamente de cuando lo estás mentalmente?",
    "¿Qué haces cuando sientes que la paciencia se te agota por completo?",
    "¿Cómo expresas gratitud hacia las personas que te apoyan en silencio?",
    "¿Qué situación reciente te sacó una sonrisa inesperada en un día gris?",
    "¿Qué significa para ti tener valentía ante un obstáculo difícil?",
    "¿Cómo te preparas mentalmente antes de afrontar un gran desafío?",
    "¿Qué emoción predominó en tu día de ayer y por qué?",
    "¿Qué consejo te darías a ti mismo/a cuando te sientes abrumado/a?",
    "¿Cómo celebras tus pequeñas victorias cotidianas?",
    "¿Qué te ayuda a soltar la culpa cuando las cosas no salen como planeabas?",
    "¿Qué palabra describe tu estado de ánimo actual y por qué?"
  ],
  "Caja de Sorpresas": [
    "Si tuvieras un robot personal durante una semana, ¿cuál sería su tarea principal?",
    "¿Preferirías tener la capacidad de volar muy alto o de ser invisible cuando quieras?",
    "Si pudieras cenar con cualquier personaje de ficción o historia, ¿a quién elegirías?",
    "¿Qué objeto cotidiano consideras que tendría un uso gracioso si fuera gigante?",
    "Si pudieras cambiar el color del cielo por un día, ¿qué tono elegirías?",
    "¿Cuál es la prenda de vestir más rara o divertida que has usado en tu vida?",
    "Si tuvieras que ponerle un título de película a tu vida actual, ¿cuál sería?",
    "¿Qué canción te resulta imposible escuchar sin empezar a mover los pies?",
    "Si pudieras vivir dentro de un juego de mesa o videojuego, ¿cuál escogerías?",
    "¿Qué alimento comerías todos los días sin cansarte jamás?",
    "Si tu mascota o planta hablara, ¿cuál crees que sería su frase más recurrente?",
    "¿Qué poder absurdo o divertido te gustaría tener (ej. que las verduras sepan a chocolate)?",
    "Si encontraras una lámpara mágica con 3 deseos, ¿cuál sería el primero?",
    "¿Qué juguete de la infancia guardas o recordarás con más cariño?",
    "Si pudieras comunicarte a través de un idioma inventado, ¿cómo sonaría?",
    "¿Qué experiencia divertida te gustaría repetir una y otra vez?",
    "Si pudieras cambiar de profesión o actividad por 24 horas, ¿qué serías?",
    "¿Qué lugar extraño te gustaría explorar si supieras que nada malo va a pasar?",
    "Si crearas una fiesta o festividad nacional nueva, ¿qué se celebraría en ella?",
    "¿Qué palabra te parece la más divertida de pronunciar en voz alta?",
    "Si pudieras tener cualquier animal exótico como vecino inofensivo, ¿cuál elegirías?",
    "¿Qué sabor de helado loco e imposible te gustaría inventar?",
    "Si los objetos pudieran hablar por cinco minutos en tu casa, ¿cuál se quejaría primero?",
    "¿Qué superpoder inútil pero gracioso te gustaría poseer?",
    "Si tuvieras que cambiar tu nombre por el de una fruta o flor, ¿cuál elegirías?",
    "¿Qué invención absurda te gustaría patrocinar en un concurso de inventos?",
    "Si pudieras teletransportarte por un segundo, ¿a qué lugar del mundo irías ahora mismo?",
    "¿Qué disfraz usarías si tuvieras que ir a una fiesta temática en este instante?",
    "Si pudieras añadir un efecto de sonido a tus pasos al caminar, ¿cómo sonaría?",
    "¿Qué chiste o anécdota graciosa nunca te cansas de contar?"
  ],
  "Misiones Especiales": [
    "Haz una representación con mímica de tu emoción favorita para que los demás la adivinen.",
    "Di tres cualidades positivas de la persona a tu derecha mirándola a los ojos.",
    "Inventa un saludo secreto de 3 pasos y enséñaselo a todo el grupo.",
    "Realiza 5 respiraciones profundas junto al grupo contando hasta 4 en cada inhalación.",
    "Dibuja en el aire una figura que represente la calma para ti.",
    "Busca un objeto en el espacio donde están que tenga tu color favorito y explica por qué.",
    "Canta el estribillo de una canción que te ponga de buen humor.",
    "Posa durante 10 segundos representando una estatua de la alegría.",
    "Cuenta un chiste breve o haz una cara graciosa para sacar una carcajada general.",
    "Haz un cumplido sincero a cada uno de los integrantes de la mesa.",
    "Imita el sonido de un animal que represente cómo te sientes hoy.",
    "Regala un choque de manos o abrazo de oso al participante de tu izquierda.",
    "Mantén la mirada con otro jugador durante 15 segundos sin reírte.",
    "Nombra 3 cosas por las que te sientas profundamente agradecido/a el día de hoy.",
    "Realiza un baile improvisado de 10 segundos como si estuvieras celebrando un gol.",
    "Inventa una frase de ánimo para el grupo y dila con voz de locutor de radio.",
    "Muestra tu mejor postura de superhéroe o superheroína durante 5 segundos.",
    "Di una palabra difícil al revés o intenta decir un trabalenguas rápido.",
    "Haz un gesto de aplauso grupal donde todos aplaudan con el mismo ritmo.",
    "Cierra los ojos por 10 segundos y piensa en tu recuerdo más feliz del año.",
    "Haz un estiramiento de brazos guiando al resto del grupo por 10 segundos.",
    "Dibuja una sonrisa grande con tus dedos en el aire y mándala al grupo.",
    "Imita el andar de un robot durante 5 pasos y regresa a tu lugar.",
    "Di 'Te quiero' o 'Gracias' en tres idiomas diferentes.",
    "Haz una reverencia de agradecimiento teatral al jugador frente a ti.",
    "Tararea una melodía alegre y deja que los demás adivinen cuál es.",
    "Menciona un talento oculto que tengas y demuéstralo en 5 segundos.",
    "Haz un gesto de victoria con ambas manos y celebra con energía.",
    "Dale un aplauso de 5 segundos al jugador que estuvo antes que tú.",
    "Adopta una postura de máxima relajación y respira hondo con una sonrisa."
  ]
};

export const HOST_QUOTES = {
  start: [
    "¡Hola a todos! Soy Koko. Tómense todo el tiempo que necesiten, acá la mesa escucha a cada uno a su propio ritmo.",
    "¡Bienvenidos! Cada participante tiene su espacio. Guardamos silencio y escuchamos atentamente a quien le toque.",
    "¡Hola! Aquí las preguntas se leen despacio y nadie apura las respuestas. Cuando gusten, comenzamos."
  ],
  spin: [
    "La ruleta gira casilla por casilla. Vamos a ver qué temática queda señalada...",
    "Girando la ruleta sin apuro. Aguardamos a que se detenga en una categoría.",
    "La ruleta se mueve lentamente hasta marcar la pregunta del turno."
  ],
  correct: [
    "La mesa escuchó cada palabra con mucha atención. Se suma un punto al marcador.",
    "Un pensamiento muy claro. Registramos el punto mientras la conversación continúa.",
    "Escuchamos atentamente tu punto de vista. Sumamos un punto para ti."
  ],
  points: [
    "Se suma un punto al marcador mientras conversamos en grupo.",
    "Punto registrado. Koko anota el avance en la tabla de posiciones.",
    "Un punto más acumulado. Seguimos escuchando las opiniones de todos."
  ],
  roundComplete: [
    "Completamos una ronda entera. Todos los participantes tuvieron su turno y escuchamos cada respuesta.",
    "Una ronda más donde cada uno se tomó su tiempo para hablar. Continuamos en la siguiente.",
    "Ronda finalizada. Observamos cómo avanza la tabla mientras hacemos una breve pausa."
  ],
  mission: [
    "Aparece una Misión Especial en pantalla. Leemos la consigna y la realizamos en grupo.",
    "Una consigna grupal para hacer juntos. Nos tomamos unos momentos para llevarla a cabo.",
    "Misión activa en el tablero. Todos observan y participan al mismo tiempo."
  ],
  turn: [
    "Es tu turno. Podés pensar el tiempo que quieras antes de hablar.",
    "La pregunta queda disponible en pantalla. Cuando gustes, leés la consigna en voz alta.",
    "Tenés todo el espacio disponible. La mesa escucha en silencio tu intervención."
  ],
  idle: [
    "Aquí no hay reloj ni apuros. Quien necesite un momento para pensar, puede tomárselo tranquilamente.",
    "La mesa aguarda en calma. Quien habla tiene la palabra y los demás escuchamos.",
    "Si querés releer la tarjeta, queda en pantalla el tiempo que haga falta."
  ],
  night: [
    "Modo Rutina Nocturna en pantalla. Las preguntas se leen pausadamente en un ambiente de calma.",
    "Espacio nocturno activado. Mantenemos un tono suave y pausado para cerrar la jornada."
  ],
  coop: [
    "Modo Cooperativo activado. El equipo trabaja unido en las respuestas y consignas grupales."
  ]
};
