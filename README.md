# Gauss n` Roses


Tener en cuenta que si o si debe levantarse la base de datos, sin eso la app no funciona.
Intentamos conectarla a Supabase pero por temas de red no nos permitio.

En cuanto a la funcionalidad es una app 100% funcional que por limitaciones del poder de computo, el proceso de transcripcion dejamos el codigo en el cual estaria corriendo en un servicor y el cual deberiamos llamar para cada curso. Y dependiendo en que momento generes el quiz, si el video esta muy avanzado, te saldra error por el limite de tokens maximos que nos permite nuestro LLM.


El proyecto fue pensado para escalar por lo que decidimos hacer menos vistoso el UI y con algunos Bugs pero con la complejidad de la base de datos que amerita que este proyecto con unas horas mas sea 100% funcional. 

# Instrucciones para correrlo

` npm install `bash
` npx prisma db push `bash
` npx tsx scripts/fake_info.ts `bash

## Para visualizar Base de Datos
` npx prisma studio `bash

## Para correr APP
` npm run dev `bash

