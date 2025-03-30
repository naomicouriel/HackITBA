// scripts/seed-minimo.ts

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log("👨‍🏫 Creando profesor...")
  const profesor = await prisma.user.create({
    data: {
      name: "Juan Profesor",
      email: "juan.profesor@example.com",
      role: "PROFESSOR",
    },
  })

  console.log("👨‍🎓 Creando alumno...")
  const alumno = await prisma.user.create({
    data: {
      name: "Pedro Alumno",
      email: "pedro.alumno@example.com",
      role: "STUDENT",
    },
  })

  console.log("📘 Creando curso asociado al profesor...")
  const curso = await prisma.course.create({
    data: {
      name: "Curso de Ciudadanía y Libertad",
      professorId: profesor.id,
    },
  })

  console.log("📄 Leyendo archivo de segmentos...")
  const filePath = path.resolve(__dirname, './mocks/curso_finanzas.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const json = JSON.parse(rawData)

  if (!json.segments || !Array.isArray(json.segments)) {
    throw new Error("El JSON no tiene la estructura esperada (falta 'segments')")
  }

  console.log("🧩 Insertando segmentos en la base de datos...")
  for (const seg of json.segments) {
    await prisma.segment.create({
      data: {
        start: seg.start,
        end: seg.end,
        text: seg.text.trim(),
        course: {
          connect: { id: curso.id },
        },
      },
    })
  }

  // Array con los tópicos a insertar
  const defaultTopics = [
    "Finanzas desde cero",
    "Bancos Federales",
    "Tasas de interés",
    "Inflación",
    "Devaluación",
    "Tipos de inversión",
    "Renta fija",
    "Renta variable",
  ]

  console.log("🔖 Insertando topics en la base de datos...")
  for (const topicName of defaultTopics) {
    await prisma.topic.create({
      data: {
        name: topicName,
        courseId: curso.id, // asocia al curso creado
      },
    })
  }

  console.log("✅ Listo! Datos mínimos, segmentos y topics insertados.")
  console.table({ profesor, alumno, curso })
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
